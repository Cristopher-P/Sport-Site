import type { Metadata } from "next";
import Link from "next/link";
import { isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "CanchaHoy Premium",
  description:
    "Análisis estadístico de varios partidos por venir: forma reciente real y probabilidad estimada, sin anuncios.",
};

const INCLUDES = [
  "Forma reciente real de cada equipo (últimos 5 partidos jugados, no inventada)",
  "Probabilidad estimada por partido, con la fórmula explicada — no una caja negra",
  "Reporte nuevo cada semana con varios partidos por venir",
  "Sin anuncios en ninguna página de Premium",
];

const FAQ = [
  {
    q: "¿Esto me dice qué apuesta hacer?",
    a: "No. Te damos datos reales (forma reciente, probabilidad estimada) para que decidas tú. No prometemos apuestas ganadoras — nadie puede garantizar eso honestamente.",
  },
  {
    q: "¿Por qué pagar si los momios ya son públicos?",
    a: "Los momios de las casas de apuestas no son nuestro producto. Te damos el trabajo de análisis (forma reciente de cada equipo, calculado con datos reales) que normalmente tomaría tiempo armar tú mismo.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí, es una suscripción mensual sin permanencia. Cancelas desde el mismo botón de pago (Stripe) cuando quieras.",
  },
  {
    q: "¿De dónde salen los datos?",
    a: "De resultados reales de partidos ya jugados. La probabilidad es una estimación simple basada en esos puntos — lo decimos claro, no es un modelo profesional.",
  },
];

export default async function PremiumPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const stripeReady = isStripeConfigured();

  return (
    <div className="max-w-xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-white">CanchaHoy Premium</h1>
        <p className="text-neutral-400">
          No vendemos apuestas garantizadas. Vendemos el análisis que tú usas para
          decidir — la apuesta la haces tú, en la casa que prefieras.
        </p>
      </div>

      <ul className="space-y-3">
        {INCLUDES.map((item) => (
          <li key={item} className="flex gap-3 text-neutral-200">
            <span className="text-emerald-400 mt-0.5">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="rounded-xl border border-white/10 bg-neutral-900 p-6 text-center space-y-4">
        <p className="text-3xl font-bold text-white">
          $99 MXN<span className="text-base font-normal text-neutral-400">/mes</span>
        </p>

        {stripeReady ? (
          <form action="/api/stripe/checkout" method="POST">
            <button
              type="submit"
              className="w-full rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors"
            >
              Suscribirme
            </button>
          </form>
        ) : (
          <p className="text-sm text-amber-400">
            Los pagos aún no están activados en este sitio (falta configurar
            Stripe). Mientras tanto puedes revisar cómo se ve un reporte en{" "}
            <Link href="/premium/reportes/ejemplo" className="underline">
              este ejemplo
            </Link>
            .
          </p>
        )}

        {error === "no-configurado" && (
          <p className="text-sm text-red-400">Los pagos no están activados todavía.</p>
        )}

        <p className="text-xs text-neutral-500">
          ¿Ya te suscribiste?{" "}
          <Link href="/premium/acceso" className="underline">
            Entra aquí
          </Link>
          .
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-100 text-center">Preguntas</h2>
        <dl className="space-y-4">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="border-b border-white/5 pb-4">
              <dt className="font-medium text-neutral-100">{q}</dt>
              <dd className="text-sm text-neutral-400 mt-1">{a}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="text-xs text-neutral-600 text-center">
        Contenido informativo, no garantiza resultados. +18. Cancela cuando quieras.
      </p>
    </div>
  );
}
