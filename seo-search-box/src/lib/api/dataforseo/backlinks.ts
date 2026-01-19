/**
 * DataForSEO Backlinks API
 *
 * Endpoints for backlink analysis: summary, backlink list, referring domains
 */

import { dataforseo } from "./client";

// ============================================
// Types
// ============================================

export interface BacklinksSummaryResult {
  target: string;
  first_seen: string;
  lost_date: string | null;
  rank: number;
  backlinks: number;
  backlinks_spam_score: number;
  crawled_pages: number;
  info: {
    server: string;
    cms: string | null;
    platform_type: string[];
    ip_address: string;
    country: string;
    is_ip: boolean;
    target_spam_score: number;
  };
  internal_links_count: number;
  external_links_count: number;
  broken_backlinks: number;
  broken_pages: number;
  referring_domains: number;
  referring_domains_nofollow: number;
  referring_main_domains: number;
  referring_main_domains_nofollow: number;
  referring_ips: number;
  referring_subnets: number;
  referring_pages: number;
  referring_pages_nofollow: number;
  referring_links_tld: Record<string, number>;
  referring_links_types: Record<string, number>;
  referring_links_attributes: Record<string, number>;
  referring_links_platform_types: Record<string, number>;
  referring_links_semantic_locations: Record<string, number>;
  referring_links_countries: Record<string, number>;
}

export interface BacklinkResult {
  type: string;
  domain_from: string;
  url_from: string;
  url_from_https: boolean;
  domain_to: string;
  url_to: string;
  url_to_https: boolean;
  tld_from: string;
  is_new: boolean;
  is_lost: boolean;
  backlink_spam_score: number;
  rank: number;
  page_from_rank: number;
  domain_from_rank: number;
  domain_from_platform_type: string[];
  domain_from_is_ip: boolean;
  domain_from_ip: string;
  domain_from_country: string;
  page_from_external_links: number;
  page_from_internal_links: number;
  page_from_size: number;
  page_from_encoding: string;
  page_from_language: string;
  page_from_title: string;
  page_from_status_code: number;
  first_seen: string;
  prev_seen: string;
  last_seen: string;
  item_type: string;
  attributes: string[];
  dofollow: boolean;
  original: boolean;
  alt: string | null;
  anchor: string;
  text_pre: string;
  text_post: string;
  semantic_location: string;
  links_count: number;
  group_count: number;
  is_broken: boolean;
  url_to_status_code: number;
  url_to_spam_score: number;
  url_to_redirect_target: string | null;
}

export interface ReferringDomainResult {
  type: string;
  domain: string;
  rank: number;
  backlinks: number;
  first_seen: string;
  lost_date: string | null;
  backlinks_spam_score: number;
  broken_backlinks: number;
  broken_pages: number;
  referring_domains: number;
  referring_main_domains: number;
  referring_ips: number;
  referring_subnets: number;
  referring_pages: number;
  referring_links_tld: Record<string, number>;
  referring_links_types: Record<string, number>;
  referring_links_attributes: Record<string, number>;
  referring_links_platform_types: Record<string, number>;
  referring_links_semantic_locations: Record<string, number>;
  referring_links_countries: Record<string, number>;
}

// ============================================
// API Functions
// ============================================

/**
 * Get backlinks summary for a domain or URL
 */
export async function getBacklinksSummary(
  target: string
): Promise<BacklinksSummaryResult | null> {
  const response = await dataforseo.request<BacklinksSummaryResult>(
    "/backlinks/summary/live",
    "POST",
    [
      {
        target,
        include_subdomains: true,
        internal_list_limit: 10,
        backlinks_filters: [],
      },
    ]
  );

  return response.tasks?.[0]?.result?.[0] || null;
}

/**
 * Get list of backlinks for a domain or URL
 */
export async function getBacklinks(
  target: string,
  limit: number = 100,
  offset: number = 0,
  orderBy: string = "rank,desc"
): Promise<BacklinkResult[]> {
  const response = await dataforseo.request<BacklinkResult>(
    "/backlinks/backlinks/live",
    "POST",
    [
      {
        target,
        include_subdomains: true,
        limit,
        offset,
        order_by: [orderBy],
        backlinks_filters: ["dofollow", "=", true],
      },
    ]
  );

  return response.tasks?.[0]?.result || [];
}

/**
 * Get referring domains for a target
 */
export async function getReferringDomains(
  target: string,
  limit: number = 100,
  offset: number = 0
): Promise<ReferringDomainResult[]> {
  const response = await dataforseo.request<ReferringDomainResult>(
    "/backlinks/referring_domains/live",
    "POST",
    [
      {
        target,
        include_subdomains: true,
        limit,
        offset,
        order_by: ["rank,desc"],
      },
    ]
  );

  return response.tasks?.[0]?.result || [];
}

/**
 * Get new and lost backlinks for a domain
 */
export async function getNewLostBacklinks(
  target: string,
  type: "new" | "lost" = "new",
  limit: number = 100
): Promise<BacklinkResult[]> {
  const filterField = type === "new" ? "is_new" : "is_lost";

  const response = await dataforseo.request<BacklinkResult>(
    "/backlinks/backlinks/live",
    "POST",
    [
      {
        target,
        include_subdomains: true,
        limit,
        backlinks_filters: [filterField, "=", true],
        order_by: ["first_seen,desc"],
      },
    ]
  );

  return response.tasks?.[0]?.result || [];
}
