-- ════════════════════════════════════════════════════════════════════════════
-- Nuevo estado de urgencia: "sin_info" (Sin información)
--
-- Antes, un lugar sin datos mostraba "Abastecido" (verde), lo cual es engañoso:
-- implica que el lugar está bien cuando en realidad no se ha confirmado nada.
-- "sin_info" es el estado neutro y honesto por defecto hasta que el coordinador
-- verifique la situación real del lugar.
--
-- IMPORTANTE: Postgres no permite USAR un valor de enum recién agregado en la
-- misma transacción en que se crea. Por eso esto va en DOS PASOS separados.
-- ════════════════════════════════════════════════════════════════════════════

-- ─── PASO 1: ejecuta SOLO esta línea primero y espera a que termine ──────────
alter type urgency_level add value if not exists 'sin_info' before 'abastecido';


-- ─── PASO 2: ejecuta el resto en una segunda corrida ────────────────────────

-- Nuevo predeterminado para lugares creados de ahora en adelante
alter table locations alter column urgency set default 'sin_info';

-- Los lugares que hoy dicen "abastecido" pero no tienen ninguna necesidad
-- registrada en realidad no tienen info confirmada: pásalos a "sin_info".
-- (Re-marca como abastecido solo los que de verdad lo estén, desde el panel.)
update locations l
set urgency = 'sin_info'
where l.urgency = 'abastecido'
  and not exists (
    select 1 from location_needs n where n.location_id = l.id
  );
