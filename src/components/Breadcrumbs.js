import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition hover:text-black">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "text-black" : ""}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && <ChevronRight size={14} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
