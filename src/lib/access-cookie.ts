import { createHmac, timingSafeEqual } from "node:crypto";

export const ACCESS_COOKIE_NAME = "ch_access";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getSecret(): string {
  const secret = process.env.ACCESS_COOKIE_SECRET;
  if (!secret) {
    throw new Error(
      "ACCESS_COOKIE_SECRET no está configurado. Agrégalo a tu .env.local (ver README)."
    );
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createAccessToken(email: string): string {
  const normalized = email.toLowerCase().trim();
  const signature = sign(normalized);
  return `${Buffer.from(normalized).toString("base64url")}.${signature}`;
}

export function verifyAccessToken(token: string | undefined): string | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  let email: string;
  try {
    email = Buffer.from(encoded, "base64url").toString("utf-8");
  } catch {
    return null;
  }

  const expected = sign(email);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  return email;
}

export const accessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: COOKIE_MAX_AGE_SECONDS,
  path: "/",
};
