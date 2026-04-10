import { API_BASE_URL } from "@/lib/constants";

type LessonWallPreviewApiLesson = {
  id: number;
  title: string;
  course: number;
  estimated_time?: number | null;
  content_blocks?: Array<{
    block_type: string;
    order?: number;
    content?: Record<string, unknown> | null;
  }>;
};

type LessonWallPreviewData = {
  lessonId: number;
  lessonTitle: string;
  courseId: number;
  courseTitle: string;
  teaser: string | null;
};

function sentenceFromLessonText(raw: string): string {
  const stripped = raw
    .replace(/[#*_`]/g, "")
    .replace(/\[(.*?)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  if (!stripped) return "";
  const oneSentence = stripped.split(/(?<=[.!?])\s/)[0] || stripped;
  const max = 160;
  return oneSentence.length > max ? `${oneSentence.slice(0, max - 1).trimEnd()}…` : oneSentence;
}

/** One-sentence teaser from ordered content blocks (lesson has no separate description field). */
function extractLessonTeaserFromBlocks(
  contentBlocks: LessonWallPreviewApiLesson["content_blocks"]
): string | null {
  if (!contentBlocks?.length) return null;
  const sorted = [...contentBlocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  for (const block of sorted) {
    const c = block.content;
    if (!c || typeof c !== "object") continue;
    if (block.block_type === "text" && typeof c.text === "string" && c.text.trim()) {
      const s = sentenceFromLessonText(c.text);
      if (s) return s;
    }
    if (block.block_type === "example") {
      const desc = typeof c.description === "string" ? c.description : "";
      const title = typeof c.title === "string" ? c.title : "";
      const pick = desc.trim() || title.trim();
      if (pick) {
        const s = sentenceFromLessonText(pick);
        if (s) return s;
      }
    }
    if (block.block_type === "video") {
      const desc = typeof c.description === "string" ? c.description : "";
      const title = typeof c.title === "string" ? c.title : "";
      const pick = desc.trim() || title.trim();
      if (pick) {
        const s = sentenceFromLessonText(pick);
        if (s) return s;
      }
    }
    if (block.block_type === "list" && Array.isArray(c.items)) {
      const first = c.items.find(
        (x): x is string => typeof x === "string" && x.trim().length > 0
      );
      if (first) {
        const s = sentenceFromLessonText(first);
        if (s) return s;
      }
    }
  }
  return null;
}

function fallbackTeaser(lessonTitle: string, estimatedMinutes?: number | null): string {
  if (estimatedMinutes && estimatedMinutes > 0) {
    return `Casharkan “${lessonTitle}” wuxuu qiyaastii qaadanayaa ${estimatedMinutes} daqiiqo — fur akoon si aad u bilowdo.`;
  }
  return `Casharkan “${lessonTitle}” waa qayb ka mid ah koorsada — fur akoon si aad u bilowdo barashada.`;
}

export async function fetchLessonWallPreview(lessonId: string): Promise<LessonWallPreviewData | null> {
  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const lessonRes = await fetch(`${base}/api/lms/lessons/${lessonId}/`);
  if (!lessonRes.ok) return null;
  const lesson = (await lessonRes.json()) as LessonWallPreviewApiLesson;
  if (!lesson?.title || lesson.course == null) return null;

  const courseRes = await fetch(`${base}/api/lms/courses/${lesson.course}/`);
  const courseJson = courseRes.ok ? ((await courseRes.json()) as { title?: string }) : null;
  const courseTitle = courseJson?.title?.trim() || "Koorsada";

  let teaser = extractLessonTeaserFromBlocks(lesson.content_blocks);
  if (!teaser) {
    teaser = fallbackTeaser(lesson.title, lesson.estimated_time);
  }

  return {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    courseId: lesson.course,
    courseTitle,
    teaser,
  };
}
