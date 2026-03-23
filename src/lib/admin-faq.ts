import { adminApi } from "@/lib/admin-api";

export type FaqPlacement = "all" | "landing" | "subscribe";

export interface FaqEntryAdmin {
  id: number;
  question: string;
  answer: string;
  placement: FaqPlacement;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const faqAdminApi = {
  list: async (): Promise<FaqEntryAdmin[]> => {
    const res = await adminApi.get<FaqEntryAdmin[] | { results?: FaqEntryAdmin[] }>(
      "cms/faq-entries/"
    );
    const d = res.data;
    return Array.isArray(d) ? d : d.results ?? [];
  },

  create: async (body: Partial<Pick<FaqEntryAdmin, "question" | "answer" | "placement" | "sort_order" | "is_published">>) => {
    const res = await adminApi.post<FaqEntryAdmin>("cms/faq-entries/", body);
    return res.data;
  },

  update: async (
    id: number,
    body: Partial<Pick<FaqEntryAdmin, "question" | "answer" | "placement" | "sort_order" | "is_published">>
  ) => {
    const res = await adminApi.patch<FaqEntryAdmin>(`cms/faq-entries/${id}/`, body);
    return res.data;
  },

  delete: async (id: number) => {
    await adminApi.delete(`cms/faq-entries/${id}/`);
  },
};
