import { ArrowUpRight, Mail } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <Mail size={30} strokeWidth={1.5} className="mx-auto" />

        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-gray-500">
          Get in touch
        </p>

        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
          Have a question?
        </h2>

        <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-600">
          Questions about products, shipping or your order? We&apos;re happy to
          help.
        </p>

        <a
          href="mailto:hello@example.com"
          className="mt-8 inline-flex items-center gap-2 border border-black px-6 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
        >
          hello@example.com
          <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}
