
const courseLevels = [
  {
    level: "Heerka 2",
    title: "Hordhaca Algorithms",
    description: "Baro qaababka xalinta dhibaatooyinka",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    level: "Heerka 3",
    title: "Game Development",
    description: "Samee ciyaaraha computer-ka",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    level: "Heerka 4",
    title: "Data Structures",
    description: "Baro qaababka xogta loo habeeyey",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    level: "Heerka 5",
    title: "Machine Learning",
    description: "Baro barashada mashiinka",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M21 11.18V9.72c0-.47-.16-.92-.46-1.28L16.6 3.72c-.38-.46-.94-.72-1.54-.72H8.94c-.6 0-1.16.26-1.54.72L3.46 8.44C3.16 8.8 3 9.25 3 9.72v4.56c0 .47.16.92.46 1.28l3.94 4.72c.38.46.94.72 1.54.72h6.12c.6 0 1.16-.26 1.54-.72l3.94-4.72c.3-.36.46-.81.46-1.28V11.18z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export function LearningLevelsSection() {
  return (
    <section className="py-4 md:mt-4 bg-gradient-to-b from-white to-primary/5 relative overflow-hidden">
      {/* Add decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/2" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Content */}
      <div className="relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Text Content */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Baro heerkaaga
              </h2>
              <p className="text-xl text-gray-600">
                Dib u eeg aasaaska ama baro xirfado cusub.{" "}
                <span className="relative">
                  Loogu talagalay bartayaasha da`doodu tahay 13 ilaa 113
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
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
              </p>
            </div>

            {/* Course Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-10">
              {courseLevels.map((course, index) => (
                <div
                  key={index}
                  className="relative"
                  style={{ opacity: 1, transform: "translateY(0)" }}
                >
                  <div className="absolute -top-4 left-4">
                    <span className="px-3 py-1 text-sm font-medium bg-primary/20 text-primary rounded-full">
                      {course.level}
                    </span>
                  </div>
                  <div className="flex items-start gap-6 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="w-16 h-16">{course.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold">{course.title}</h3>
                      <p className="text-gray-600">{course.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
