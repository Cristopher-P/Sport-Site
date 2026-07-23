import Link from "next/link";

export default function BienvenidaPage() {
  return (
    <div className="max-w-sm mx-auto space-y-4 text-center">
      <h1 className="text-2xl font-bold text-white">¡Gracias por suscribirte!</h1>
      <p className="text-neutral-400 text-sm">
        Tu pago se está confirmando. En un momento entra con el correo que usaste
        al pagar para ver los reportes.
      </p>
      <Link
        href="/premium/acceso"
        className="inline-block rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors"
      >
        Entrar a Premium
      </Link>
    </div>
  );
}
