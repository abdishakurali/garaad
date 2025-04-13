export function InteractiveLessonsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Interactive Animation */}
          <div className="relative">
            <svg
              viewBox="0 0 400 400"
              className="w-full max-w-lg mx-auto"
            >
              {/* Code Editor Visual */}
              <rect x="50" y="50" width="300" height="200" fill="#1E1E1E" rx="10" />
              <rect x="60" y="70" width="280" height="20" fill="#2D2D2D" />
              <rect x="60" y="100" width="200" height="20" fill="#2D2D2D" />
              <rect x="60" y="130" width="240" height="20" fill="#2D2D2D" />

              {/* Interactive Elements */}
              <circle
                cx="320"
                cy="160"
                r="8"
                fill="#4F46E5"
              />
            </svg>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <h2
              className="text-4xl lg:text-5xl font-bold"
            >
              Casharada is-dhexgalka leh
            </h2>
            <p
              className="text-xl text-gray-600"
            >
              Ka qayb qaado casharada si toos ah oo is-dhex gal ah. Hel jawaab-celin degdeg ah oo ku caawin doona inaad si fiican u fahanto.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
