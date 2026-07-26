import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-16 space-y-4">
      <p className="text-sm text-emerald-400 font-medium">404</p>
      <h1 className="text-2xl font-bold text-white">No encontramos esa página</h1>
      <p className="text-neutral-400">
        Puede que el partido ya no esté programado o el enlace esté mal escrito.
      </p>
      <Link
        href="/"
        className="inline-block rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
