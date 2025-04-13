export function MotivationSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-white via-primary/[0.02] to-background relative overflow-hidden">
      {/* Enhanced decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/2" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Vector Graphics */}
          <div className="relative">
            <svg
              viewBox="0 0 400 400"
              className="w-full max-w-lg mx-auto relative z-10"

            >
              {/* Enhanced base object with gradient */}
              <defs>
                <radialGradient id="planetGradient" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FFA500" />
                </radialGradient>
              </defs>

              <circle cx="200" cy="250" r="40" fill="url(#planetGradient)" />

              {/* Vector arrows with enhanced styling */}
              <g

              >
                <path
                  d="M200 250 L200 150"
                  stroke="#4F46E5"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M200 250 L300 250"
                  stroke="#4F46E5"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M200 150 L300 150"
                  stroke="#4F46E5"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="glow"
                />

                {/* Arrow labels with better visibility */}
                <text x="170" y="200" className="text-sm font-medium">s⃗</text>
                <text x="250" y="270" className="text-sm font-medium">r⃗</text>
                <text x="250" y="140" className="text-sm font-medium">r⃗ - s⃗</text>
              </g>

              {/* Enhanced particle effect */}
              <circle
                cx="300"
                cy="150"
                r="6"
                fill="#4F46E5"
                className="glow"

              />
            </svg>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <h2
              className="text-4xl lg:text-5xl font-bold"

            >
              Wax-Barasho waxtar Leh.<br />
              <span className="relative">
                qaab madadaalo ah.
                <svg
                  className="absolute -bottom-1 top-8 left-0 w-full"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,5 Q50,9 100,5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-primary"
                  />
                </svg>
              </span>
            </h2>
            <p
              className="text-xl text-gray-600"

            >
              Midaamka wax-barasho ee Garaad waa inaad fikirto caqabadna xalliso, mana aha inaad xasuusato.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
