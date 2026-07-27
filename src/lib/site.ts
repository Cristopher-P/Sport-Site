// Single source of truth for the site's public URL, used by sitemap.ts and
// robots.ts. Defaults to the real production domain — NEXT_PUBLIC_SITE_URL
// only needs to be set to override this (e.g. for a staging deploy).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tucanchahoy.com";
