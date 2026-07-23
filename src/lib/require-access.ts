import { cookies } from "next/headers";
import { ACCESS_COOKIE_NAME, verifyAccessToken } from "@/lib/access-cookie";

export async function getAuthorizedEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  return verifyAccessToken(token);
}
