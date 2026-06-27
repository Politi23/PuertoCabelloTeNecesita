# PuertoCabelloTeNecesita

Plataforma web de **coordinación verificada de ayuda** tras el terremoto en Puerto Cabello, Carabobo, Venezuela.

> Este archivo es la fuente de verdad del proyecto. Léelo completo antes de escribir código. Si algo no está definido aquí, elige la opción más simple, segura y mantenible, y déjalo anotado en `DECISIONS.md`.

---

## 1. Objetivo

Un único lugar confiable donde:

1. Se muestra el **estado de abastecimiento de los lugares principales** de la ciudad (qué necesitan ahora y qué ya NO), actualizado por un coordinador con info que le pasan los responsables de cada sitio.
2. Cualquier persona puede **enviar una petición de ayuda** (escombros, ropa, comida, medicina, mudanza, etc.).
3. Un **coordinador (admin)** revisa cada petición y solo lo aprobado se publica.

El problema que resuelve es la **duplicidad y el desperdicio** de la ayuda espontánea: si cada cosa tiene un estado claro y verificado, nadie repite esfuerzos ni lleva ayuda donde ya no hace falta.

**Principio rector:** nada se publica sin revisión humana. La confianza es el producto.

---

## 2. Stack tecnológico

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Framework | **Next.js 14 (App Router)** | SSR/RSC, rutas protegidas, despliegue directo en Vercel |
| Lenguaje | **TypeScript** (estricto) | Seguridad de tipos en datos sensibles |
| Backend / DB | **Supabase** (Postgres + Auth + Realtime + RLS) | Base de datos, autenticación de admin y actualizaciones en vivo sin servidor propio |
| Estilos | **Tailwind CSS** | Mobile-first, rápido, consistente con el demo |
| Componentes | **shadcn/ui** (Radix UI) | Accesibles por defecto, sin lock-in |
| Iconos | **lucide-react** | Coinciden con el demo |
| Data fetching | **TanStack Query (React Query)** | Caché, revalidación y estado de servidor |
| Formularios | **React Hook Form + Zod** | Validación robusta de entradas del público |
| Despliegue | **Vercel** | CI/CD automático desde el repo |

No agregues dependencias fuera de esta lista sin justificarlo en `DECISIONS.md`.

---

## 3. Roles

- **Público (anónimo):** ve el tablero y envía peticiones. No se registra.
- **Coordinador / Admin (autenticado):** aprueba, edita o rechaza peticiones; actualiza el estado de los lugares. Es el único con cuenta.

El acceso de admin se controla con **Supabase Auth** (email + contraseña) y un guard en `middleware.ts` que protege `/admin`.

---

## 4. Modelo de datos (Supabase / Postgres)

Crea estas migraciones en `supabase/migrations`. **Activa Row Level Security (RLS) en todas las tablas.**

```sql
-- Tipos
create type urgency_level as enum ('critico','alta','media','abastecido');
create type request_status as enum ('pendiente','aprobada','rechazada','en_proceso','resuelta');
create type need_kind as enum ('necesita','no_necesita');

-- Perfiles de admins (1:1 con auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'coordinator',
  created_at timestamptz not null default now()
);

-- Lugares principales (curados por el admin)
create table locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,                 -- "Hospital general", "Residencia geriátrica", etc.
  plus_code text,                     -- código de Google (ej. FXF9+9W6)
  zone text,
  urgency urgency_level not null default 'media',
  is_verified boolean not null default false,
  verified_source text,              -- "Dirección del hospital", "Comando de la base"...
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Necesidades de cada lugar (qué necesita / qué ya no)
create table location_needs (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references locations(id) on delete cascade,
  item text not null,
  kind need_kind not null default 'necesita',
  high_priority boolean not null default false,
  created_at timestamptz not null default now()
);

-- Peticiones de la comunidad
create table requests (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  zone text not null,
  description text not null,
  contact text,                      -- PRIVADO: solo lo ve el admin
  status request_status not null default 'pendiente',
  is_public boolean not null default false,
  approved_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Políticas RLS (lo más importante de seguridad)

```sql
alter table profiles enable row level security;
alter table locations enable row level security;
alter table location_needs enable row level security;
alter table requests enable row level security;

-- LECTURA PÚBLICA de lugares y necesidades (cualquiera puede ver el tablero)
create policy "public read locations" on locations for select to anon, authenticated using (true);
create policy "public read needs" on location_needs for select to anon, authenticated using (true);

-- ESCRITURA de lugares y necesidades: solo admins autenticados
create policy "admin write locations" on locations for all to authenticated using (true) with check (true);
create policy "admin write needs" on location_needs for all to authenticated using (true) with check (true);

-- El público PUEDE crear peticiones, pero NO leer la tabla base (protege el contacto)
create policy "anyone can submit request" on requests for insert to anon, authenticated with check (true);
create policy "admin full requests" on requests for all to authenticated using (true) with check (true);
-- (no hay policy de SELECT para anon sobre requests -> queda bloqueada)
```

### Vista pública sin datos sensibles

El público debe ver las peticiones **aprobadas** pero **nunca el contacto**. Postgres no filtra por columna en RLS, así que exponemos una vista:

```sql
create view public_requests
with (security_invoker = on) as
select id, category, zone, description, status, created_at, updated_at
from requests
where is_public = true and status in ('aprobada','en_proceso','resuelta');

grant select on public_requests to anon, authenticated;
```

Regla extra (trigger): al insertar una petición desde el público, fuerza `status = 'pendiente'` e `is_public = false`. Solo el admin puede cambiar eso.

### Realtime

Activa Supabase Realtime en `locations`, `location_needs` (tablero público en vivo) y `requests` (bandeja del admin se actualiza sola). El público escucha cambios de lugares; para peticiones el público revalida con React Query.

---

## 5. Pantallas y rutas

```
/                     Tablero público (lugares + peticiones aprobadas)
/enviar               Formulario para enviar una petición
/admin/login          Login del coordinador
/admin                Panel: bandeja de pendientes + editor de lugares  (protegido)
```

### Tablero público `/`
- Franja de situación: lugares monitoreados, peticiones activas, última actualización.
- Sección **Lugares principales**: tarjetas con nombre, tipo, sello "Verificado · {fuente}", pill de urgencia, lista "Necesita ahora" (con prioridad), "Ya no necesita" (tachado), y "Actualizado hace X" (verde si < 1 h, ámbar si más).
- Sección **Peticiones de la comunidad**: filtros por categoría, tarjetas con categoría, zona, descripción y estado. **Sin contacto visible.**

### Enviar petición `/enviar`
- Campos: categoría (select), zona/dirección, descripción, contacto (privado).
- Validación con Zod. Al enviar: mensaje claro de que será revisada antes de publicarse.
- Nota visible: "Tu contacto no se muestra al público, solo lo ve el coordinador."

### Panel admin `/admin`
- **Bandeja de pendientes:** cada petición con botones Aprobar / Editar / Rechazar. Aprobar → `status='aprobada'`, `is_public=true`. Aquí SÍ se ve el contacto.
- **Editor de lugares:** seleccionar lugar, editar necesidades (necesita / ya no necesita), nivel de urgencia; al guardar actualiza `updated_at` y `updated_by`.

---

## 6. Diseño

Mobile-first, oscuro, sobrio e institucional (es una herramienta de emergencia, no una app llamativa). **Toma el archivo `puertocabellotenecesita-demo.html` como referencia visual exacta** y pórtalo a componentes React + Tailwind.

**Tokens de color** (inspirados en la bandera de Puerto Cabello: azul intenso, rojo, franja verde, destellos dorados del faro)
```
--bg: #060E1C        fondo (azul marino profundo, base de la bandera)
--surface: #0A1A30   tarjetas
--line: #153055      bordes
--ink: #EDF1FA       texto
--muted: #7896B8     texto secundario
--gold: #CDA020      acento / interacción (amarillo del faro)
--crit: #C82030      crítico (rojo de la bandera)
--warn: #C07525      media/alta
--ok: #2A9850        resuelto / abastecido (verde de la franja)
```
**Tipografías (Google Fonts):** `Archivo` (títulos), `IBM Plex Sans` (cuerpo/UI), `IBM Plex Mono` (datos y timestamps).

El color de urgencia y la frescura del timestamp **codifican información**, no son decoración: son la señal de confianza del tablero.

Piso de calidad: responsive hasta móvil, foco visible por teclado, `prefers-reduced-motion` respetado.

Para auditar y pulir la interfaz usa el skill `/impeccable` — cubre jerarquía visual, espaciado, tipografía, color, accesibilidad, estados vacíos y micro-interacciones.

---

## 7. Privacidad y seguridad (no negociable)

- El **contacto de quien pide nunca es público**. Se guarda en `requests.contact` y solo se sirve por la tabla base (admin). El público usa `public_requests`, que no incluye esa columna.
- RLS activo en todas las tablas; el público solo lee lugares, necesidades y `public_requests`.
- `SUPABASE_SERVICE_ROLE_KEY` **solo en el servidor**, nunca en el cliente.
- Nada de datos personales en URLs ni query params.
- Validación de toda entrada del público con Zod, también del lado servidor.

---

## 8. Datos semilla (los 5 lugares reales)

Crea un seed con estos lugares. Las **necesidades quedan vacías o de ejemplo**; las llenará el coordinador con lo que le diga cada contacto.

| Nombre | Tipo | Plus code | Zona |
|--------|------|-----------|------|
| Hospital Dr. Adolfo Prince Lara | Hospital general (24 h) | FXF9+9W6 | Puerto Cabello |
| Hospital Naval Francisco Isnardi | Hospital militar | F2GF+QFR | Puerto Cabello |
| Hospital José F. Molina Sierra | Hospital | FX7V+P3M | Puerto Cabello |
| Sun And Sea | Residencia geriátrica | FXJ6+3W6 | Puerto Cabello |
| Residencias Maori 5 | Edificio de apartamentos | — | Cumboto Norte |

**Categorías de peticiones:** Escombros · Ropa · Comida y agua · Medicina · Mudanza · Refugio · Voluntariado · Otro.

---

## 9. Estructura de carpetas sugerida

```
app/
  (public)/page.tsx
  (public)/enviar/page.tsx
  admin/login/page.tsx
  admin/page.tsx
components/
  ui/                 # shadcn
  locations/          # LocationCard, NeedsList, UrgencyPill...
  requests/           # RequestCard, RequestForm, PendingItem...
  layout/
lib/
  supabase/client.ts
  supabase/server.ts
  validations/        # esquemas Zod
  utils.ts
types/
supabase/migrations/
middleware.ts         # protege /admin
```

**Variables de entorno** (`.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # solo servidor
```

---

## 10. Orden de implementación (para Claude Code)

1. Inicializa Next.js 14 + TypeScript + Tailwind. Configura shadcn/ui, fuentes y tokens de color.
2. Crea el cliente de Supabase (browser y server) y `middleware.ts`.
3. Escribe las migraciones SQL (sección 4) y la vista `public_requests`. Activa RLS y Realtime.
4. Seed de los 5 lugares y las categorías.
5. Tablero público `/` consumiendo `locations` + `location_needs` + `public_requests` (con React Query + Realtime en lugares).
6. Formulario `/enviar` con React Hook Form + Zod (inserta en `requests`).
7. Auth de admin (`/admin/login`) y guard de rutas.
8. Panel `/admin`: bandeja de pendientes (aprobar/editar/rechazar) y editor de lugares.
9. Pulido: estados vacíos, toasts, accesibilidad, responsive.
10. Deploy en Vercel.

---

## 11. Criterios de aceptación

- [ ] El público ve el tablero sin iniciar sesión y **nunca** ve el contacto de nadie.
- [ ] Una petición enviada por el público entra como `pendiente` y **no aparece** hasta ser aprobada.
- [ ] El admin puede aprobar, editar y rechazar; lo aprobado aparece en el tablero.
- [ ] El admin puede actualizar necesidades y urgencia de cualquier lugar y se refleja en vivo.
- [ ] RLS impide que un anónimo lea la tabla `requests`.
- [ ] Funciona bien en móvil con conexión lenta.

---

## 12. Fuera de alcance (v1)

- App nativa, notificaciones push, mapa interactivo, multiidioma, métricas avanzadas, múltiples coordinadores con permisos finos. Anótalos como ideas en `ROADMAP.md` si surgen.

---

## 13. Tono de la copia

Español, claro, en voz activa, sin emojis. Los botones dicen lo que hacen ("Aprobar", "Enviar petición", "Guardar y publicar"). Los estados vacíos invitan a actuar. Los errores explican qué pasó y cómo resolverlo, sin disculpas vagas.

**Iconos:** usa exclusivamente SVG vía `lucide-react`. Nunca emojis en la interfaz — ni en botones, ni en estados vacíos, ni en toasts, ni en ningún componente.
