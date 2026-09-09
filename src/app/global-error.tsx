"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="text-center space-y-6 max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="text-8xl mb-4">🚨</div>
            <h1 className="text-3xl font-bold text-gray-900 font-outfit">Something went critically wrong</h1>
            <p className="text-gray-600 text-lg">
              A fatal error occurred.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => reset()}
                className="w-full sm:w-auto px-6 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 transition-colors"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
