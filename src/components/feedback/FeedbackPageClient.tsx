"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Star, CircleCheck } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import AuthService from "@/services/auth";
import {
  STUDENT_FEEDBACK_DIFFICULTY_CHOICES,
  STUDENT_FEEDBACK_LESSON_CHOICES,
  RATING_LABELS,
  lessonLabel,
} from "@/config/student-feedback";
import type { PublicStudentFeedback, StudentFeedbackMine } from "@/types/feedback";
import {
  fetchMyStudentFeedback,
  fetchPublicStudentFeedback,
  submitStudentFeedback,
  type SubmitStudentFeedbackBody,
} from "@/services/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const TEXT_MAX = 500;

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const now = Date.now();
  let diffSec = Math.round((now - then) / 1000);
  if (diffSec < 0) diffSec = 0;
  if (diffSec < 45) return "hadda";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return diffMin === 1 ? "1 daqiiqo ka hor" : `${diffMin} daqiiqo ka hor`;
  }
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) {
    return diffHr === 1 ? "1 saac ka hor" : `${diffHr} saacadood ka hor`;
  }
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) {
    return diffDay === 1 ? "1 maalin ka hor" : `${diffDay} maalmood ka hor`;
  }
  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 5) {
    return diffWeek === 1 ? "1 toddobaad ka hor" : `${diffWeek} toddobaad ka hor`;
  }
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) {
    return diffMonth === 1 ? "1 bil ka hor" : `${diffMonth} bilood ka hor`;
  }
  const diffYear = Math.floor(diffDay / 365);
  return diffYear === 1 ? "1 sano ka hor" : `${diffYear} sano ka hor`;
}

function applyMineRecord(record: StudentFeedbackMine) {
  return {
    rating: record.rating,
    difficulty: record.difficulty,
    whatHelped: record.what_helped,
    whatConfused: record.what_confused,
    wantMoreOf: record.want_more_of,
    isPublic: record.is_public,
  };
}

function emptyFormFields() {
  return {
    rating: 0,
    difficulty: "",
    whatHelped: "",
    whatConfused: "",
    wantMoreOf: "",
    isPublic: false,
  };
}

function formatSubmitError(data: unknown): string {
  if (data === null || typeof data !== "object") {
    return "Waxbaa qaldmay. Mar kale isku day.";
  }
  const entries = Object.entries(data as Record<string, unknown>);
  const parts: string[] = [];
  for (const [key, val] of entries) {
    if (Array.isArray(val) && val.every((v) => typeof v === "string")) {
      parts.push(`${key}: ${val.join(", ")}`);
    } else if (typeof val === "string") {
      parts.push(`${key}: ${val}`);
    }
  }
  return parts.length > 0 ? parts.join(" ") : "Waxbaa qaldmay. Mar kale isku day.";
}

export function FeedbackPageClient() {
  const { user } = useAuthStore();

  const [publicItems, setPublicItems] = useState<PublicStudentFeedback[]>([]);
  const [publicLoading, setPublicLoading] = useState(true);
  const [publicError, setPublicError] = useState<string | null>(null);

  const [mine, setMine] = useState<StudentFeedbackMine[]>([]);
  const [mineLoading, setMineLoading] = useState(false);

  const [lesson, setLesson] = useState("");
  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState("");
  const [whatHelped, setWhatHelped] = useState("");
  const [whatConfused, setWhatConfused] = useState("");
  const [wantMoreOf, setWantMoreOf] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [guestFirstName, setGuestFirstName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSubmitWasUpdate, setLastSubmitWasUpdate] = useState(false);

  const mineByLesson = useMemo(() => {
    const m = new Map<string, StudentFeedbackMine>();
    for (const row of mine) {
      m.set(row.lesson, row);
    }
    return m;
  }, [mine]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPublicLoading(true);
      setPublicError(null);
      try {
        const rows = await fetchPublicStudentFeedback();
        if (!cancelled) setPublicItems(rows);
      } catch {
        if (!cancelled) setPublicError("Guddiga dadweynaha lama soo gelin karo.");
      } finally {
        if (!cancelled) setPublicLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadMine = useCallback(async () => {
    const token = AuthService.getInstance().getToken();
    if (!token) {
      setMine([]);
      return;
    }
    setMineLoading(true);
    try {
      const rows = await fetchMyStudentFeedback(token);
      setMine(rows);
    } catch {
      setMine([]);
    } finally {
      setMineLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setMine([]);
      return;
    }
    void loadMine();
  }, [user, loadMine]);

  useEffect(() => {
    if (!lesson) {
      const empty = emptyFormFields();
      setRating(empty.rating);
      setDifficulty(empty.difficulty);
      setWhatHelped(empty.whatHelped);
      setWhatConfused(empty.whatConfused);
      setWantMoreOf(empty.wantMoreOf);
      setIsPublic(empty.isPublic);
      return;
    }
    const record = mineByLesson.get(lesson);
    if (record) {
      const f = applyMineRecord(record);
      setRating(f.rating);
      setDifficulty(f.difficulty);
      setWhatHelped(f.whatHelped);
      setWhatConfused(f.whatConfused);
      setWantMoreOf(f.wantMoreOf);
      setIsPublic(f.isPublic);
    } else {
      const empty = emptyFormFields();
      setRating(empty.rating);
      setDifficulty(empty.difficulty);
      setWhatHelped(empty.whatHelped);
      setWhatConfused(empty.whatConfused);
      setWantMoreOf(empty.wantMoreOf);
      setIsPublic(empty.isPublic);
    }
  }, [lesson, mineByLesson]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!lesson) {
      setSubmitError("Fadlan dooro cashar.");
      return;
    }
    if (rating < 1 || rating > 5) {
      setSubmitError("Fadlan dooro qiimeynta xiddigaha.");
      return;
    }
    if (!difficulty) {
      setSubmitError("Fadlan dooro sida dhibaatada casharka kuugu muuqatay.");
      return;
    }

    const token = user ? AuthService.getInstance().getToken() : null;
    if (user && !token) {
      setSubmitError("Fadhigu wuu dhamaaday. Fadlan mar kale soo gal.");
      return;
    }

    const base = {
      lesson,
      rating,
      difficulty,
      what_helped: whatHelped.slice(0, TEXT_MAX),
      what_confused: whatConfused.slice(0, TEXT_MAX),
      want_more_of: wantMoreOf.slice(0, TEXT_MAX),
      is_public: isPublic,
    };

    let body: SubmitStudentFeedbackBody;
    if (user && token) {
      body = base;
    } else {
      const ge = guestEmail.trim();
      const gf = guestFirstName.trim();
      if (!gf) {
        setSubmitError("Fadlan geli magaca koowaad.");
        return;
      }
      if (!ge) {
        setSubmitError("Fadlan geli email-ka.");
        return;
      }
      body = { ...base, guest_email: ge, guest_first_name: gf };
    }

    setSubmitting(true);
    try {
      const { status, ok, data } = await submitStudentFeedback(body, user ? token : null);
      if (!ok) {
        setSubmitError(formatSubmitError(data));
        return;
      }
      setLastSubmitWasUpdate(status === 200);
      setShowSuccess(true);
      if (user) {
        await loadMine();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAgain = () => {
    setShowSuccess(false);
    if (user) {
      void loadMine();
    }
  };

  return (
    <div className="dark min-h-screen bg-background pt-14 text-white md:pt-16">
      <section className="py-24 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-4xl font-bold text-white md:text-5xl">Garaad Transparent</h1>
          <div className="mx-auto mt-6 h-px w-16 bg-primary/60" />
          <p className="mt-4 text-base text-white/50">
            Aragtida dhabta ah ee ardayda. Ma jiro shaandheyn. Waxba lagama beddelin. Waxaan u baahinaynaa si aad u
            ogaato nuxurka rasmiga ah ee aad qorayso.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16">
        <div className="mx-auto max-w-xl">
          <h2 className="text-center font-serif text-2xl font-bold text-white md:text-3xl">Reeb Aragtidaada</h2>
          <p className="mt-2 text-center text-sm text-white/50">2 daqiiqo uun. Waxay caawinaysaa ardayga xiga.</p>
          <p className="mx-auto mt-2 max-w-md text-center text-xs text-white/40">
            Looma baahna inaad soo gashid (Sign-in). Haddii aad akoon leedahay, ra&apos;yigaaga si toos ah ayaan ugu
            xiri doonaa profile-kaaga.
          </p>

          <div className="mt-10">
            {showSuccess ? (
              <div className="flex flex-col items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-8 text-center">
                <CircleCheck className="h-12 w-12 text-primary" aria-hidden />
                <p className="text-lg font-semibold text-white">Shukran — mahadsanid.</p>
                <p className="text-sm text-white/70">
                  {lastSubmitWasUpdate
                    ? "Ra&apos;yigaaga waa la cusbooneysiiyay."
                    : "Ra&apos;yigaaga waa la gudbiyay."}
                </p>
                <button
                  type="button"
                  onClick={handleEditAgain}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Dib u habee aragtidaada
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {!user && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="guest-first-name" className="text-white">
                        Magaca koowaad:
                      </Label>
                      <Input
                        id="guest-first-name"
                        type="text"
                        autoComplete="given-name"
                        value={guestFirstName}
                        onChange={(ev) => setGuestFirstName(ev.target.value.slice(0, 100))}
                        placeholder="Tusaale: Aamina"
                        className="border-white/15 bg-background text-white placeholder:text-white/35"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guest-email" className="text-white">
                        Email-ka:
                      </Label>
                      <Input
                        id="guest-email"
                        type="email"
                        autoComplete="email"
                        value={guestEmail}
                        onChange={(ev) => setGuestEmail(ev.target.value.slice(0, 254))}
                        placeholder="you@example.com"
                        className="border-white/15 bg-background text-white placeholder:text-white/35"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="feedback-lesson" className="text-white">
                    Casharkee ayaad dib-u-eegis ku samaynaysaa?
                  </Label>
                  <Select
                    value={lesson || undefined}
                    onValueChange={setLesson}
                    disabled={Boolean(user) && mineLoading}
                  >
                    <SelectTrigger id="feedback-lesson" className="border-white/15 bg-background text-white">
                      <SelectValue placeholder="Dooro cashar" />
                    </SelectTrigger>
                    <SelectContent>
                      {STUDENT_FEEDBACK_LESSON_CHOICES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Qiimeynta guud</Label>
                  <div className="flex flex-wrap items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        className="rounded p-1 transition-opacity hover:opacity-90"
                        aria-label={`Qiime ${n} ka mid ah 5`}
                        aria-pressed={rating === n}
                      >
                        <Star
                          className={cn(
                            "h-8 w-8",
                            n <= rating ? "fill-primary text-primary" : "text-white/25"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  {rating >= 1 && rating <= 5 && (
                    <p className="text-sm text-white/60">{RATING_LABELS[rating]}</p>
                  )}
                </div>

                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium text-white">
                    Sidee kuugu muuqatay dhibaatada casharku?
                  </legend>
                  <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-6">
                    {STUDENT_FEEDBACK_DIFFICULTY_CHOICES.map((c) => (
                      <label
                        key={c.value}
                        className="flex cursor-pointer items-center gap-2 text-sm text-white/80"
                      >
                        <input
                          type="radio"
                          name="difficulty"
                          value={c.value}
                          checked={difficulty === c.value}
                          onChange={() => setDifficulty(c.value)}
                          className="h-4 w-4 accent-primary"
                        />
                        {c.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="space-y-2">
                  <Label htmlFor="what-helped" className="text-white">
                    Maxaa kuugu caawin badnaa?
                  </Label>
                  <Textarea
                    id="what-helped"
                    value={whatHelped}
                    onChange={(ev) => setWhatHelped(ev.target.value.slice(0, TEXT_MAX))}
                    placeholder="Tusaale: Muuqaalka tooska ah, mashruuca, habka loo sharaxay..."
                    maxLength={TEXT_MAX}
                    rows={4}
                    className="border-white/15 bg-background text-white placeholder:text-white/35"
                  />
                  <p className="text-right text-xs text-white/40">
                    {whatHelped.length} / {TEXT_MAX}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="what-confused" className="text-white">
                    Maxaa wareer kugu riday?
                  </Label>
                  <Textarea
                    id="what-confused"
                    value={whatConfused}
                    onChange={(ev) => setWhatConfused(ev.target.value.slice(0, TEXT_MAX))}
                    placeholder="Tusaale: Waan lumay markii aan ku darnay..."
                    maxLength={TEXT_MAX}
                    rows={4}
                    className="border-white/15 bg-background text-white placeholder:text-white/35"
                  />
                  <p className="text-right text-xs text-white/40">
                    {whatConfused.length} / {TEXT_MAX}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="want-more" className="text-white">
                    Maxaad u baahan tahay in la kordhiyo?
                  </Label>
                  <Textarea
                    id="want-more"
                    value={wantMoreOf}
                    onChange={(ev) => setWantMoreOf(ev.target.value.slice(0, TEXT_MAX))}
                    placeholder="Tusaale: Mashruuco badan, gaabis, sharaxaad dheeraad ah..."
                    maxLength={TEXT_MAX}
                    rows={4}
                    className="border-white/15 bg-background text-white placeholder:text-white/35"
                  />
                  <p className="text-right text-xs text-white/40">
                    {wantMoreOf.length} / {TEXT_MAX}
                  </p>
                </div>

                <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="feedback-public" className="text-white">
                      Ku muuji ra&apos;yigayga guddiga dadweynaha (Public wall)
                    </Label>
                    <p className="text-xs text-white/45">
                      Kaliya magacaaga koowaad iyo casharka aad qaadatay ayaa lala daabici doonaa ra&apos;yigaaga.
                    </p>
                  </div>
                  <Switch id="feedback-public" checked={isPublic} onCheckedChange={setIsPublic} />
                </div>

                {submitError && <p className="text-sm text-red-400">{submitError}</p>}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {submitting ? "Waa la gudbinayaa…" : "Gudbi Aragtidaada →"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-serif text-2xl font-bold text-white md:text-3xl">Maxay Ardaydu Odhanayaan?</h2>
          <p className="mt-2 text-center text-sm text-white/50">Waxaa lagu baahiyay ogolaansho.</p>

          <div className="mt-10">
            {publicLoading ? (
              <p className="text-center text-sm text-white/40">Waa la soo gelinayaa…</p>
            ) : publicError ? (
              <p className="text-center text-sm text-red-400">{publicError}</p>
            ) : publicItems.length === 0 ? (
              <p className="text-center text-sm text-white/45">
                Wali ma jiro ra&apos;yo dadweyne. Noqo kii ugu horreeya ee wadaagaya.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {publicItems.map((item, idx) => (
                  <li
                    key={`${item.lesson}-${item.submitted_at}-${idx}`}
                    className="rounded-lg border border-white/8 bg-white/5 p-5"
                  >
                    <p className="text-sm text-white/60">
                      {item.first_name} · {lessonLabel(item.lesson)}
                    </p>
                    <div className="mt-2 flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={cn(
                            "h-4 w-4",
                            n <= item.rating ? "fill-primary text-primary" : "text-white/20"
                          )}
                          aria-hidden
                        />
                      ))}
                    </div>
                    {item.what_helped.trim() !== "" && (
                      <p className="mt-2 line-clamp-4 text-sm text-white/80">{item.what_helped}</p>
                    )}
                    <p className="mt-3 text-xs text-white/30">{formatRelativeTime(item.submitted_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
