"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApi as api } from "@/lib/admin-api";
import {
  faqAdminApi,
  type FaqEntryAdmin,
  type FaqPlacement,
} from "@/lib/admin-faq";
import {
  Search,
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

interface StudentQuestion {
  id: number;
  text: string;
  author: {
    username: string;
  };
  created_at: string;
  is_answered: boolean;
}

const PLACEMENT_LABELS: Record<FaqPlacement, string> = {
  all: "Dhammaan bogagga",
  landing: "Bogga hore",
  subscribe: "Bogga qiimaha",
};

export default function SualahaPage() {
  const [tab, setTab] = useState<"faq" | "students">("faq");

  /* ─── CMS FAQ (backend cms.FaqEntry) ─── */
  const [faqs, setFaqs] = useState<FaqEntryAdmin[]>([]);
  const [faqLoading, setFaqLoading] = useState(true);
  const [faqSearch, setFaqSearch] = useState("");
  const [editing, setEditing] = useState<FaqEntryAdmin | "new" | null>(null);

  const loadFaqs = useCallback(async () => {
    try {
      setFaqLoading(true);
      const data = await faqAdminApi.list();
      setFaqs(data);
    } catch (err) {
      console.error(err);
      toast.error("Lama soo gelin karo FAQ-ga server-ka. Hubi inaad superuser tahay.");
    } finally {
      setFaqLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "faq") loadFaqs();
  }, [tab, loadFaqs]);

  const saveFaq = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const question = String(fd.get("question") || "").trim();
    const answer = String(fd.get("answer") || "").trim();
    const placement = String(fd.get("placement") || "all") as FaqPlacement;
    const sort_order = Number(fd.get("sort_order") || 0);
    const is_published = fd.get("is_published") === "on";

    if (!question || !answer) {
      toast.error("Su'aal iyo jawaab waa lagama maarmaan");
      return;
    }

    try {
      if (editing === "new") {
        await faqAdminApi.create({
          question,
          answer,
          placement,
          sort_order,
          is_published,
        });
        toast.success("Su'aal cusub waa la kaydiyay");
      } else if (editing && typeof editing === "object") {
        await faqAdminApi.update(editing.id, {
          question,
          answer,
          placement,
          sort_order,
          is_published,
        });
        toast.success("Waa la cusbooneysiiyay");
      }
      setEditing(null);
      await loadFaqs();
    } catch (err) {
      console.error(err);
      toast.error("Kaydinta way fashilantay");
    }
  };

  const removeFaq = async (id: number) => {
    if (!confirm("Ma hubtaa inaad tirtirto su'aashan?")) return;
    try {
      await faqAdminApi.delete(id);
      toast.success("Waa la tirtiray");
      await loadFaqs();
    } catch (err) {
      console.error(err);
      toast.error("Tirtiridu way fashilantay");
    }
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  /* ─── Student questions (LMS) ─── */
  const [questions, setQuestions] = useState<StudentQuestion[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentLoading, setStudentLoading] = useState(true);

  const fetchStudentQuestions = async () => {
    try {
      setStudentLoading(true);
      const res = await api.get("lms/questions/");
      const rawData = res.data;
      const data = Array.isArray(rawData)
        ? rawData
        : rawData && Array.isArray(rawData.results)
          ? rawData.results
          : [];
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setStudentLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "students") fetchStudentQuestions();
  }, [tab]);

  const filteredStudents = questions.filter(
    (q) =>
      q.text.toLowerCase().includes(studentSearch.toLowerCase()) ||
      q.author.username.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-blue-800 bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
          Su&apos;aalaha
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Maamul FAQ-ga bogga (landing & qiimaha) iyo su&apos;aalaha ardayda.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        <button
          type="button"
          onClick={() => setTab("faq")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
            tab === "faq"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          FAQ bogga & qiimaha
        </button>
        <button
          type="button"
          onClick={() => setTab("students")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
            tab === "students"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          Su&apos;aalaha ardayda
        </button>
      </div>

      {tab === "faq" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            <div className="flex-1 relative max-w-md">
              <input
                type="text"
                placeholder="Raadi FAQ..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="button"
              onClick={() => setEditing("new")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Su&apos;aal cusub
            </button>
          </div>

          {editing !== null && (
            <form
              onSubmit={saveFaq}
              className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 space-y-4"
            >
              <h3 className="font-bold text-gray-900">
                {editing === "new" ? "Su'aal cusub" : "Wax ka beddel"}
              </h3>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Su&apos;aal
                </label>
                <input
                  name="question"
                  required
                  defaultValue={typeof editing === "object" ? editing.question : ""}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Jawaab
                </label>
                <textarea
                  name="answer"
                  required
                  rows={5}
                  defaultValue={typeof editing === "object" ? editing.answer : ""}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Meesha lagu muujiyo
                  </label>
                  <select
                    name="placement"
                    defaultValue={typeof editing === "object" ? editing.placement : "all"}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  >
                    {(Object.keys(PLACEMENT_LABELS) as FaqPlacement[]).map((k) => (
                      <option key={k} value={k}>
                        {PLACEMENT_LABELS[k]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Taxane (sort)
                  </label>
                  <input
                    name="sort_order"
                    type="number"
                    min={0}
                    defaultValue={typeof editing === "object" ? editing.sort_order : 0}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                    <input
                      name="is_published"
                      type="checkbox"
                      defaultChecked={editing === "new" ? true : editing?.is_published}
                      className="rounded border-gray-300"
                    />
                    Daabacan (published)
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Kaydi
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Jooji
                </button>
              </div>
            </form>
          )}

          {faqLoading ? (
            <div className="flex justify-center py-16 text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((f) => (
                <div
                  key={f.id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wide text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {PLACEMENT_LABELS[f.placement] ?? f.placement}
                        </span>
                        <span className="text-xs text-gray-400">#{f.sort_order}</span>
                        {f.is_published ? (
                          <span className="text-xs font-semibold text-green-600">Daabacan</span>
                        ) : (
                          <span className="text-xs font-semibold text-amber-600">Qari</span>
                        )}
                      </div>
                      <p className="font-bold text-gray-900 mb-1">{f.question}</p>
                      <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-wrap">
                        {f.answer}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditing(f)}
                        className="p-2 rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50"
                        title="Wax ka beddel"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFaq(f.id)}
                        className="p-2 rounded-lg border border-gray-200 text-red-600 hover:bg-red-50"
                        title="Tirtir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredFaqs.length === 0 && (
                <p className="text-center text-gray-400 py-12 bg-white rounded-xl border border-gray-100">
                  FAQ lama helin. Ku dar su&apos;aal cusub.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {tab === "students" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Raadi su'aal ama arday..."
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {studentLoading ? (
            <div className="text-center text-gray-500 py-12">Soo loading...</div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((question) => (
                <div
                  key={question.id}
                  className="p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-gray-900">
                          {question.author.username}
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                          question.is_answered
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {question.is_answered ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span className="font-bold text-xs uppercase tracking-wider">
                          {question.is_answered ? "Laga jawaabay" : "Jawaab sugaya"}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-800 text-lg leading-relaxed">{question.text}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(question.created_at).toLocaleDateString()}</span>
                      </div>
                      <button
                        type="button"
                        className="text-blue-600 font-bold hover:underline flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Ka jawaab
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredStudents.length === 0 && (
                <div className="text-gray-400 text-center p-12 bg-white rounded-xl border border-gray-100">
                  Su&apos;aalo lama helin.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
