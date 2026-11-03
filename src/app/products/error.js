"use client";

export default function ProductsError({ error, reset }) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>

      <p className="mt-4 max-w-md text-gray-600">
        We couldn't load the products right now. Please try again in a moment.
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 cursor-pointer bg-black px-6 py-3 text-white hover:bg-gray-800"
      >
        Try again
      </button>
    </main>
  );
}
