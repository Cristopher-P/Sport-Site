// Single source of truth for the site's public URL, used by sitemap.ts and
// robots.ts. Defaults to the real production domain — NEXT_PUBLIC_SITE_URL
// only needs to be set to override this (e.g. for a staging deploy).
//
// Must be the "www" version: Vercel's domain config 308-redirects the bare
// apex (tucanchahoy.com) to www.tucanchahoy.com. Using the apex here made
// every sitemap URL redirect instead of resolving directly, which is why
// Search Console flagged all 94 pages as errors.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tucanchahoy.com";
