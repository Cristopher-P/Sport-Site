"use client";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100">
        <div className="max-w-md mx-auto text-center space-y-4 px-4">
          <p className="text-sm text-red-400 font-medium">Algo salió mal</p>
          <h1 className="text-2xl font-bold text-white">CanchaHoy no cargó correctamente</h1>
          <p className="text-neutral-400">Intenta recargar la página en un momento.</p>
          <button
            onClick={() => unstable_retry()}
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
