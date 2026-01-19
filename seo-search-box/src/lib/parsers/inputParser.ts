/**
 * Smart Input Parser
 *
 * Automatically detects the type of input (keyword, URL, phone, business name)
 * and extracts/normalizes relevant data.
 */

export type InputType = "keyword" | "url" | "phone" | "business";

export interface ParsedInput {
  type: InputType;
  value: string;
  normalized: string;
  confidence: number;
  metadata: {
    domain?: string;
    protocol?: string;
    path?: string;
    phoneFormatted?: string;
    countryCode?: string;
  };
}

// URL patterns
const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
const DOMAIN_REGEX = /^([\da-z][\da-z\-]*[\da-z]*\.)+[a-z]{2,}$/i;

// Phone patterns (supports various formats)
const PHONE_PATTERNS = [
  /^\+?1?\s*\(?(\d{3})\)?[\s.-]*(\d{3})[\s.-]*(\d{4})$/, // US: (555) 123-4567, 555-123-4567
  /^\+?(\d{1,3})[\s.-]?\(?(\d{2,4})\)?[\s.-]?(\d{3,4})[\s.-]?(\d{3,4})$/, // International
  /^(\d{10,11})$/, // Plain digits
];

// Business name indicators (helps distinguish from keywords)
const BUSINESS_INDICATORS = [
  /\b(inc|llc|ltd|corp|co|company|group|services|solutions|consulting)\b/i,
  /\b(restaurant|cafe|hotel|store|shop|market|salon|clinic|hospital)\b/i,
  /\b(law\s+firm|dental|medical|auto|car\s+dealer|real\s+estate)\b/i,
];

/**
 * Parse and detect input type
 */
export function parseInput(input: string): ParsedInput {
  const trimmed = input.trim();

  // Check for URL first
  const urlResult = detectUrl(trimmed);
  if (urlResult) return urlResult;

  // Check for phone number
  const phoneResult = detectPhone(trimmed);
  if (phoneResult) return phoneResult;

  // Check for business name indicators
  const businessResult = detectBusiness(trimmed);
  if (businessResult) return businessResult;

  // Default to keyword
  return {
    type: "keyword",
    value: trimmed,
    normalized: normalizeKeyword(trimmed),
    confidence: 0.8,
    metadata: {},
  };
}

/**
 * Detect and parse URL input
 */
function detectUrl(input: string): ParsedInput | null {
  // Check for full URL
  if (URL_REGEX.test(input)) {
    const url = parseUrl(input);
    if (url) {
      return {
        type: "url",
        value: input,
        normalized: url.domain,
        confidence: 0.95,
        metadata: {
          domain: url.domain,
          protocol: url.protocol,
          path: url.path,
        },
      };
    }
  }

  // Check for domain without protocol
  if (DOMAIN_REGEX.test(input) && !input.includes(" ")) {
    return {
      type: "url",
      value: input,
      normalized: input.toLowerCase(),
      confidence: 0.9,
      metadata: {
        domain: input.toLowerCase(),
      },
    };
  }

  return null;
}

/**
 * Parse URL components
 */
function parseUrl(input: string): { domain: string; protocol: string; path: string } | null {
  try {
    // Add protocol if missing
    let urlString = input;
    if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
      urlString = "https://" + urlString;
    }

    const url = new URL(urlString);
    return {
      domain: url.hostname.replace(/^www\./, ""),
      protocol: url.protocol.replace(":", ""),
      path: url.pathname,
    };
  } catch {
    return null;
  }
}

/**
 * Detect and parse phone number input
 */
function detectPhone(input: string): ParsedInput | null {
  // Remove common separators for checking
  const cleaned = input.replace(/[\s\-\.\(\)]/g, "");

  // Check if it looks like a phone number (mostly digits)
  const digitCount = (cleaned.match(/\d/g) || []).length;
  const totalLength = cleaned.replace(/^\+/, "").length;

  if (digitCount >= 10 && digitCount <= 15 && digitCount / totalLength > 0.9) {
    for (const pattern of PHONE_PATTERNS) {
      if (pattern.test(input)) {
        const formatted = formatPhoneNumber(input);
        return {
          type: "phone",
          value: input,
          normalized: cleaned.replace(/^\+?1/, ""), // Normalize to 10 digits for US
          confidence: 0.95,
          metadata: {
            phoneFormatted: formatted,
            countryCode: cleaned.startsWith("+") ? cleaned.match(/^\+(\d{1,3})/)?.[1] : "1",
          },
        };
      }
    }

    // Even if pattern doesn't match exactly, if it's mostly digits, treat as phone
    if (digitCount >= 10) {
      return {
        type: "phone",
        value: input,
        normalized: cleaned,
        confidence: 0.7,
        metadata: {
          phoneFormatted: input,
        },
      };
    }
  }

  return null;
}

/**
 * Format phone number to standard format
 */
function formatPhoneNumber(input: string): string {
  const cleaned = input.replace(/\D/g, "");

  // US phone number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return input;
}

/**
 * Detect business name
 */
function detectBusiness(input: string): ParsedInput | null {
  // Check for business indicators
  for (const pattern of BUSINESS_INDICATORS) {
    if (pattern.test(input)) {
      return {
        type: "business",
        value: input,
        normalized: normalizeBusinessName(input),
        confidence: 0.85,
        metadata: {},
      };
    }
  }

  // Check for title case (common in business names)
  const words = input.split(/\s+/);
  if (words.length >= 2 && words.length <= 6) {
    const titleCaseWords = words.filter((w) => /^[A-Z][a-z]*$/.test(w));
    if (titleCaseWords.length >= words.length * 0.6) {
      return {
        type: "business",
        value: input,
        normalized: normalizeBusinessName(input),
        confidence: 0.6,
        metadata: {},
      };
    }
  }

  return null;
}

/**
 * Normalize keyword for search
 */
function normalizeKeyword(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalize business name
 */
function normalizeBusinessName(name: string): string {
  return name
    .replace(/[^\w\s&'-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string | null {
  const parsed = parseUrl(url);
  return parsed?.domain || null;
}

/**
 * Check if input is a valid domain
 */
export function isValidDomain(input: string): boolean {
  return DOMAIN_REGEX.test(input);
}

/**
 * Check if input is a valid URL
 */
export function isValidUrl(input: string): boolean {
  return URL_REGEX.test(input);
}

/**
 * Get suggested input type (for UI hints)
 */
export function getSuggestedType(partialInput: string): InputType | null {
  if (!partialInput || partialInput.length < 3) return null;

  const parsed = parseInput(partialInput);
  if (parsed.confidence >= 0.7) {
    return parsed.type;
  }

  return null;
}
