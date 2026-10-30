import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="bg-black px-6 py-2.5 text-center text-sm text-white">
      <p>
        50% off everything right now{" "}
        <Link
          href="/products"
          className="font-medium underline underline-offset-4"
        >
          Shop now
        </Link>
      </p>
    </div>
  );
}
