const courses = [
  {
    title: "Math",
    description: "Xisaabta iyo Algebra",
    icon: "M4 4v16h16v-2H6V4H4zm6 8l6-6v12l-6-6z", // Graph icon
  },
  {
    title: "Data Analysis",
    description: "Falanqaynta Xogta",
    icon: "M4 19h16v2H4zm3-4h10v2H7zm0-4h10v2H7zm0-4h10v2H7z", // Chart icon
  },
  {
    title: "Computer Science",
    description: "Sayniska Kombuyutarka",
    icon: "M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z",
  },
  {
    title: "Programming & AI",
    description: "Barnaamij Sameynta & AI",
    icon: "M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z",
  },
  {
    title: "Science & Engineering",
    description: "Sayniska & Injineernimada",
    icon: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
  },
];

export function CourseGrid() {
  return (
    <section className="py-0 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Casharadeena</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 relative overflow-hidden hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300" />
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary">
                    <path
                      d={course.icon}
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {course.title}
                  </h3>
                  <p className="text-gray-600">{course.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
