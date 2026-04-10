/** Mirrors Django `StudentFeedback.LESSON_CHOICES` / `DIFFICULTY_CHOICES` — UI labels Af-Soomaali. */

export const STUDENT_FEEDBACK_LESSON_CHOICES = [
  { value: "html_css", label: "HTML & CSS" },
  { value: "javascript", label: "JavaScript" },
  { value: "react", label: "React" },
  { value: "react_router", label: "React Router" },
  { value: "nodejs", label: "Node.js" },
  { value: "express", label: "Express" },
  { value: "mongodb", label: "MongoDB" },
  { value: "fullstack", label: "Mashruuca Full-Stack (Full-Stack Project)" },
  { value: "other", label: "Mid kale" },
] as const;

export type StudentFeedbackLessonValue = (typeof STUDENT_FEEDBACK_LESSON_CHOICES)[number]["value"];

export const STUDENT_FEEDBACK_DIFFICULTY_CHOICES = [
  { value: "too_easy", label: "Aad u fudud" },
  { value: "just_right", label: "Aad u munaasib ah" },
  { value: "challenging", label: "Wax yar baa ku adkaa" },
  { value: "too_hard", label: "Aad buu u adkaa" },
] as const;

export type StudentFeedbackDifficultyValue =
  (typeof STUDENT_FEEDBACK_DIFFICULTY_CHOICES)[number]["value"];

export const RATING_LABELS: Record<number, string> = {
  1: "Ma caawin",
  2: "Ka hooseeya filashada",
  3: "Wanaagsan",
  4: "Aad u wanaagsan",
  5: "Aad u fiican",
};

export function lessonLabel(value: string): string {
  const row = STUDENT_FEEDBACK_LESSON_CHOICES.find((c) => c.value === value);
  return row?.label ?? value;
}
