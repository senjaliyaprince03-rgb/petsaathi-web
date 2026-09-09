export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-primary-600">
            🐾
          </div>
        </div>
        <p className="text-gray-600 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
