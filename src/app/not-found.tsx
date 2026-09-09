import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md w-full glass-card p-8 rounded-2xl">
        <div className="text-8xl mb-4">🐕</div>
        <h1 className="text-3xl font-bold text-gray-900 font-outfit">Page Not Found</h1>
        <p className="text-gray-600 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="pt-4">
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-primary-500/30"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
