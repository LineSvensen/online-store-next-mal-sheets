import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product?.name ?? "Product",
    description: product?.description,
  };
}

// Single product page

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mb-4 flex flex-col gap-4 px-4">
        <Breadcrumbs
          items={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: "Products",
              href: "/products",
            },
            {
              label: product.name,
            },
          ]}
        />
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="aspect-square bg-gray-100" />

          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>

            <p className="mt-4 text-gray-600">{product.description}</p>

            <p className="mt-6 text-xl font-semibold">{product.price} kr</p>
          </div>
        </div>
      </div>
    </main>
  );
}
