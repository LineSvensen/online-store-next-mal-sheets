import Stripe from "stripe";

// Stripe er valgfritt i Kodera-templaten.
// Webhooken aktiveres bare når nødvendige Stripe-nøkler er konfigurert.

export const runtime = "nodejs";

export async function POST(request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Ikke initialiser Stripe hvis det ikke er konfigurert
  if (!stripeSecretKey || !webhookSecret) {
    console.error("Stripe webhook is not configured");

    return Response.json(
      { error: "Stripe webhook is not configured" },
      { status: 503 },
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json(
      { error: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);

    return new Response("Webhook Error", {
      status: 400,
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    const order = {
      stripeSessionId: session.id,

      customer: {
        name: session.customer_details?.name,
        email: session.customer_details?.email,
      },

      shippingAddress: session.collected_information?.shipping_details?.address,

      items: lineItems.data.map((item) => ({
        name: item.description,
        quantity: item.quantity,
        amount: item.amount_total,
      })),

      total: session.amount_total,
      currency: session.currency,
      paymentStatus: session.payment_status,
      createdAt: new Date().toISOString(),
    };

    console.log("✅ New order:", order);

    // TODO: Lagre ordren i database
    // TODO: Oppdater lagerbeholdning
    // TODO: Send ordrebekreftelse
  }

  return Response.json({
    received: true,
  });
}

// import Stripe from "stripe";

// gjør betalingsflyten robust !

// Akkurat nå stoler vi på at kunden kommer tilbake til /success,
// men det er ikke nok i en ekte butikk.
//  Kunden kan betale og så lukke fanen før redirect.
// Webhook betyr at Stripe sender beskjed direkte til backend når
// betalingen faktisk er fullført.

// Kunde betaler i Stripe
//         ↓
// Stripe bekrefter betalingen
//         ↓
// Stripe sender event til /api/webhook
//         ↓
// Backend vet sikkert at betaling = fullført
//         ↓
// senere kan vi:
// - opprette ordre
// - trekke lagerbeholdning
// - sende e-post

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); fjernet pga build

// export async function POST(request) {
//   const body = await request.text();
//   const signature = request.headers.get("stripe-signature");

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET,
//     );
//   } catch (error) {
//     console.error("Webhook signature verification failed:", error.message);

//     return new Response("Webhook Error", {
//       status: 400,
//     });
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;

//     const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

//     const order = {
//       stripeSessionId: session.id,

//       customer: {
//         name: session.customer_details?.name,
//         email: session.customer_details?.email,
//       },

//       shippingAddress: session.collected_information?.shipping_details?.address,

//       items: lineItems.data.map((item) => ({
//         name: item.description,
//         quantity: item.quantity,
//         amount: item.amount_total,
//       })),

//       total: session.amount_total,
//       currency: session.currency,

//       paymentStatus: session.payment_status,
//       createdAt: new Date().toISOString(),
//     };

//     console.log("✅ New order:", order);
//   }

//   return Response.json({
//     received: true,
//   });
// }
