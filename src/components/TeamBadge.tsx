const SIZES = {
  sm: "h-8 w-8",
  lg: "h-16 w-16",
  xl: "h-24 w-24 sm:h-28 sm:w-28",
} as const;

export function TeamBadge({
  src,
  alt,
  size = "sm",
}: {
  src?: string | null;
  alt: string;
  size?: keyof typeof SIZES;
}) {
  if (!src) {
    return (
      <div
        className={`${SIZES[size]} shrink-0 rounded-full bg-neutral-800 border border-white/10`}
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={`${SIZES[size]} shrink-0 object-contain`} loading="lazy" />;
}
