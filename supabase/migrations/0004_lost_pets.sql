-- Tipos
create type pet_species as enum ('perro', 'gato', 'ave', 'reptil', 'otro');
create type pet_status as enum ('perdido', 'encontrado');

-- Tabla de mascotas perdidas
create table lost_pets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  species pet_species not null default 'perro',
  description text not null,
  zone text not null,
  contact text not null,
  photo_url text not null,
  status pet_status not null default 'perdido',
  is_public boolean not null default false,
  approved_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table lost_pets enable row level security;

-- Cualquiera puede reportar una mascota perdida
create policy "anyone can submit lost pet" on lost_pets
  for insert to anon, authenticated
  with check (true);

-- Solo las aprobadas y visibles son públicas
create policy "public read lost pets" on lost_pets
  for select to anon, authenticated
  using (is_public = true);

-- Admin tiene control total
create policy "admin full lost pets" on lost_pets
  for all to authenticated
  using (true) with check (true);

-- Trigger: fuerza is_public=false en inserciones del público
create or replace function force_pending_pet_on_insert()
returns trigger language plpgsql security definer as $$
begin
  new.is_public := false;
  new.status := 'perdido';
  return new;
end;
$$;

create trigger trg_force_pending_pet
  before insert on lost_pets
  for each row execute function force_pending_pet_on_insert();

-- Realtime
alter publication supabase_realtime add table lost_pets;

-- Storage: políticas para el bucket pet-photos
-- IMPORTANTE: Primero crea el bucket "pet-photos" (público) en el dashboard de Supabase → Storage
create policy "public upload pet photos" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'pet-photos');

create policy "public read pet photos" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'pet-photos');

create policy "admin delete pet photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'pet-photos');
