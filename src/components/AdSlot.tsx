const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

/**
 * Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT_ID is set (see README —
 * that requires an approved AdSense account, which you have to create
 * yourself). Never place this inside /premium/reportes — paying subscribers
 * shouldn't see ads.
 */
export function AdSlot({ slot }: { slot: string }) {
  if (!ADSENSE_CLIENT_ID) return null;

  return (
    <div className="my-2">
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: "(adsbygoogle = window.adsbygoogle || []).push({});",
        }}
      />
    </div>
  );
}
