"use client";

import { useState } from "react";
import Link from "next/link";

import { useCartStore } from "@/store/cartStore";
import { Menu, ShoppingBag, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const items = useCartStore((state) => state.items);

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="relative border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold" onClick={closeMenu}>
          Online Store
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/policy">Store policy</Link>

          <Link
            href="/cart"
            className="relative inline-flex"
            aria-label="Shopping cart"
          >
            <ShoppingBag size={24} />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[11px] font-medium leading-none text-white">
                <span
                  className={`relative top-[0.5px] ${
                    cartCount >= 10 ? "-left-[0.5px]" : ""
                  }`}
                >
                  {cartCount}
                </span>
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-5 md:hidden ">
          <Link
            href="/cart"
            className="relative inline-flex"
            aria-label="Shopping cart"
            onClick={closeMenu}
          >
            <ShoppingBag size={24} />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[11px] font-medium leading-none text-white">
                <span
                  className={`relative top-[0.5px] ${
                    cartCount >= 10 ? "-left-[0.5px]" : ""
                  }`}
                >
                  {cartCount}
                </span>
              </span>
            )}
          </Link>

          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="absolute left-0 top-full z-50 w-full border-b border-gray-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-6 py-6">
            <Link
              href="/"
              onClick={closeMenu}
              className="border-b border-gray-100 py-3"
            >
              Home
            </Link>

            <Link
              href="/products"
              onClick={closeMenu}
              className="border-b border-gray-100 py-3"
            >
              Products
            </Link>

            <Link
              href="/about"
              onClick={closeMenu}
              className="border-b border-gray-100 py-3"
            >
              About
            </Link>
            <Link href="/contact" onClick={closeMenu} className="py-3">
              Contact
            </Link>

            <Link href="/policy" onClick={closeMenu} className="py-3">
              Store policy
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
