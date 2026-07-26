export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
        <p className="text-sm text-neutral-500 mt-1">Última actualización: {updated}</p>
      </div>

      <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 px-4 py-3 text-sm text-amber-200">
        Esta página es una plantilla base generada para CanchaHoy, no asesoría legal.
        Antes de publicar el sitio con cobros reales, hazla revisar por un abogado
        conforme a las leyes de tu país.
      </div>

      <div className="space-y-6 text-neutral-300 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-neutral-100 [&_h2]:mb-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:leading-relaxed">
        {children}
      </div>
    </div>
  );
}
