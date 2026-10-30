import Stripe from "stripe";
import { getProducts } from "@/lib/products";

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
    // Initialiser Stripe først når checkout brukes
    const stripe = new Stripe(stripeSecretKey);

    const { items } = await request.json();

    const products = getProducts();

    const lineItems = items.map((cartItem) => {
      const product = products.find((product) => product.id === cartItem.id);

      if (!product) {
        throw new Error("Product not found");
      }

      return {
        price_data: {
          currency: "nok",

          product_data: {
            name: product.name,
          },

          unit_amount: product.price * 100,
        },

        quantity: cartItem.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: lineItems,

      shipping_address_collection: {
        allowed_countries: ["NO"],
      },

      success_url: `${request.headers.get(
        "origin",
      )}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${request.headers.get("origin")}/cart`,
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
