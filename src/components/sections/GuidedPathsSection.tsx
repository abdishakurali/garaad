"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

const subjects = [
  { id: "math", label: "Xisaabta" },
  { id: "cs", label: "Computer Science" },
  { id: "data", label: "Data Science and AI" },
  { id: "science", label: "Logic and Thinking" },
];

const mathCourses = [
  {
    title: "Xalinta Isla'egyada",
    description: "Solving Equations",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-2h2v2zm0-4h-2V7h2v6z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Nidaamyada Isla'egyada",
    description: "Systems of Equations",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Xisaabta Dhabta ah",
    description: "Real World Algebra",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5.97 4.06L14.09 9l1.06 1.06l-2.83 2.83l2.83 2.83l-1.06 1.06L11.25 14l-2.83 2.83l-1.06-1.06l2.83-2.83l-2.83-2.83l1.06-1.06L11.25 12l2.78-2.94z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Fahamka Jaantuska",
    description: "Understanding Graphs",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M3.5 18.49l6-6.01l4 4L22 6.92l-1.41-1.41l-7.09 7.97l-4-4L2 16.99z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Joomitri I",
    description: "Geometry I",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Vectors",
    description: "Vectors",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M12 2L3 9l3 3L3 15l9 7 9-7-3-3 3-3-9-7zm0 4.6L15.89 9 12 12.1 8.11 9 12 6.6z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Calculus",
    description: "Calculus",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M4 19h16v2H4zm16-6H4v2h16zm0-6H4v2h16zm0-6H4v2h16z M7 17h2v-3H7zm4 0h2V7h-2zm4 0h2v-5h-2z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export function GuidedPathsSection() {
  const [activeTab, setActiveTab] = useState("math");
  const [angle, setAngle] = useState(300);

  return (
    <section className="py-8 sm:py-16   pt-6 sm:pt-10 pb-5 bg-gradient-to-b from-background to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/2" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-4 relative">
        <h2
          className="text-4xl lg:text-5xl font-bold text-center mb-12"

        >
          Waddooyinka lagugu hagayo{" "}
          <span className="relative inline-block">
            safar kasta
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
        </h2>

        {/* Tab Navigation */}
        <div role="tablist" className="flex justify-center mb-12 px-4 overflow-x-auto -mx-4 py-2">
          <div className="inline-flex p-1.5 bg-white shadow-lg rounded-full relative min-w-0">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                role="tab"
                aria-selected={activeTab === subject.id}
                aria-controls={`${subject.id}-panel`}
                onClick={() =>
                  subject.id === "math" && setActiveTab(subject.id)
                }
                className={cn(
                  "px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative whitespace-nowrap",
                  subject.id === "math"
                    ? activeTab === subject.id
                      ? "bg-primary text-white shadow-sm transform scale-105"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    : "text-gray-400 cursor-not-allowed opacity-60"
                )}
              >
                {subject.label}
                {subject.id !== "math" && (
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[8px] sm:text-[10px] font-semibold bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                    Dhowaan
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Course List */}
            <div
              className="space-y-2"

            >
              <div className="space-y-1.5">
                {mathCourses.map((course) => (
                  <div
                    key={course.title}
                    className="flex items-center gap-3 p-2.5 group bg-white rounded-lg hover:shadow-md transition-all cursor-pointer"

                  >
                    <div className="w-8 h-8 shrink-0 transition-transform group-hover:scale-110">
                      {course.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm">
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {course.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="px-2.5 text-xs text-primary hover:text-primary/80 transition-colors">
                16 Casharo oo kale
              </button>
            </div>

            {/* Interactive Visualization */}
            <div
              key={activeTab}

              className="relative aspect-square bg-white rounded-2xl p-8 shadow-sm"
            >
              {activeTab === "math" && (
                <div className="relative h-full" role="presentation">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-64 accent-primary"
                    aria-label="Adjust angle"
                  />
                  <svg className="w-full h-full" viewBox="0 0 400 400">
                    {/* Background grid with subtle lines */}
                    <defs>
                      <linearGradient
                        id="circleGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#4F46E5"
                          stopOpacity="0.1"
                        />
                        <stop
                          offset="100%"
                          stopColor="#4F46E5"
                          stopOpacity="0.05"
                        />
                      </linearGradient>
                    </defs>

                    {/* Subtle grid lines */}
                    <g className="text-gray-100">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <path
                          key={i}
                          d={`M${50 + i * 50},50 v300 M50,${50 + i * 50} h300`}
                          stroke="currentColor"
                          strokeWidth="0.5"
                          strokeDasharray="4 4"
                        />
                      ))}
                    </g>

                    {/* Main circle with gradient */}
                    <circle
                      cx="200"
                      cy="180"
                      r="150"
                      fill="url(#circleGradient)"
                      className="stroke-primary"
                      strokeWidth="2"
                    />

                    {/* Rotating angle indicator */}
                    <path
                      d={`M200,200 L${200 + 150 * Math.cos((angle * Math.PI) / 180)},${200 + 150 * Math.sin((angle * Math.PI) / 180)}`}
                      className="stroke-primary"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Angle label */}
                    <text
                      x="200"
                      y="160"
                      className="text-lg font-medium text-primary text-center"
                      textAnchor="middle"
                    >
                      {angle}°
                    </text>

                    {/* "Xagalada dibadda" label */}
                    <text
                      x="200"
                      y="360"
                      className="text-sm text-gray-600 text-center"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      Xagalada dibadda
                    </text>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
