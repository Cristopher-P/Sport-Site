# CanchaHoy (nombre de trabajo — cámbialo cuando elijas tu dominio)

Sitio de horarios de partidos (fútbol, NBA, NFL) con capa gratuita para SEO y
suscripción premium de análisis estadístico. Ver el plan completo en
`context` de la conversación que lo generó, o el resumen abajo.

## Cómo correrlo localmente

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Qué ya funciona

- **Páginas gratis** (`/`, `/[liga]`, `/[liga]/[partido]`): horarios reales
  de Premier League, La Liga, Liga MX, MLS, NBA y NFL, vía la API gratuita
  de [TheSportsDB](https://www.thesportsdb.com/documentation). Se generan
  automáticamente cientos de páginas (una por partido) — ese es el motor de
  SEO del sitio. Se refrescan solas cada 12 horas.
- **Home**: secciones Hoy / Noticias / Resultados recientes / Destacados de
  la semana / Más partidos — no es una sola lista plana.
- **Noticias**: titulares reales del RSS público de Marca (titular + resumen
  corto + link a la nota original, nunca el artículo completo).
- **`/premium`**: landing de la suscripción con FAQ. El botón de pago se
  desactiva solo si Stripe no está configurado.
- **`/premium/reportes/ejemplo`**: reporte con forma reciente REAL de cada
  equipo (últimos 5 partidos jugados, vía TheSportsDB) y una probabilidad
  estimada calculada con una fórmula simple y transparente — no inventada,
  pero tampoco un modelo profesional (se lo decimos así al usuario).
- **`/premium/acceso` + `/api/access`**: login simple por correo — si el
  correo tiene una suscripción activa en la base local, se le da acceso vía
  cookie firmada.
- **`/api/stripe/checkout` + `/api/stripe/webhook`**: flujo completo de
  suscripción con Stripe (Checkout + webhook que marca al suscriptor como
  activo).
- **Anuncios**: `components/AdSlot.tsx` no muestra nada hasta que configures
  `NEXT_PUBLIC_ADSENSE_CLIENT_ID`. Nunca aparecen dentro de `/premium/reportes`.
- **Reportes Premium editables sin código**: `src/content/reports.ts` — agrega
  un objeto ahí cada semana (liga, partido, nota opcional) y el reporte se
  publica solo, con estadísticas reales calculadas automáticamente. No hay
  que tocar ningún componente. Instrucciones completas dentro del archivo.
- **Términos de servicio y Aviso de privacidad** (`/terminos`, `/privacidad`):
  plantillas base ligadas a lo que el sitio realmente hace — **no son
  asesoría legal**, revísalas con un abogado antes de publicar.
- **Manejo de errores**: página 404 y de error propias con la marca del
  sitio (`not-found.tsx`, `error.tsx`, `global-error.tsx`) en vez de las
  genéricas de Next.js.

## Lo que TÚ debes hacer para que cobre de verdad

Un asistente de IA no puede crear cuentas ni meter tus datos financieros —
esto es intencional y son pasos que te tocan a ti:

1. **Crea tu cuenta de Stripe** en https://dashboard.stripe.com/register.
   - Crea un producto de suscripción (ej. $99 MXN/mes) y copia el `price_id`.
   - Copia tu `secret key`.
   - Configura un webhook apuntando a `https://tudominio.com/api/stripe/webhook`
     escuchando `checkout.session.completed`, `customer.subscription.updated`
     y `customer.subscription.deleted`; copia el `webhook signing secret`.
2. Copia `.env.example` a `.env.local` y llena `STRIPE_SECRET_KEY`,
   `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET` y genera un
   `ACCESS_COOKIE_SECRET` propio (cualquier cadena larga aleatoria).
3. **Compra un dominio** y conéctalo cuando despliegues en Vercel — Stripe y
   la credibilidad del sitio lo necesitan.
4. **Antes de cobrar en vivo**: la base de datos de suscriptores
   (`src/lib/db.ts`) usa SQLite local solo para desarrollo — en Vercel el
   sistema de archivos no persiste entre despliegues/instancias. Antes de
   lanzar con pagos reales, reemplaza ese archivo por una base de datos real
   hospedada (recomendado: [Supabase](https://supabase.com), plan gratuito).
   La función a reemplazar es pequeña: `upsertSubscriber` e
   `isActiveSubscriber`.
5. **Revisa el aviso legal/responsable** con las leyes de tu país antes de
   cobrar en vivo — el sitio nunca procesa apuestas ni dinero de apuestas,
   solo vende acceso a análisis informativo, pero no reemplaza asesoría legal.
6. **Publica tu primer reporte real**: edita `src/content/reports.ts` (ver
   las instrucciones dentro del archivo) — no necesitas tocar componentes de
   React, solo agregar los partidos y una nota opcional tuya.
7. **Crea tu cuenta de Google AdSense** en https://adsense.google.com y pega
   tu client ID en `NEXT_PUBLIC_ADSENSE_CLIENT_ID`. La aprobación no es
   instantánea y normalmente exige que el sitio ya tenga contenido y tráfico
   real — no la puede tramitar un asistente por ti.
8. **Consigue tu propia API key de TheSportsDB** antes de lanzar con tráfico
   real. La key gratuita "123" que usa este proyecto es pública y compartida
   por cualquiera que pruebe su API — bajo uso pesado devuelve error 429
   (rate limit), como nos pasó durante las pruebas de esta sesión. Bajo
   tráfico normal con el refresco de 12h no debería ser problema, pero una
   key personal (gratis, vía su Patreon) da más margen.
9. **Completa `/terminos` y `/privacidad`**: tienen partes marcadas
   `[completar]` (correo de contacto, política de reembolsos, fecha) — y de
   nuevo, haz que un abogado las revise antes de cobrar en vivo.

## Estructura

- `src/lib/leagues.ts` — ligas cubiertas y sus IDs de TheSportsDB.
- `src/lib/sportsdb.ts` — capa de datos (fetch + cache) de partidos.
- `src/lib/stripe.ts`, `src/lib/db.ts`, `src/lib/access-cookie.ts` — capa de
  suscripción/paywall.
- `src/app/` — rutas (App Router de Next.js 16).

## Deploy

Recomendado: [Vercel](https://vercel.com/new) (soporta todo lo que usa este
proyecto — ISR, route handlers, cron — en su plan gratuito). Conecta el repo,
agrega las variables de entorno de `.env.example` en el dashboard de Vercel,
y conecta tu dominio.
