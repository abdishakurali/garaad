import { API_BASE_URL } from "@/lib/constants";
import type { PublicStudentFeedback, StudentFeedbackMine } from "@/types/feedback";

const SUBMIT_URL = `${API_BASE_URL}/api/feedback/submit/`;
const PUBLIC_URL = `${API_BASE_URL}/api/feedback/public/`;
const MINE_URL = `${API_BASE_URL}/api/feedback/mine/`;

export async function fetchPublicStudentFeedback(): Promise<PublicStudentFeedback[]> {
  const res = await fetch(PUBLIC_URL, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load public feedback");
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    return [];
  }
  return data as PublicStudentFeedback[];
}

export async function fetchMyStudentFeedback(): Promise<StudentFeedbackMine[]> {
  const res = await fetch(MINE_URL, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load your feedback");
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    return [];
  }
  return data as StudentFeedbackMine[];
}

export interface SubmitStudentFeedbackBody {
  lesson: string;
  rating: number;
  difficulty: string;
  what_helped: string;
  what_confused: string;
  want_more_of: string;
  is_public: boolean;
  guest_email?: string;
  guest_first_name?: string;
}

export async function submitStudentFeedback(
  body: SubmitStudentFeedbackBody,
  _token?: string | null
): Promise<{ status: number; ok: boolean; data: unknown }> {
  const res = await fetch(SUBMIT_URL, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, ok: res.ok, data };
}
