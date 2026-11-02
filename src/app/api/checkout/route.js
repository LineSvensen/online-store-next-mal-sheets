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

    const baseUrl = process.env.SITE_URL;
    if (!baseUrl) {
      throw new Error("SITE_URL is not configured");
    }

    const stripe = new Stripe(stripeSecretKey);

    const { items } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return Response.json(
        { error: "Cart is empty or invalid" },
        { status: 400 },
      );
    }

    const products = await getProducts();

    const lineItems = items.map((cartItem) => {
      const product = products.find(
        (product) => product.id === Number(cartItem.id),
      );

      if (!product) {
        throw new Error("Product not found");
      }
      if (product.tilgjengelig === false) {
        throw new Error("Product is not available");
      }

      const amount = Math.round(product.price * 100);

      if (!Number.isSafeInteger(amount) || amount <= 0) {
        throw new Error("Invalid product price");
      }

      if (
        !Number.isInteger(cartItem.quantity) ||
        cartItem.quantity < 1 ||
        cartItem.quantity > 99
      ) {
        throw new Error("Invalid quantity");
      }

      return {
        price_data: {
          currency: "nok",

          product_data: {
            name: product.name,
          },

          unit_amount: amount,
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
