// Email validation utility for preventing fake users
export class EmailValidator {
  // Common fake/disposable email domains that should be blocked
  private static readonly FAKE_DOMAINS = [
    // Disposable email services
    "10minutemail.com",
    "tempmail.org",
    "guerrillamail.com",
    "mailinator.com",
    "temp-mail.org",
    "throwaway.email",
    "yopmail.com",
    "maildrop.cc",
    "getnada.com",
    "emailnator.com",
    "mohmal.com",
    "fakeinbox.com",
    "dispostable.com",
    "trashmail.com",
    "sharklasers.com",
    "grr.la",
    "guerrillamailblock.com",
    "pokemail.net",
    "spam4.me",
    "tempail.com",
    "tmpeml.com",
    "mailtemp.info",
    "mytemp.email",
    "temp-mail.io",
    "emaildrop.io",
    "mailbox.in.ua",
    "mailcatch.com",
    "mailhazard.com",
    "mailme.lv",
    "mt2014.com",
    "mt2015.com",
    "suremail.info",
    "tmail.ws",
    "anonymbox.com",
    "emailto.de",
    "fake-box.com",
    "fakemailgenerator.com",
    "incognitomail.org",
    "jetable.org",
    "mailexpire.com",
    "mailfreeonline.com",
    "mailin8r.com",
    "mailismagic.com",
    "noclickemail.com",
    "quickinbox.com",
    "spambox.us",
    "tempinbox.com",
    "tempmailaddress.com",
    "tempsky.com",
    "thankyou2010.com",
    "whatpapad.com",
    "willhackforfood.biz",
    "mail-temporaire.fr",
    "mytrashmail.com",
    "spamgourmet.com",
    "trash-mail.com",
    "emailfake.com",
    "fakermail.com",
    "fakemail.net",
    "tempemailaddress.com",
    "tempe-mail.com",
    "throwawayemailaddress.com",
    "throwawaymail.com",
    "temporary-mail.net",
    "tempmail.net",
    "inboxalias.com",
    "smashmail.de",
    "boun.cr",
    "mailsac.com",
    "minuteinbox.com",
    "temp-mail.ru",
    "inboxbear.com",
    "drdrb.com",
    "brefmail.com",
    "correotemporal.org",
    "fastmail.fm",
    "fastmail.com",
    "infocom.zp.ua",
    "koszmail.pl",
    "kurzepost.de",
    "objectmail.com",
    "proxymail.eu",
    "rcpt.at",
    "schafmail.de",
    "spamfree24.org",
    "tagyourself.com",
    "tempemail.com",
    "uroid.com",
    "webemail.me",
    "wegwerfmail.de",
    "email60.com",
    "emailias.com",
    "emailinfive.com",
    "emailwarden.com",
    "gawab.com",
    "mailtothis.com",
    "mintemail.com",
    "temporaryemail.us",
    "trbvm.com",
    "c.hcv.vv",
    "dodgeit.com",
    "mail.by",
    "mailmetrash.com",
    "no-spam.ws",
    "nospam.ze.tc",
    "nospamfor.us",
    "now.im",
    "rppkn.com",
    "spamherald.com",
    "spamspot.com",
    "tempmail.de",
    "thrma.com",
    "tyldd.com",
    "vomoto.com",
    "zoidmail.com",
    // Add more as needed
  ];

  // Common valid email domains (major providers)
  private static readonly TRUSTED_DOMAINS = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "aol.com",
    "icloud.com",
    "me.com",
    "protonmail.com",
    "proton.me",
    "zoho.com",
    "mail.com",
    "gmx.com",
    "yandex.com",
    "live.com",
    "msn.com",
    "yahoo.co.uk",
    "yahoo.ca",
    "yahoo.com.au",
    "yahoo.fr",
    "yahoo.de",
    "yahoo.es",
    "yahoo.it",
    "yahoo.co.jp",
    "googlemail.com",
    "edu", // Educational institutions
    "gov", // Government
    "org", // Organizations
    "mil", // Military
  ];

  // Enhanced email regex that's more strict
  private static readonly EMAIL_REGEX =
    /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;

  // Check if email format is valid
  static isValidFormat(email: string): boolean {
    if (!email || typeof email !== "string") return false;

    // Remove whitespace
    const cleanEmail = email.trim().toLowerCase();

    // Check basic format
    if (!this.EMAIL_REGEX.test(cleanEmail)) return false;

    // Additional checks
    if (cleanEmail.length > 254) return false; // RFC 5321 limit
    if (cleanEmail.indexOf("@") === -1) return false;

    const [localPart, domain] = cleanEmail.split("@");

    // Check local part (before @)
    if (localPart.length === 0 || localPart.length > 64) return false;
    if (localPart.startsWith(".") || localPart.endsWith(".")) return false;
    if (localPart.includes("..")) return false;

    // Check domain part
    if (domain.length === 0 || domain.length > 253) return false;
    if (domain.startsWith(".") || domain.endsWith(".")) return false;
    if (domain.includes("..")) return false;
    if (domain.startsWith("-") || domain.endsWith("-")) return false;

    return true;
  }

  // Check if email domain is fake/disposable
  static isFakeDomain(email: string): boolean {
    if (!email || typeof email !== "string") return true;

    const cleanEmail = email.trim().toLowerCase();
    const domain = cleanEmail.split("@")[1];

    if (!domain) return true;

    return this.FAKE_DOMAINS.includes(domain);
  }

  // Check if email domain is trusted
  static isTrustedDomain(email: string): boolean {
    if (!email || typeof email !== "string") return false;

    const cleanEmail = email.trim().toLowerCase();
    const domain = cleanEmail.split("@")[1];

    if (!domain) return false;

    // Check if it's a trusted domain
    if (this.TRUSTED_DOMAINS.includes(domain)) return true;

    // Check if it ends with trusted TLD
    return this.TRUSTED_DOMAINS.some(
      (trustedDomain) =>
        trustedDomain.startsWith(".") && domain.endsWith(trustedDomain)
    );
  }

  // Check if email looks suspicious (patterns often used by fake accounts)
  static isSuspiciousPattern(email: string): boolean {
    if (!email || typeof email !== "string") return true;

    const cleanEmail = email.trim().toLowerCase();
    const [localPart] = cleanEmail.split("@");

    if (!localPart) return true;

    // Check for suspicious patterns - made more reasonable
    const suspiciousPatterns = [
      /^\d+$/, // Only numbers
      /^test\d+$/i, // Starts with "test" followed by numbers
      /^fake\d*$/i, // Starts with "fake" with optional numbers
      /^temp\d*$/i, // Starts with "temp" with optional numbers
      /^spam\d*$/i, // Starts with "spam" with optional numbers
      /^noreply$/i, // Exact "noreply"
      /^no-reply$/i, // Exact "no-reply"
      /^admin\d*$/i, // Starts with "admin" with optional numbers
      /^support\d*$/i, // Starts with "support" with optional numbers
      /^info\d*$/i, // Starts with "info" with optional numbers
      /^webmaster$/i, // Exact "webmaster"
      /^[a-z]{1,2}$/i, // Too short (1-2 characters)
      /^[a-z]{35,}$/i, // Too long (35+ characters)
      /^[a-z]+[0-9]{10,}$/i, // Letters followed by 10+ numbers (very long numbers are suspicious)
      /^[0-9]{10,}[a-z]*$/i, // 10+ numbers followed by letters (very long numbers are suspicious)
      /^(test|fake|temp|spam|admin|support|info|webmaster|noreply|no-reply)\d*$/i, // Common suspicious words
    ];

    return suspiciousPatterns.some((pattern) => pattern.test(localPart));
  }

  // Check if email has proper structure and realistic appearance
  static looksRealistic(email: string): boolean {
    if (!email || typeof email !== "string") return false;

    const cleanEmail = email.trim().toLowerCase();
    const [localPart, domain] = cleanEmail.split("@");

    if (!localPart || !domain) return false;

    // Check for realistic local part length
    if (localPart.length < 2 || localPart.length > 30) return false;

    // Check for realistic domain structure
    const domainParts = domain.split(".");
    if (domainParts.length < 2) return false;

    // Check each domain part
    for (const part of domainParts) {
      if (part.length === 0 || part.length > 63) return false;
      if (part.startsWith("-") || part.endsWith("-")) return false;
    }

    return true;
  }

  // Main validation function
  static validateEmail(email: string): {
    isValid: boolean;
    error?: string;
    reason?: string;
  } {
    if (!email || typeof email !== "string") {
      return {
        isValid: false,
        error: "Fadlan geli emailkaaga",
        reason: "Email is required",
      };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check basic format
    if (!this.isValidFormat(cleanEmail)) {
      return {
        isValid: false,
        error: "Fadlan geli email sax ah",
        reason: "Invalid email format",
      };
    }

    // Check if domain is fake/disposable
    if (this.isFakeDomain(cleanEmail)) {
      return {
        isValid: false,
        error: "Fadlan isticmaal email dhabta ah, maaha mid ku meel gaar ah",
        reason: "Disposable email domain detected",
      };
    }

    // Check if it looks realistic first
    if (!this.looksRealistic(cleanEmail)) {
      return {
        isValid: false,
        error: "Fadlan geli email sax ah",
        reason: "Email does not look realistic",
      };
    }

    // If it's from a trusted domain, be more lenient with pattern checks
    if (this.isTrustedDomain(cleanEmail)) {
      // Only check for very obvious suspicious patterns for trusted domains
      const cleanEmailLC = cleanEmail.trim().toLowerCase();
      const [localPart] = cleanEmailLC.split("@");

      if (localPart) {
        // Only block very obvious suspicious patterns from trusted domains
        const veryObviousPatterns = [
          /^(test|fake|temp|spam|noreply|no-reply|webmaster)\d*$/i,
          /^[a-z]{1}$/i, // Single character
          /^[a-z]{40,}$/i, // Extremely long (40+ characters)
          /^\d+$/i, // Only numbers
        ];

        if (veryObviousPatterns.some((pattern) => pattern.test(localPart))) {
          return {
            isValid: false,
            error:
              "Emailkan wuxuu u eegayaa mid been ah. Fadlan isticmaal email dhabta ah",
            reason: "Suspicious email pattern detected",
          };
        }
      }
    } else {
      // For non-trusted domains, apply full suspicious pattern checks
      if (this.isSuspiciousPattern(cleanEmail)) {
        return {
          isValid: false,
          error:
            "Emailkan wuxuu u eegayaa mid been ah. Fadlan isticmaal email dhabta ah",
          reason: "Suspicious email pattern detected",
        };
      }
    }

    return {
      isValid: true,
    };
  }
}

// Helper function for easy usage
export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
  reason?: string;
} {
  return EmailValidator.validateEmail(email);
}

// Export default for convenience
export default EmailValidator;
