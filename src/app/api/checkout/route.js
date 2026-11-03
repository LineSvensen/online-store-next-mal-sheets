import Stripe from "stripe";
import { getFreshProducts } from "@/lib/products";

export const runtime = "nodejs";

export async function POST(request) {
  // Stripe er valgfritt i Kodera-templaten
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return Response.json(
      { error: "Stripe is not configured" },
      { status: 503 },
    );
  }

  try {
    const baseUrl = process.env.SITE_URL;

    if (!baseUrl) {
      throw new Error("SITE_URL is not configured");
    }

    const { items } = await request.json();

    // Kontroller handlekurven
    if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
      return Response.json(
        { error: "Cart is empty or invalid" },
        { status: 400 },
      );
    }

    // Hent FERSKE produkter direkte fra Google Sheets
    const products = await getFreshProducts();

    const usedIds = new Set();
    const lineItems = [];

    for (const cartItem of items) {
      const id = Number(cartItem?.id);
      const quantity = cartItem?.quantity;

      if (
        !Number.isSafeInteger(id) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 99 ||
        usedIds.has(id)
      ) {
        return Response.json({ error: "Invalid cart item" }, { status: 400 });
      }

      usedIds.add(id);

      const product = products.find((product) => product.id === id);

      if (!product || product.tilgjengelig !== true) {
        return Response.json(
          {
            error: "A product is no longer available. Please update your cart.",
          },
          { status: 409 },
        );
      }

      // Kontroller produktpris
      const amount = Math.round(product.price * 100);

      if (
        !Number.isFinite(product.price) ||
        product.price <= 0 ||
        !Number.isSafeInteger(amount) ||
        Math.abs(product.price * 100 - amount) > 0.000001
      ) {
        console.error("Invalid Sheets price for product:", id);

        return Response.json(
          { error: "A product has an invalid price" },
          { status: 422 },
        );
      }

      lineItems.push({
        price_data: {
          currency: "nok",
          product_data: {
            name: product.name,
          },
          unit_amount: amount,
        },
        quantity,
      });
    }

    // Opprett Stripe først etter valideringen
    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,

      shipping_address_collection: {
        allowed_countries: ["NO"],
      },

      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
    });

    return Response.json({
      url: session.url,
    });
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
