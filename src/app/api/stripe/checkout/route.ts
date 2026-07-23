import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.redirect(new URL("/premium?error=no-configurado", request.url));
  }

  const origin = new URL(request.url).origin;
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${origin}/premium/bienvenida?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/premium`,
    customer_email: undefined,
    allow_promotion_codes: true,
  });

  if (!session.url) {
    return NextResponse.redirect(new URL("/premium?error=stripe", request.url));
  }

  return NextResponse.redirect(session.url, 303);
}
