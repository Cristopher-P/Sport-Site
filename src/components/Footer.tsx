export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-neutral-950">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-400 space-y-3">
        <p>
          Contenido informativo únicamente. CanchaHoy no opera casas de apuestas, no
          procesa apuestas ni garantiza resultados — el análisis y las estadísticas
          son para ayudarte a decidir, la decisión y la apuesta son tuyas y se
          realizan en la casa de apuestas de tu preferencia.
        </p>
        <p>
          Sitio para mayores de 18 años. Si el juego deja de ser un entretenimiento
          para ti, busca ayuda: en México, contacta a{" "}
          <a
            href="https://www.gob.mx/salud/conadic"
            className="underline hover:text-neutral-200"
          >
            CONADIC
          </a>
          .
        </p>
        <p className="text-neutral-600">
          © {new Date().getFullYear()} CanchaHoy. Datos de partidos vía TheSportsDB.
        </p>
      </div>
    </footer>
  );
}
