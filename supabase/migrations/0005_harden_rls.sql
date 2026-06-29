-- ════════════════════════════════════════════════════════════════════════════
-- Endurecimiento de seguridad (RLS + Storage)
--
-- PROBLEMA QUE RESUELVE:
-- Las políticas originales daban acceso total a cualquier usuario "authenticated"
-- (using (true)). Como Supabase Auth permite registro público por defecto,
-- CUALQUIER persona podía crear una cuenta y, con ella, leer TODAS las peticiones
-- (incluido el contacto privado), ver mascotas no aprobadas y editar lugares,
-- saltándose por completo el control del coordinador.
--
-- Estas políticas ahora exigen rol 'coordinator' real en la tabla profiles,
-- no solo "estar autenticado".
-- ════════════════════════════════════════════════════════════════════════════

-- Helper: ¿el usuario actual es coordinador?
create or replace function is_coordinator()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where profiles.id = auth.uid()
      and profiles.role = 'coordinator'
  );
$$;

-- ─── requests: solo el coordinador lee/edita (el público solo INSERTA) ───────
drop policy if exists "admin full requests" on requests;
create policy "coordinator full requests" on requests
  for all to authenticated
  using (is_coordinator())
  with check (is_coordinator());

-- ─── locations: lectura pública sigue igual; escritura solo coordinador ──────
drop policy if exists "admin write locations" on locations;
create policy "coordinator write locations" on locations
  for all to authenticated
  using (is_coordinator())
  with check (is_coordinator());

-- ─── location_needs: igual ──────────────────────────────────────────────────
drop policy if exists "admin write needs" on location_needs;
create policy "coordinator write needs" on location_needs
  for all to authenticated
  using (is_coordinator())
  with check (is_coordinator());

-- ─── lost_pets: público solo ve aprobadas; coordinador ve/gestiona todo ──────
drop policy if exists "admin full lost pets" on lost_pets;
create policy "coordinator full lost pets" on lost_pets
  for all to authenticated
  using (is_coordinator())
  with check (is_coordinator());

-- ════════════════════════════════════════════════════════════════════════════
-- STORAGE: bucket pet-photos
--
-- Antes: cualquier anónimo podía LISTAR todo el bucket (enumerar y descargar
-- TODAS las fotos, incluidas las no aprobadas / rechazadas).
--
-- Ahora: se quita el SELECT anónimo. Las fotos APROBADAS se siguen viendo por
-- la URL pública del bucket (eso lo sirve el flag "public" del bucket, no esta
-- policy). Sin esta policy ya nadie puede enumerar el bucket vía API, así que
-- las fotos no aprobadas dejan de ser descubribles (el nombre es un UUID
-- aleatorio imposible de adivinar).
-- ════════════════════════════════════════════════════════════════════════════

drop policy if exists "public read pet photos" on storage.objects;

-- Solo el coordinador puede listar/inspeccionar el bucket vía API autenticada
create policy "coordinator list pet photos" on storage.objects
  for select to authenticated
  using (bucket_id = 'pet-photos' and is_coordinator());

-- Solo el coordinador puede borrar
drop policy if exists "admin delete pet photos" on storage.objects;
create policy "coordinator delete pet photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'pet-photos' and is_coordinator());

-- (La política de INSERT anónimo se mantiene: el público necesita subir la foto
--  al reportar. El límite de tamaño y tipos MIME se configura en el dashboard:
--  Storage → pet-photos → Settings → max file size + allowed MIME types.)
