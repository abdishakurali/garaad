import Link from 'next/link';

// Optional: you can throw notFound() in a layout or page to render this UI.
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Bogga lama helin</h2>
        <p className="text-gray-600 mb-8">Raali ahaan, ma helin bogga aad raadinsayso.</p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ku noqo guriga
        </Link>
      </div>
    </div>
  );
}
