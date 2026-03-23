/** E.164 digits only, no + (wa.me format). */
export const WHATSAPP_NUMBER = "252618995283";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Salaan! Waan rabaa inaan wax weydiiyo Garaad.";

export function whatsappHref(message: string = DEFAULT_WHATSAPP_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Human-readable display (Somalia). */
export const WHATSAPP_DISPLAY = "+252 61 899 5283";
