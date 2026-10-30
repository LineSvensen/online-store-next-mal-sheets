import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold">
              Online Store
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-600">
              A modern and simple online store.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide">
              Shop
            </h2>

            <nav className="mt-4 flex flex-col gap-3 text-sm text-gray-600">
              <Link href="/products" className="hover:text-black">
                All products
              </Link>

              <Link href="/cart" className="hover:text-black">
                Cart
              </Link>
            </nav>
          </div>

          {/* Information */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide">
              Information
            </h2>

            <nav className="mt-4 flex flex-col gap-3 text-sm text-gray-600">
              <Link href="/about" className="hover:text-black">
                About us
              </Link>

              <Link href="/contact" className="hover:text-black">
                Contact
              </Link>

              <Link href="/policy" className="hover:text-black">
                Shipping & returns
              </Link>

              <Link href="/policy" className="hover:text-black">
                Terms & conditions
              </Link>

              <Link href="/policy" className="hover:text-black">
                Privacy policy
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide">
              Contact
            </h2>

            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p>hello@example.com</p>
              <p>Oslo, Norway</p>

              <div className="flex gap-4 pt-2">
                <a href="#" className="hover:text-black">
                  Instagram
                </a>

                <a href="#" className="hover:text-black">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-200 pt-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Online Store. All rights reserved.
            </p>

            {/* Kodera credit */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex flex-row justify-center gap-2 items-center">
                Kodet med ❤️ av kvinner i
                <a
                  href="https://kodera.no"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                  aria-label="Kodera"
                >
                  <Image
                    src="/images/kodera-logo-01.svg"
                    alt="Kodera"
                    width={70}
                    height={24}
                    className="h-auto w-auto max-h-6"
                  />
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
