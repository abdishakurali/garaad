export function LearningLevelSection() {
  return (
    <section className="py-24 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Heerka Waxbarashada
            </h2>
            <p className="text-xl text-gray-600">
              Ku habboon heerkaaga waxbarasho
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square max-w-md mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M20 80 C20 20, 50 20, 80 80"
                  stroke="currentColor"
                  className="text-primary"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                {[0, 1, 2].map((i) => (
                  <circle
                    key={i}
                    cx={20 + i * 30}
                    cy={80 - i * 30}
                    r="4"
                    className="text-primary fill-current"
                  />
                ))}
              </svg>
            </div>

            <div className="space-y-12">
              {[
                { title: "Bilow", desc: "Baro aasaaska" },
                { title: "Dhexe", desc: "Xooji aqoontaada" },
                { title: "Sare", desc: "Noqo khabiir" }
              ].map((level) => (
                <div
                  key={level.title}
                  className="space-y-2"
                >
                  <h3 className="text-2xl font-semibold">{level.title}</h3>
                  <p className="text-gray-600">{level.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
