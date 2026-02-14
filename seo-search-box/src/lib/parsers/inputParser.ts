/**
 * Smart Input Parser
 *
 * Automatically detects the type of input (keyword, URL, phone, address, business name)
 * and extracts/normalizes relevant data.
 */

export type InputType = "keyword" | "url" | "phone" | "address" | "business";

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
    isLatLng?: boolean;
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

// Address patterns
const ADDRESS_PATTERNS = [
  // Street number + street name
  /^\d+\s+[\w\s]+\b(st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ln|lane|way|ct|court|pl|place|cir|circle|hwy|highway)\b/i,
  // With city/state
  /^\d+\s+[\w\s]+,\s*[\w\s]+,?\s*(wa|washington|ca|california|or|oregon|tx|texas|ny|new york|fl|florida|[a-z]{2})\b/i,
  // City, State pattern
  /^[\w\s]+,\s*(wa|washington|ca|california|or|oregon|tx|texas|ny|new york|fl|florida|[a-z]{2})\s*\d{0,5}$/i,
  // Zip code patterns
  /\b\d{5}(-\d{4})?\b/,
];

// Lat/lng pattern
const LATLNG_PATTERN = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/;

// Business name indicators (helps distinguish from keywords)
const BUSINESS_INDICATORS = [
  /\b(inc|llc|ltd|corp|co|company|group|services|solutions|consulting)\b/i,
  /\b(restaurant|cafe|hotel|store|shop|market|salon|clinic|hospital)\b/i,
  /\b(law\s*firm|dental|medical|auto|car\s*dealer|real\s*estate)\b/i,
  /\b(plumbing|electric|hvac|roofing|landscaping|cleaning)\b/i,
  /'s\s+/i, // Possessive: "Joe's Pizza", "Mike's Auto"
];

// Keyword indicators (things that are clearly search terms, not businesses)
const KEYWORD_INDICATORS = [
  /^(best|top|cheap|affordable|local|near\s*me|how\s+to|what\s+is)/i,
  /\b(near\s*me|in\s+my\s+area|nearby)\b/i,
  /\b(services|help|tips|guide|reviews)\s*$/i,
];

/**
 * Parse and detect input type
 */
export function parseInput(input: string): ParsedInput {
  const trimmed = input.trim();

  // Check for URL first (highest specificity)
  const urlResult = detectUrl(trimmed);
  if (urlResult) return urlResult;

  // Check for lat/lng coordinates
  const latLngResult = detectLatLng(trimmed);
  if (latLngResult) return latLngResult;

  // Check for phone number
  const phoneResult = detectPhone(trimmed);
  if (phoneResult) return phoneResult;

  // Check for address (before business, as addresses can look like titles)
  const addressResult = detectAddress(trimmed);
  if (addressResult) return addressResult;

  // Check if it's clearly a keyword/search term
  const keywordResult = detectKeyword(trimmed);
  if (keywordResult) return keywordResult;

  // Check for business name indicators
  const businessResult = detectBusiness(trimmed);
  if (businessResult) return businessResult;

  // Default to keyword for anything else
  return {
    type: "keyword",
    value: trimmed,
    normalized: normalizeKeyword(trimmed),
    confidence: 0.6,
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
 * Detect lat/lng coordinates
 */
function detectLatLng(input: string): ParsedInput | null {
  if (!LATLNG_PATTERN.test(input)) return null;

  const parts = input.split(",").map((p) => parseFloat(p.trim()));
  if (parts.length !== 2) return null;

  const [lat, lng] = parts;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return {
    type: "address",
    value: input,
    normalized: `${lat.toFixed(6)},${lng.toFixed(6)}`,
    confidence: 0.95,
    metadata: {
      isLatLng: true,
    },
  };
}

/**
 * Detect and parse phone number input
 */
function detectPhone(input: string): ParsedInput | null {
  const cleaned = input.replace(/[\s\-\.\(\)]/g, "");
  const digitCount = (cleaned.match(/\d/g) || []).length;
  const totalLength = cleaned.replace(/^\+/, "").length;

  // Must be mostly digits and right length for phone
  if (digitCount >= 10 && digitCount <= 15 && digitCount / totalLength > 0.9) {
    for (const pattern of PHONE_PATTERNS) {
      if (pattern.test(input)) {
        const formatted = formatPhoneNumber(input);
        return {
          type: "phone",
          value: input,
          normalized: cleaned.replace(/^\+?1/, ""),
          confidence: 0.95,
          metadata: {
            phoneFormatted: formatted,
            countryCode: cleaned.startsWith("+") ? cleaned.match(/^\+(\d{1,3})/)?.[1] : "1",
          },
        };
      }
    }

    // If mostly digits but doesn't match patterns exactly, still treat as phone
    if (digitCount >= 10 && totalLength <= digitCount + 2) {
      return {
        type: "phone",
        value: input,
        normalized: cleaned,
        confidence: 0.75,
        metadata: {
          phoneFormatted: formatPhoneNumber(input),
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
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return input;
}

/**
 * Detect address input
 */
function detectAddress(input: string): ParsedInput | null {
  // Check each address pattern
  for (const pattern of ADDRESS_PATTERNS) {
    if (pattern.test(input)) {
      return {
        type: "address",
        value: input,
        normalized: normalizeAddress(input),
        confidence: 0.85,
        metadata: {},
      };
    }
  }

  // Check for common address components
  const hasStreetNumber = /^\d+\s/.test(input);
  const hasStreetType = /\b(st|street|ave|avenue|rd|road|blvd|dr|drive|ln|way)\b/i.test(input);
  const hasComma = input.includes(",");
  const hasStateAbbr = /\b[A-Z]{2}\b/.test(input) || /\b(washington|california|oregon|texas)\b/i.test(input);

  // If it has multiple address-like features
  const addressScore = [hasStreetNumber, hasStreetType, hasComma, hasStateAbbr].filter(Boolean).length;
  if (addressScore >= 2) {
    return {
      type: "address",
      value: input,
      normalized: normalizeAddress(input),
      confidence: 0.7 + addressScore * 0.05,
      metadata: {},
    };
  }

  return null;
}

/**
 * Normalize address
 */
function normalizeAddress(address: string): string {
  return address
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Detect if input is clearly a keyword/search term
 */
function detectKeyword(input: string): ParsedInput | null {
  for (const pattern of KEYWORD_INDICATORS) {
    if (pattern.test(input)) {
      return {
        type: "keyword",
        value: input,
        normalized: normalizeKeyword(input),
        confidence: 0.9,
        metadata: {},
      };
    }
  }
  return null;
}

/**
 * Detect business name
 */
function detectBusiness(input: string): ParsedInput | null {
  // Check for explicit business indicators
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

  // Title case detection (but be more conservative)
  // Only match if it looks like a proper name, not just capitalized words
  const words = input.split(/\s+/);
  if (words.length >= 2 && words.length <= 4) {
    // All words start with capital, no obvious address/keyword patterns
    const allTitleCase = words.every((w) => /^[A-Z]/.test(w));
    const noNumbers = !/\d/.test(input);
    const noCommas = !input.includes(",");

    if (allTitleCase && noNumbers && noCommas) {
      return {
        type: "business",
        value: input,
        normalized: normalizeBusinessName(input),
        confidence: 0.55, // Lower confidence for just title case
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
