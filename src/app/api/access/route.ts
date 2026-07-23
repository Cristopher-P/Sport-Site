import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isActiveSubscriber } from "@/lib/db";
import { ACCESS_COOKIE_NAME, accessCookieOptions, createAccessToken } from "@/lib/access-cookie";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !isActiveSubscriber(email)) {
    return NextResponse.redirect(
      new URL("/premium/acceso?error=1", request.url),
      303
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE_NAME, createAccessToken(email), accessCookieOptions);

  return NextResponse.redirect(new URL("/premium/reportes", request.url), 303);
}
