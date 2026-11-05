import Stripe from "stripe";
import { getFreshProducts } from "@/lib/products";

export const runtime = "nodejs";

export async function POST(request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Stripe must be explicitly enabled.
  const stripeEnabled = process.env.STRIPE_CHECKOUT_ENABLED === "true";

  if (!stripeEnabled || !stripeSecretKey || !webhookSecret) {
    return Response.json(
      { error: "Checkout is not configured" },
      { status: 503 },
    );
  }

  try {
    const baseUrl = process.env.SITE_URL;

    if (!baseUrl) {
      throw new Error("SITE_URL is not configured");
    }

    const { items } = await request.json();

    if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
      return Response.json(
        { error: "Cart is empty or invalid" },
        { status: 400 },
      );
    }

    // Always use fresh, validated Google Sheets data.
    const products = await getFreshProducts();

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    const usedIds = new Set();
    const lineItems = [];

    let orderTotal = 0;
    let totalQuantity = 0;

    for (const cartItem of items) {
      const id = cartItem?.id;
      const quantity = cartItem?.quantity;

      if (
        !Number.isSafeInteger(id) ||
        id <= 0 ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 99 ||
        usedIds.has(id)
      ) {
        return Response.json({ error: "Invalid cart item" }, { status: 400 });
      }

      usedIds.add(id);

      const product = productMap.get(id);

      if (!product || product.tilgjengelig !== true) {
        return Response.json(
          {
            error: "A product is no longer available. Please update your cart.",
          },
          { status: 409 },
        );
      }

      // Price comes from Google Sheets, never the browser.
      const amount = Math.round(product.price * 100);

      if (
        !Number.isFinite(product.price) ||
        product.price <= 0 ||
        !Number.isSafeInteger(amount) ||
        Math.abs(product.price * 100 - amount) > 0.000001
      ) {
        return Response.json(
          { error: "A product has an invalid price" },
          { status: 422 },
        );
      }

      orderTotal += amount * quantity;
      totalQuantity += quantity;

      if (!Number.isSafeInteger(orderTotal) || totalQuantity > 100) {
        return Response.json(
          { error: "Cart exceeds allowed limits" },
          { status: 400 },
        );
      }

      lineItems.push({
        price_data: {
          currency: "nok",
          product_data: {
            name: product.name,

            // Reference back to Google Sheets.
            metadata: {
              product_id: String(product.id),
              product_slug: product.slug,
            },
          },
          unit_amount: amount,
        },
        quantity,
      });
    }

    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,

      // Identifies which CMS created the checkout.
      metadata: {
        cms: "google_sheets",
      },

      shipping_address_collection: {
        allowed_countries: ["NO"],
      },

      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${baseUrl}/cart`,
    });

    return Response.json(
      { url: session.url },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return Response.json(
      { error: "Could not create checkout session" },
      { status: 500 },
    );
  }
}

//api endpoint

// Cart
//   ↓
// Go to checkout
//   ↓
// POST /api/checkout
//   ↓
// route.js kjører på SERVEREN
//   ↓
// Stripe får produktene/prisene
//   ↓
// Stripe oppretter Checkout Session
//   ↓
// vi får en Stripe Checkout-URL
//   ↓
// kunden sendes dit

// import Stripe from "stripe";
// import { getProducts } from "@/lib/products";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(request) {
//   try {
//     const { items } = await request.json();

//     const products = getProducts();

//     const lineItems = items.map((cartItem) => {
//       const product = products.find((product) => product.id === cartItem.id);

//       if (!product) {
//         throw new Error("Product not found");
//       }

//       return {
//         price_data: {
//           currency: "nok",

//           product_data: {
//             name: product.name,
//           },

//           unit_amount: product.price * 100,
//         },

//         quantity: cartItem.quantity,
//       };
//     });

//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",

//       line_items: lineItems,

//       shipping_address_collection: {
//         allowed_countries: ["NO"],
//       },

//       success_url: `${request.headers.get(
//         "origin",
//       )}/success?session_id={CHECKOUT_SESSION_ID}`,

//       cancel_url: `${request.headers.get("origin")}/cart`,
//     });

//     return Response.json({
//       url: session.url,
//     });
//   } catch (error) {
//     console.error(error);

//     return Response.json(
//       {
//         error: "Could not create checkout session",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }
