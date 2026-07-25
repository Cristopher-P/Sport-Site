export function ProbabilityBar({
  home,
  draw,
  away,
  homeLabel,
  awayLabel,
}: {
  home: number;
  draw: number;
  away: number;
  homeLabel: string;
  awayLabel: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-neutral-800">
        <div className="bg-emerald-400" style={{ width: `${home}%` }} />
        {draw > 0 && <div className="bg-neutral-500" style={{ width: `${draw}%` }} />}
        <div className="bg-sky-400" style={{ width: `${away}%` }} />
      </div>
      <div className="flex justify-between text-xs text-neutral-400">
        <span>
          <span className="text-emerald-400 font-semibold">{home}%</span> {homeLabel}
        </span>
        {draw > 0 && <span>{draw}% empate</span>}
        <span>
          {awayLabel} <span className="text-sky-400 font-semibold">{away}%</span>
        </span>
      </div>
    </div>
  );
}
