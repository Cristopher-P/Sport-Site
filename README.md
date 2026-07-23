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
- **`/premium`**: landing de la suscripción. El botón de pago se desactiva
  solo si Stripe no está configurado.
- **`/premium/reportes/ejemplo`**: cómo se ve un reporte real (con datos de
  ejemplo, claramente marcados como tal).
- **`/premium/acceso` + `/api/access`**: login simple por correo — si el
  correo tiene una suscripción activa en la base local, se le da acceso vía
  cookie firmada.
- **`/api/stripe/checkout` + `/api/stripe/webhook`**: flujo completo de
  suscripción con Stripe (Checkout + webhook que marca al suscriptor como
  activo).

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
6. **Escribe el primer reporte real**: reemplaza el contenido de ejemplo en
   `src/app/premium/reportes/[slug]/page.tsx` con tus reportes reales
   (puedo ayudarte a automatizar esto con datos reales de forma/historial).

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
