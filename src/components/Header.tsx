import Link from "next/link";
import { LEAGUES } from "@/lib/leagues";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-neutral-950/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="shrink-0 text-lg font-bold tracking-tight text-white">
            Cancha<span className="text-emerald-400">Hoy</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-5 text-sm text-neutral-300">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <Link href="/noticias" className="hover:text-white transition-colors">
              Noticias
            </Link>
          </nav>
        </div>

        <Link
          href="/premium"
          className="shrink-0 rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors"
        >
          Premium
        </Link>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-3 flex gap-4 overflow-x-auto text-sm text-neutral-300">
        <Link href="/noticias" className="sm:hidden whitespace-nowrap hover:text-white transition-colors">
          Noticias
        </Link>
        {LEAGUES.map((league) => (
          <Link
            key={league.slug}
            href={`/${league.slug}`}
            className="whitespace-nowrap hover:text-white transition-colors"
          >
            {league.name}
          </Link>
        ))}
      </div>
    </header>
  );
}
