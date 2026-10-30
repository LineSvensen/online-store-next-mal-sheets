import Stripe from "stripe";
import ClearCart from "@/components/ClearCart";
import ActionButtons from "@/components/ActionButtons";

export const metadata = {
  title: "Order confirmed",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  // Stripe er valgfritt i Kodera-templaten
  if (!stripeSecretKey) {
    return (
      <main className="min-h-screen px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold">Checkout is not available</h1>

          <p className="mt-4 text-gray-600">
            Payments are not configured for this website.
          </p>

          <ActionButtons />
        </div>
      </main>
    );
  }

  if (!session_id) {
    return (
      <main className="min-h-screen px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold">No order found</h1>

          <ActionButtons />
        </div>
      </main>
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  let session;

  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });
  } catch (error) {
    console.error("Could not retrieve Stripe session:", error.message);

    return (
      <main className="min-h-screen px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold">Order could not be verified</h1>

          <p className="mt-4 text-gray-600">
            We could not retrieve your order details. Please contact the store
            if you have been charged.
          </p>

          <ActionButtons />
        </div>
      </main>
    );
  }

  // Ikke vis ordren som betalt før Stripe bekrefter det
  if (session.payment_status !== "paid") {
    return (
      <main className="min-h-screen px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold">Payment not confirmed</h1>

          <p className="mt-4 text-gray-600">
            Your payment has not been confirmed yet.
          </p>

          <ActionButtons />
        </div>
      </main>
    );
  }

  const items = session.line_items?.data ?? [];

  return (
    <main className="min-h-screen px-6 py-20">
      <ClearCart />

      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Thank you for your order!</h1>

        <p className="mt-4 text-gray-600">Your payment was successful.</p>

        <div className="mt-10 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b border-gray-200 pb-4"
            >
              <div>
                <p className="font-medium">{item.description}</p>

                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <p className="font-medium">
                {(item.amount_total / 100).toFixed(2)} kr
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between border-t border-gray-300 pt-4">
          <p className="font-semibold">Total</p>

          <p className="font-semibold">
            {(session.amount_total / 100).toFixed(2)} kr
          </p>
        </div>

        <ActionButtons />
      </div>
    </main>
  );
}
