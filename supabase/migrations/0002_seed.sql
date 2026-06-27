-- Seed: 5 lugares reales de Puerto Cabello

insert into locations (name, type, plus_code, zone, urgency, is_verified, verified_source) values
(
  'Hospital Dr. Adolfo Prince Lara',
  'Hospital general (24 h)',
  'FXF9+9W6',
  'Puerto Cabello',
  'critico',
  true,
  'Dirección del hospital'
),
(
  'Hospital Naval Francisco Isnardi',
  'Hospital militar',
  'F2GF+QFR',
  'Puerto Cabello',
  'alta',
  true,
  'Comando de la base naval'
),
(
  'Hospital José F. Molina Sierra',
  'Hospital',
  'FX7V+P3M',
  'Puerto Cabello',
  'alta',
  true,
  'Coordinación regional de salud'
),
(
  'Sun And Sea',
  'Residencia geriátrica',
  'FXJ6+3W6',
  'Puerto Cabello',
  'media',
  false,
  null
),
(
  'Residencias Maori 5',
  'Edificio de apartamentos',
  null,
  'Cumboto Norte',
  'media',
  false,
  null
);
