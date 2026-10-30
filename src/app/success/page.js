import Stripe from "stripe";
import ClearCart from "@/components/ClearCart";
import ActionButtons from "@/components/ActionButtons";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const metadata = {
  title: "Order confirmed",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <main className="min-h-screen px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold">No order found</h1>
        </div>
      </main>
    );
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items"],
  });

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
