import CartClient from "./CartClient";

export const dynamic = "force-dynamic";

export default function CartPage() {
  const checkoutEnabled =
    process.env.STRIPE_CHECKOUT_ENABLED === "true" &&
    Boolean(process.env.STRIPE_SECRET_KEY) &&
    Boolean(process.env.STRIPE_WEBHOOK_SECRET);

  return <CartClient checkoutEnabled={checkoutEnabled} />;
}
