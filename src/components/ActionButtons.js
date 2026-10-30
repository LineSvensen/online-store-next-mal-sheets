import Link from "next/link";
import { ArrowRight, House } from "lucide-react";

export default function ActionButtons() {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-4">
      <Link
        href="/products"
        className="inline-flex items-center justify-center gap-2 bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
      >
        Continue shopping
        <ArrowRight size={18} />
      </Link>

      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:border-black hover:text-black"
      >
        <House size={18} />
        Back to home
      </Link>
    </div>
  );
}