/** One free view of a gated lesson after the user leaves the upgrade modal (session only). */

export const LESSON_GATE_PREVIEW_KEY = "garaad_lesson_gate_preview";

export type LessonGatePreviewPayload = {
    courseId: string;
    lessonId: number;
};

export function grantLessonGatePreview(
    courseId: string | number,
    lessonId: number
): void {
    try {
        const payload: LessonGatePreviewPayload = {
            courseId: String(courseId),
            lessonId: Number(lessonId),
        };
        sessionStorage.setItem(LESSON_GATE_PREVIEW_KEY, JSON.stringify(payload));
    } catch {
        /* quota / private mode */
    }
}

export function peekLessonGatePreviewMatch(
    courseId: string | number | undefined,
    lessonId: number | undefined
): boolean {
    if (typeof window === "undefined" || courseId == null || lessonId == null) {
        return false;
    }
    try {
        const raw = sessionStorage.getItem(LESSON_GATE_PREVIEW_KEY);
        if (!raw) return false;
        const o = JSON.parse(raw) as LessonGatePreviewPayload;
        return (
            String(o.courseId) === String(courseId) &&
            Number(o.lessonId) === Number(lessonId)
        );
    } catch {
        return false;
    }
}

export function clearLessonGatePreview(): void {
    try {
        sessionStorage.removeItem(LESSON_GATE_PREVIEW_KEY);
    } catch {
        /* ignore */
    }
}
