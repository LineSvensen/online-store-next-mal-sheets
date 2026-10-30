import { RotateCcw, ShieldCheck, Truck } from "lucide-react";

export default function TrustSection() {
  const items = [
    {
      icon: Truck,
      title: "Fast delivery",
      text: "Quick and reliable shipping.",
    },
    {
      icon: RotateCcw,
      title: "Easy returns",
      text: "Simple returns within the return period.",
    },
    {
      icon: ShieldCheck,
      title: "Secure payment",
      text: "Safe checkout with trusted payment providers.",
    },
  ];

  return (
    <section className="border-y border-gray-200 bg-white">
      <div className="mx-auto grid justify-center max-w-6xl gap-8 px-6 py-10 sm:grid-cols-3">
        {items.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex  gap-4  flex-col items-center text-center"
          >
            <Icon size={26} strokeWidth={1.7} />

            <div>
              <h2 className="font-medium">{title}</h2>

              <p className="mt-1 text-sm leading-6 text-gray-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
