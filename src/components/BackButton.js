"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium hover:underline"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
}
