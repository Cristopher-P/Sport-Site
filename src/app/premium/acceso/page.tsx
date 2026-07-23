export default async function AccesoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-sm mx-auto space-y-6 text-center">
      <h1 className="text-2xl font-bold text-white">Entrar a Premium</h1>
      <p className="text-neutral-400 text-sm">
        Escribe el correo con el que te suscribiste para ver los reportes.
      </p>

      <form action="/api/access" method="POST" className="space-y-3">
        <input
          type="email"
          name="email"
          required
          placeholder="tu@correo.com"
          className="w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2.5 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-400"
        />
        <button
          type="submit"
          className="w-full rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors"
        >
          Entrar
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-400">
          No encontramos una suscripción activa con ese correo.
        </p>
      )}
    </div>
  );
}
