/**
 * Reportes Premium — edítalo cada semana para publicar contenido nuevo,
 * sin tocar ningún componente de React.
 *
 * Cómo agregar un reporte nuevo:
 * 1. Copia el bloque de ejemplo comentado abajo y pégalo dentro de REPORTS.
 * 2. `slug`: la URL será /premium/reportes/<slug> — usa minúsculas y guiones.
 * 3. `liga`: el slug de la liga (mira src/lib/leagues.ts): premier-league,
 *    la-liga, liga-mx, mls, nba, nfl.
 * 4. `partido`: el slug exacto del partido — cópialo de la URL de esa página
 *    de partido en el sitio (ej. /liga-mx/tijuana-vs-leon-2026-07-25 -> usa
 *    "tijuana-vs-leon-2026-07-25").
 * 5. `nota` es opcional — un comentario editorial corto tuyo sobre ese
 *    partido. Las estadísticas (forma, probabilidad) se calculan solas con
 *    datos reales, tú no las escribes.
 * 6. Guarda, sube el cambio (commit + deploy) y el reporte queda publicado.
 */

export type ReportMatchRef = {
  liga: string;
  partido: string;
  nota?: string;
};

export type Report = {
  slug: string;
  titulo: string;
  publicadoEl: string; // "2026-07-28" — solo para mostrar, no afecta nada más
  matches: ReportMatchRef[];
};

export const REPORTS: Report[] = [
  // {
  //   slug: "semana-del-28-julio",
  //   titulo: "Reporte del 28 de julio",
  //   publicadoEl: "2026-07-28",
  //   matches: [
  //     {
  //       liga: "liga-mx",
  //       partido: "tijuana-vs-leon-2026-07-25",
  //       nota: "León llega con mejor forma reciente, pero Tijuana no pierde en casa hace 4 partidos.",
  //     },
  //     { liga: "mls", partido: "new-york-red-bulls-vs-charlotte-fc-2026-07-25" },
  //   ],
  // },
];
