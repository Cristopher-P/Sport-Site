import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthorizedEmail } from "@/lib/require-access";

export default async function ReportesIndexPage() {
  const email = await getAuthorizedEmail();
  if (!email) redirect("/premium/acceso");

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Reportes Premium</h1>
      <p className="text-neutral-400 text-sm">
        Sesión activa: {email}. Publicamos un reporte nuevo cada semana con varios
        partidos por venir.
      </p>
      <Link
        href="/premium/reportes/ejemplo"
        className="block rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 hover:border-emerald-400/50 transition-colors"
      >
        <p className="font-semibold text-neutral-100">Reporte de ejemplo</p>
        <p className="text-sm text-neutral-400">Formato de muestra</p>
      </Link>
    </div>
  );
}
