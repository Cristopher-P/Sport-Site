import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { upsertSubscriber } from "@/lib/db";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Firma inválida: ${err}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email ?? session.customer_email;
      if (email) {
        upsertSubscriber({
          email: email.toLowerCase().trim(),
          status: "active",
          stripe_customer_id: (session.customer as string) ?? null,
          current_period_end: null,
        });
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(subscription.customer as string);
      const email = "email" in customer ? customer.email : null;

      if (email) {
        const periodEnd = subscription.items.data[0]?.current_period_end ?? null;
        upsertSubscriber({
          email: email.toLowerCase().trim(),
          status: subscription.status === "active" ? "active" : subscription.status,
          stripe_customer_id: subscription.customer as string,
          current_period_end: periodEnd,
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
