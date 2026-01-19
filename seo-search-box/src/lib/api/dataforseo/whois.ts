/**
 * DataForSEO Domain Analytics API
 *
 * Endpoints for WHOIS data and domain information
 */

import { dataforseo } from "./client";

// ============================================
// Types
// ============================================

export interface WhoisResult {
  domain: string;
  created_datetime: string;
  changed_datetime: string;
  expiration_datetime: string;
  updated_datetime: string;
  first_seen: string;
  registered: boolean;
  registrar: {
    name: string;
    organization: string;
    url: string;
    email: string;
    phone: string;
  };
  registrant: {
    name: string;
    organization: string;
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    country_code: string;
    email: string;
    phone: string;
    fax: string;
  } | null;
  admin: {
    name: string;
    organization: string;
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    country_code: string;
    email: string;
    phone: string;
    fax: string;
  } | null;
  tech: {
    name: string;
    organization: string;
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    country_code: string;
    email: string;
    phone: string;
    fax: string;
  } | null;
  billing: {
    name: string;
    organization: string;
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    country_code: string;
    email: string;
    phone: string;
    fax: string;
  } | null;
  name_servers: string[];
  dns_records: Array<{
    type: string;
    value: string;
    ttl: number;
    priority?: number;
  }>;
  status: string[];
  metrics: {
    organic: {
      count: number;
      etv: number;
      pos_1: number;
      pos_2_3: number;
      pos_4_10: number;
      pos_11_20: number;
      pos_21_30: number;
      pos_31_40: number;
      pos_41_50: number;
      pos_51_60: number;
      pos_61_70: number;
      pos_71_80: number;
      pos_81_90: number;
      pos_91_100: number;
    };
    backlinks_info: {
      referring_domains: number;
      referring_main_domains: number;
      referring_pages: number;
      dofollow: number;
      nofollow: number;
      anchor: number;
      image: number;
      canonical: number;
      redirect: number;
      gov: number;
      edu: number;
      backlinks: number;
      spam_score: number;
      rank: number;
    };
  };
}

export interface TechnologyResult {
  technologies: Array<{
    group: string;
    category: string;
    name: string;
    version: string | null;
    website: string;
    icon: string;
  }>;
  countries: string[];
  languages: string[];
  content_languages: string[];
  phone_numbers: string[];
  emails: string[];
  social_graph_urls: string[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  crawler: {
    robots_txt: string | null;
    sitemap: string | null;
  };
}

// ============================================
// API Functions
// ============================================

/**
 * Get WHOIS information for a domain
 */
export async function getWhois(domain: string): Promise<WhoisResult | null> {
  const response = await dataforseo.request<WhoisResult>(
    "/domain_analytics/whois/overview/live",
    "POST",
    [
      {
        target: domain,
      },
    ]
  );

  return response.tasks?.[0]?.result?.[0] || null;
}

/**
 * Get technologies used by a domain
 */
export async function getTechnologies(
  target: string
): Promise<TechnologyResult | null> {
  const response = await dataforseo.request<TechnologyResult>(
    "/domain_analytics/technologies/domain_technologies/live",
    "POST",
    [
      {
        target,
      },
    ]
  );

  return response.tasks?.[0]?.result?.[0] || null;
}

/**
 * Aggregate WHOIS lookup for multiple domains
 */
export async function bulkWhoisLookup(
  domains: string[]
): Promise<WhoisResult[]> {
  const tasks = domains.map((domain) => ({
    target: domain,
  }));

  const response = await dataforseo.request<WhoisResult>(
    "/domain_analytics/whois/overview/live",
    "POST",
    tasks
  );

  return response.tasks?.flatMap((task) => task.result || []) || [];
}
