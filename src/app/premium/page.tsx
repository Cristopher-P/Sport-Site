import type { Metadata } from "next";
import Link from "next/link";
import { isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "CanchaHoy Premium",
  description:
    "Análisis estadístico de varios partidos por venir: forma reciente, historial head-to-head y probabilidades estimadas.",
};

const INCLUDES = [
  "Forma reciente de los equipos en sus últimos partidos",
  "Historial head-to-head entre los equipos que se enfrentan",
  "Probabilidad estimada por partido, explicada con sus datos",
  "Reporte nuevo cada semana con varios partidos por venir",
];

export default async function PremiumPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const stripeReady = isStripeConfigured();

  return (
    <div className="max-w-xl mx-auto space-y-8">
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

      <p className="text-xs text-neutral-600 text-center">
        Contenido informativo, no garantiza resultados. +18. Cancela cuando quieras.
      </p>
    </div>
  );
}
