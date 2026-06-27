-- Agrega control de visibilidad del contacto en peticiones
alter table requests add column if not exists contact_public boolean not null default false;

-- Actualiza la vista pública para exponer el contacto solo cuando el admin lo permite
create or replace view public_requests
with (security_invoker = on) as
select
  id,
  category,
  zone,
  description,
  status,
  created_at,
  updated_at,
  case when contact_public then contact else null end as contact
from requests
where is_public = true and status in ('aprobada','en_proceso','resuelta');

grant select on public_requests to anon, authenticated;
