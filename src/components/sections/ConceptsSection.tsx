
export function ConceptsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Math Visualization */}
          <div className="relative">
            < svg
              viewBox="0 0 500 500"
              className="w-full max-w-lg mx-auto"

            >
              {/* Background Grid */}
              <path
                d="M50 250 H450 M250 50 V450"
                stroke="#f0f0f0"
                strokeWidth="0.5"
                fill="none"
              />
              <circle
                cx="250"
                cy="250"
                r="200"
                stroke="#f0f0f0"
                strokeWidth="0.5"
                fill="none"
              />

              {/* Main Elements */}
              <path
                d="M250 250 L450 250"
                stroke="#000"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M250 250 L250 50"
                stroke="#000"
                strokeDasharray="5,5"
                strokeWidth="2"
                fill="none"
              />

              {/* Angle Area */}
              <path
                d="M250 250 L450 250 A200 200 0 0 0 250 50"
                fill="#FFD700"
                fillOpacity="0.1"
              />

              {/* Point */}
              <circle
                cx="250"
                cy="50"
                r="6"
                fill="#4F46E5"
                className="glow"
              />

              {/* Labels */}
              <text x="460" y="240" className="text-sm">r</text>
              <text x="260" y="40" className="text-sm">y</text>
              <text x="320" y="200" className="text-sm">45°</text>
            </ svg>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Fikrado la fahmi karo</h2>
            <p className="text-xl text-gray-600">
              Casharada ku saleysan tusaaloyin la taaban kari ayaa ka dhigaya fikradaha adag kuwo fudud oo la fahmi karo. Fekerka wuxu sare uqaadaa Maskaxdaada.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
