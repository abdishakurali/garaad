import { API_BASE_URL } from "@/lib/constants";
import AuthService from "@/services/auth";

export async function reportLessonVideoError(params: {
  lessonId: number;
  errorType: string;
  timestamp?: string;
  videoUrl?: string;
}): Promise<void> {
  const auth = AuthService.getInstance();
  const token = auth.getToken();
  const user = auth.getCurrentUser();
  const body: Record<string, unknown> = {
    lesson_id: params.lessonId,
    error_type: params.errorType,
    timestamp: params.timestamp ?? new Date().toISOString(),
  };
  if (user?.id != null) body.user_id = user.id;
  if (params.videoUrl) body.video_url = params.videoUrl;
  try {
    const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    await fetch(`${base}/api/lms/lessons/video-error/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
  } catch {
    /* non-blocking */
  }
}
