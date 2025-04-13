
export function Timeline() {
  return (
    <div className="relative max-w-3xl mx-auto px-4">
      <svg
        className="w-full h-40 md:h-48"
        viewBox="0 0 800 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        < path
          d="M0 50 H800"
          stroke="#E5E7EB"
          strokeWidth="2"
        />

        < circle
          cx="200"
          cy="50"
          r="10"
          fill="#7C3AED"

        />

        <circle
          cx="600"
          cy="50"
          r="10"
          fill="#34A853"

        />
      </svg>

      <div
        className="absolute top-12 left-[calc(25%-100px)] text-base md:text-lg text-gray-600 w-48 text-center font-medium"

      >
        Aqoon la`aan
      </div>

      <div
        className="absolute top-12 right-[calc(25%-100px)] text-base md:text-lg text-gray-600 w-48 text-center font-medium"

      >
        Waa iftiin la`aan
      </div>
    </div>
  );
}
