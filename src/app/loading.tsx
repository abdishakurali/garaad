export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex flex-col items-center space-y-6 p-8">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-gray-700 text-lg font-medium">Waa la soo raraya...</p>
          <p className="text-gray-500 text-sm">Fadlan sug</p>
        </div>
      </div>
    </div>
  );
}
