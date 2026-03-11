# Lesson rendering — files involved (audit)

Used for mobile-first redesign. Do not change: backend, block progression logic, video player functionality, problem/quiz logic, CodeChallengeBlock logic, API calls, auth/payment.

## Core

- **LessonDetailClient.tsx** – Main lesson screen: container, block routing (text/image/video/code/problem/example), AnimatePresence, AnswerFeedback trigger. Inline `case "code"` and `case "example"` rendering.
- **LessonHeader.tsx** – Progress bar, back button, dot nav, LessonStreak (XP). Receives currentQuestion, totalQuestions, coursePath, onDotClick, completedLessons.

## Block components

- **TextBlock.tsx** – Text/list/table content, inline images, numbered list, feature table, continue button.
- **VideoBlock.tsx** – Video element, custom controls (play/pause, scrubber, fullscreen), overlay, loading/error, continue button.
- **ImageBlock.tsx** – One or more images with optional text and captions, continue button.
- **ProblemBlock.tsx** – Question card, MCQ/short_input/diagram/matching/code/calculator. Renders options, check-answer button; delegates to CalculatorProblemBlock, MatchingBlock, CodeChallengeBlock. Feedback is shown by parent via AnswerFeedback.

## Code path

- **ShikiCode.tsx** – Syntax-highlighted code (used in LessonDetailClient `case "code"` and inside ProblemBlock for code options).
- **CodeEditor.tsx** – Simple code editor (line numbers + textarea). Used only by CodeChallengeBlock.
- **CodeChallengeBlock.tsx** – Code challenge: question, CodeEditor, Run Tests / Reset, TestResults, explanation when all passed.
- **TestResults.tsx** – Test result rows (label, expected/received, logs).

## Feedback & header widget

- **AnswerFeedback.tsx** – Fixed bottom bar: correct/incorrect, XP, Sharaxaad, Continue/Try again. Rendered by LessonDetailClient when showFeedback.
- **LessonStreak.tsx** – XP/streak popover in header.

## Shared UI (use as-is or minimal tweaks)

- Card, CardContent, CardFooter (ui/card)
- Button (ui/button)
- Slider (ui/slider) – VideoBlock
- AnimatePresence (framer-motion) – LessonDetailClient
