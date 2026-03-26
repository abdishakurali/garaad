/**
 * Country dial codes for WhatsApp onboarding/profile (order: priority, then alphabetical).
 * Must stay in sync with backend `accounts/whatsapp_phone.py` DIAL_TO_REGION keys.
 */
export const DEFAULT_WHATSAPP_DIAL = "+252";

export const WHATSAPP_DIAL_OPTIONS: { dial: string; label: string }[] = [
  { dial: "+252", label: "Somalia" },
  { dial: "+254", label: "Kenya" },
  { dial: "+251", label: "Ethiopia" },
  { dial: "+44", label: "United Kingdom" },
  { dial: "+1", label: "United States" },
  { dial: "+971", label: "United Arab Emirates" },
  { dial: "+256", label: "Uganda" },
  { dial: "+255", label: "Tanzania" },
  { dial: "+249", label: "Sudan" },
  { dial: "+20", label: "Egypt" },
  { dial: "+91", label: "India" },
  { dial: "+33", label: "France" },
  { dial: "+49", label: "Germany" },
  { dial: "+34", label: "Spain" },
  { dial: "+39", label: "Italy" },
  { dial: "+86", label: "China" },
  { dial: "+81", label: "Japan" },
  { dial: "+61", label: "Australia" },
  { dial: "+27", label: "South Africa" },
  { dial: "+966", label: "Saudi Arabia" },
  { dial: "+974", label: "Qatar" },
  { dial: "+965", label: "Kuwait" },
  { dial: "+973", label: "Bahrain" },
  { dial: "+968", label: "Oman" },
];

const DIALS_SORTED = [...WHATSAPP_DIAL_OPTIONS.map((o) => o.dial)].sort(
  (a, b) => b.length - a.length
);

/** Strip spaces, dashes, parentheses for display/submit handling */
export function stripPhoneSeparators(value: string): string {
  return value.replace(/[\s().-]/g, "");
}

/**
 * Split stored E.164 (+25261…) into dial + national digits for the form.
 */
export function splitWhatsappE164(e164: string | undefined | null): {
  dial: string;
  local: string;
} {
  const s = stripPhoneSeparators(e164 || "").replace(/^\+/, "+");
  if (!s || s === "+") {
    return { dial: DEFAULT_WHATSAPP_DIAL, local: "" };
  }
  const withPlus = s.startsWith("+") ? s : `+${s}`;
  for (const dial of DIALS_SORTED) {
    if (withPlus.startsWith(dial)) {
      return {
        dial,
        local: withPlus.slice(dial.length).replace(/^0+/, "") || "",
      };
    }
  }
  return { dial: DEFAULT_WHATSAPP_DIAL, local: withPlus.replace(/^\+/, "") };
}

/** Build full international string for API; empty if no local digits */
export function buildWhatsappE164(dial: string, localRaw: string): string {
  const local = stripPhoneSeparators(localRaw).replace(/\D/g, "").replace(/^0+/, "");
  if (!local) return "";
  const d = dial || DEFAULT_WHATSAPP_DIAL;
  return `${d}${local}`;
}
