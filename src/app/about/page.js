import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About",
  description: "Learn more about our store and our story.",
};

export default function AboutPage() {
  return (
    <main>
      {/* Intro */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-gray-500">
              About us
            </p>

            <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Thoughtful products for everyday life.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
              We believe good products should feel simple, useful and made to
              last. Our store was created with a focus on quality, thoughtful
              design and a better shopping experience.
            </p>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
            <Image
              src="/images/about/about-main.jpg"
              alt="About our store"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="border-y border-gray-200">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:px-10 lg:grid-cols-2 lg:px-12 lg:py-28">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Our story
            </p>

            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Built with intention.
            </h2>
          </div>

          <div className="space-y-6 text-base leading-7 text-gray-600 sm:text-lg">
            <p>
              What started as a simple idea grew into a place where carefully
              selected products could live together in one thoughtful
              collection.
            </p>

            <p>
              We focus on pieces that combine function and design, and we aim to
              make every part of the shopping experience feel clear, personal
              and uncomplicated.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12 lg:py-28">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            What matters to us
          </p>

          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Simple values. Better choices.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <article className="border-t border-gray-300 pt-6">
            <p className="text-sm text-gray-400">01</p>

            <h3 className="mt-4 text-xl font-semibold">Quality</h3>

            <p className="mt-3 leading-7 text-gray-600">
              We choose products with care and focus on quality that feels good
              in everyday use.
            </p>
          </article>

          <article className="border-t border-gray-300 pt-6">
            <p className="text-sm text-gray-400">02</p>

            <h3 className="mt-4 text-xl font-semibold">Simplicity</h3>

            <p className="mt-3 leading-7 text-gray-600">
              From product selection to checkout, we want the experience to be
              simple, intuitive and easy.
            </p>
          </article>

          <article className="border-t border-gray-300 pt-6">
            <p className="text-sm text-gray-400">03</p>

            <h3 className="mt-4 text-xl font-semibold">Thoughtfulness</h3>

            <p className="mt-3 leading-7 text-gray-600">
              We believe small details matter and aim to make thoughtful choices
              throughout the store.
            </p>
          </article>
        </div>
      </section>

      {/* Image section */}
      <section className="px-6 md:px-10 lg:px-12">
        <div className="relative mx-auto h-[420px] max-w-7xl overflow-hidden bg-gray-100 sm:h-[520px] lg:h-[650px]">
          <Image
            src="/images/about/about-wide.jpg"
            alt="Our products and story"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Explore the collection
        </p>

        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">
          Find something made for you.
        </h2>

        <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-600">
          Discover our current collection and find products designed to make
          everyday life a little better.
        </p>

        <Link
          href="/products"
          className="mt-8 inline-flex border border-black px-7 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
        >
          Shop products
        </Link>
      </section>
    </main>
  );
}
