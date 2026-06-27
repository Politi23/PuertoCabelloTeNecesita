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
  type text not null,
  plus_code text,
  zone text,
  urgency urgency_level not null default 'media',
  is_verified boolean not null default false,
  verified_source text,
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Necesidades de cada lugar
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
  contact text,
  status request_status not null default 'pendiente',
  is_public boolean not null default false,
  approved_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── RLS ───────────────────────────────────────────────────────────────────

alter table profiles enable row level security;
alter table locations enable row level security;
alter table location_needs enable row level security;
alter table requests enable row level security;

-- Lectura pública de lugares y necesidades
create policy "public read locations"
  on locations for select to anon, authenticated using (true);

create policy "public read needs"
  on location_needs for select to anon, authenticated using (true);

-- Escritura de lugares y necesidades: solo admins
create policy "admin write locations"
  on locations for all to authenticated using (true) with check (true);

create policy "admin write needs"
  on location_needs for all to authenticated using (true) with check (true);

-- El público puede crear peticiones pero no leerlas
create policy "anyone can submit request"
  on requests for insert to anon, authenticated with check (true);

create policy "admin full requests"
  on requests for all to authenticated using (true) with check (true);

-- ─── Vista pública (sin contacto) ──────────────────────────────────────────

create view public_requests
with (security_invoker = on) as
select id, category, zone, description, status, created_at, updated_at
from requests
where is_public = true and status in ('aprobada','en_proceso','resuelta');

grant select on public_requests to anon, authenticated;

-- ─── Trigger: fuerza status pendiente e is_public false en insert anónimo ──

create or replace function force_pending_on_insert()
returns trigger language plpgsql security definer as $$
begin
  new.status := 'pendiente';
  new.is_public := false;
  return new;
end;
$$;

create trigger trg_force_pending
  before insert on requests
  for each row execute function force_pending_on_insert();

-- ─── Trigger: actualiza updated_at en requests ─────────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_requests_updated_at
  before update on requests
  for each row execute function set_updated_at();

create trigger trg_locations_updated_at
  before update on locations
  for each row execute function set_updated_at();

-- ─── Realtime ──────────────────────────────────────────────────────────────

alter publication supabase_realtime add table locations;
alter publication supabase_realtime add table location_needs;
alter publication supabase_realtime add table requests;
