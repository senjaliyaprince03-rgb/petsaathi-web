"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md w-full glass-card p-8 rounded-2xl">
        <div className="text-8xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold text-gray-900 font-outfit">Something went wrong</h1>
        <p className="text-gray-600 text-lg">
          We encountered an unexpected error.
        </p>
        <div className="pt-4 flex items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-primary-500/30"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
