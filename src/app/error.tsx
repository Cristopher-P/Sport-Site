"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto text-center py-16 space-y-4">
      <p className="text-sm text-red-400 font-medium">Algo salió mal</p>
      <h1 className="text-2xl font-bold text-white">No pudimos cargar esta página</h1>
      <p className="text-neutral-400">
        Puede ser algo temporal. Intenta de nuevo en un momento.
      </p>
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => unstable_retry()}
          className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-neutral-300 hover:text-white transition-colors"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
