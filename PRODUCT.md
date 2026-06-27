# Product

## Register

product

## Users

**Público anónimo:** ciudadanos venezolanos afectados por el terremoto en Puerto Cabello, Carabobo. Usan la plataforma desde móvil, con conexión inestable, en contexto de estrés y urgencia. Buscan saber qué lugares necesitan ayuda y qué ya no, o pedir auxilio para alguien. No tienen tiempo ni paciencia para interfaces complicadas.

**Coordinador (admin):** una persona de confianza que recibe información verificada de los responsables de cada lugar y la publica. Trabaja desde el teléfono o computador, revisa peticiones entrantes y actualiza el estado de cada sitio. La rapidez y claridad del panel son críticas para que pueda operar bien bajo presión.

## Product Purpose

Coordinación verificada de ayuda tras el terremoto en Puerto Cabello. El producto resuelve la duplicidad y el desperdicio de la ayuda espontánea: cuando cada lugar tiene un estado claro y verificado, nadie lleva lo que ya sobra ni ignora lo que urge. Nada se publica sin revisión humana. La confianza es el producto.

## Brand Personality

Confiable · Claro · Humano

Tono: español directo, en voz activa, sin emojis. Los botones dicen lo que hacen. Los estados vacíos invitan a actuar. Los errores explican qué pasó y cómo resolverlo, sin disculpas vagas. No es frío ni burocrático — es una comunidad organizándose con seriedad.

## Anti-references

- **Apps de noticias / breaking news:** sin alertas parpadeantes, sin sensacionalismo visual, sin ticker de urgencia que aturda.
- **Redes sociales (Instagram, TikTok):** nada de colores festivos saturados, feeds algorítmicos, o diseño pensado para el engagement emocional descontrolado.
- **Herramientas SaaS de Silicon Valley (Notion, Linear):** sin el minimalismo blanco-frío que se siente ajeno al contexto venezolano y de emergencia. El producto no es una startup; es una herramienta comunitaria.

## Design Principles

1. **La confianza se codifica visualmente.** El color de urgencia y la frescura del timestamp no son decoración: son la señal de confianza del tablero. Si la información es vieja o el lugar ya está abastecido, el color lo dice antes de que el usuario lea.
2. **Claridad sobre estética.** Cada decisión visual existe porque ayuda al coordinador o al ciudadano a actuar más rápido. El ornamento que no comunica sobra.
3. **Humano en el tono, serio en el sistema.** La copia habla de personas reales en una emergencia real. El sistema que la sostiene es riguroso: verificación humana, privacidad del contacto, RLS en todas las tablas.
4. **Móvil primero, conexión lenta primero.** El tablero debe funcionar bien con señal 3G en un teléfono de gama media. La jerarquía visual tiene que funcionar sin imágenes ni animaciones complejas.
5. **El vacío también comunica.** Los estados vacíos no son errores — invitan al coordinador a publicar información o al ciudadano a enviar una petición. Cada estado vacío debe decir exactamente qué hacer.

## Accessibility & Inclusion

- WCAG 2.1 AA como piso mínimo.
- Foco visible por teclado en todos los elementos interactivos (ya implementado con `--gold`).
- `prefers-reduced-motion` respetado en todas las animaciones.
- Contraste de texto body ≥ 4.5:1 contra su fondo; texto de estado (urgencia, frescura) ≥ 3:1.
- Texto en español venezolano claro, sin jerga técnica.
