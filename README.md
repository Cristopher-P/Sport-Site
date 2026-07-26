# CanchaHoy ⚡

Horarios, resultados y análisis estadístico de fútbol, NBA y NFL — con una
capa gratuita pensada para SEO y una suscripción Premium de análisis.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)
![Stripe](https://img.shields.io/badge/Pagos-Stripe-635BFF?logo=stripe&logoColor=white)

## Qué es esto

Un sitio de horarios/resultados deportivos (Premier League, La Liga, Liga MX,
MLS, NBA, NFL) con cientos de páginas auto-generadas por partido — ese
volumen es el motor de tráfico orgánico del sitio. Encima de esa capa
gratuita hay una suscripción **CanchaHoy Premium** con estadísticas reales
(forma reciente, ambos anotaron %, más de 2.5 goles %, forma local/visitante)
y una probabilidad estimada — siempre aclarando que es informativo, no una
garantía de resultado.

## Características

- 🗓️ **Horarios y resultados en vivo** vía [TheSportsDB](https://www.thesportsdb.com/documentation), refrescados solos cada 12h
- 🏠 **Home dinámica**: Hoy · Noticias · Resultados recientes · Destacados · Más partidos
- 📰 **Noticias** reales del RSS público de Marca (titular + resumen + link, nunca el artículo completo)
- 📊 **Estadísticas reales por partido**: forma reciente, BTTS%, over 2.5%, split local/visitante, todo calculado de resultados reales — no inventado
- 💳 **Suscripción Premium** con Stripe Checkout + webhook
- 📝 **Reportes editables sin tocar código** — `src/content/reports.ts`
- 📢 **Anuncios opcionales** (Google AdSense) que no aparecen dentro de Premium
- 📄 **Términos de servicio y Aviso de privacidad** incluidos (plantilla base)
- 🚨 Páginas de error y 404 con marca propia

## Empezar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Estilos | Tailwind CSS 4 |
| Datos deportivos | [TheSportsDB](https://www.thesportsdb.com/documentation) (API gratuita) |
| Noticias | RSS público de [Marca](https://www.marca.com) |
| Pagos | Stripe Checkout + Webhooks |
| Suscriptores (dev) | SQLite (`node:sqlite`) — **cambiar antes de producción**, ver abajo |
| Anuncios | Google AdSense (opcional, desactivado por defecto) |
| Hosting recomendado | [Vercel](https://vercel.com/new) |

## Estructura del proyecto

```
src/
├── app/                    # Rutas (App Router)
│   ├── [liga]/[partido]/   # Página de partido (horario, alineación, stats)
│   ├── premium/            # Landing, acceso, reportes
│   ├── noticias/
│   ├── terminos/ privacidad/
│   └── api/                # Stripe checkout/webhook, acceso por correo
├── components/              # UI (FixtureCard, MatchHero, StatsTable, ...)
├── content/reports.ts       # Reportes Premium — editable sin código
└── lib/                     # Capa de datos y lógica (sportsdb, team-form, ...)
```

## Checklist antes de publicar con cobros reales

Estos pasos requieren tus propias cuentas/decisiones — ningún asistente de
IA puede crearlas por ti.

- [ ] **Dominio propio** comprado y conectado en Vercel
- [ ] **Cuenta de Stripe** creada, producto de suscripción configurado, webhook apuntando a `/api/stripe/webhook`
- [ ] **Variables de entorno** copiadas de `.env.example` a `.env.local` (o al dashboard de Vercel), incluyendo un `ACCESS_COOKIE_SECRET` propio
- [ ] **Base de datos de suscriptores migrada a Supabase** (u otra hospedada) — `src/lib/db.ts` usa SQLite local solo para desarrollo; el filesystem de Vercel no persiste entre despliegues
- [ ] **Primer reporte real publicado** en `src/content/reports.ts`
- [ ] **`/terminos` y `/privacidad` completados y revisados por un abogado** (tienen partes marcadas `[completar]`)
- [ ] **API key propia de TheSportsDB** — la key gratuita compartida (`123`) se satura bajo uso pesado
- [ ] **Cuenta de Google AdSense** aprobada (solo si vas a mostrar anuncios), client ID en `NEXT_PUBLIC_ADSENSE_CLIENT_ID`

## Publicar un reporte Premium nuevo

Edita `src/content/reports.ts` y agrega un objeto a `REPORTS` — liga, slug
del partido, y una nota editorial opcional. Las estadísticas se calculan
solas con datos reales. Instrucciones completas dentro del archivo.

## Deploy

1. Sube el repo a GitHub (o GitLab/Bitbucket).
2. Impórtalo en [Vercel](https://vercel.com/new).
3. Agrega las variables de entorno de `.env.example`.
4. Conecta tu dominio.

---

Contenido informativo únicamente — CanchaHoy no opera apuestas ni garantiza
resultados. Sitio para mayores de 18 años.
