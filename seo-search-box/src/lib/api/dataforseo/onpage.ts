/**
 * DataForSEO On-Page API
 *
 * Endpoints for page analysis: Lighthouse audits, instant page analysis
 */

import { dataforseo } from "./client";

// ============================================
// Types
// ============================================

export interface LighthouseResult {
  crawl_progress: string;
  crawl_status: {
    max_crawl_pages: number;
    pages_in_queue: number;
    pages_crawled: number;
  };
  items: LighthouseItem[];
}

export interface LighthouseItem {
  resource: string;
  lighthouse_version: string;
  fetch_time: string;
  categories: {
    performance: {
      id: string;
      title: string;
      description: string;
      score: number;
    };
    accessibility: {
      id: string;
      title: string;
      description: string;
      score: number;
    };
    best_practices: {
      id: string;
      title: string;
      description: string;
      score: number;
    };
    seo: {
      id: string;
      title: string;
      description: string;
      score: number;
    };
    pwa?: {
      id: string;
      title: string;
      description: string;
      score: number;
    };
  };
  audits: {
    // Core Web Vitals
    largest_contentful_paint?: {
      id: string;
      title: string;
      description: string;
      score: number;
      display_value: string;
      numeric_value: number;
    };
    first_input_delay?: {
      id: string;
      title: string;
      description: string;
      score: number;
      display_value: string;
      numeric_value: number;
    };
    cumulative_layout_shift?: {
      id: string;
      title: string;
      description: string;
      score: number;
      display_value: string;
      numeric_value: number;
    };
    // Other metrics
    first_contentful_paint?: {
      id: string;
      title: string;
      description: string;
      score: number;
      display_value: string;
      numeric_value: number;
    };
    speed_index?: {
      id: string;
      title: string;
      description: string;
      score: number;
      display_value: string;
      numeric_value: number;
    };
    time_to_interactive?: {
      id: string;
      title: string;
      description: string;
      score: number;
      display_value: string;
      numeric_value: number;
    };
    total_blocking_time?: {
      id: string;
      title: string;
      description: string;
      score: number;
      display_value: string;
      numeric_value: number;
    };
    // SEO audits
    document_title?: {
      id: string;
      title: string;
      description: string;
      score: number;
    };
    meta_description?: {
      id: string;
      title: string;
      description: string;
      score: number;
    };
    viewport?: {
      id: string;
      title: string;
      description: string;
      score: number;
    };
    robots_txt?: {
      id: string;
      title: string;
      description: string;
      score: number;
    };
    crawlable_anchors?: {
      id: string;
      title: string;
      description: string;
      score: number;
    };
    [key: string]: unknown;
  };
}

export interface InstantPageResult {
  crawl_progress: string;
  crawl_status: {
    max_crawl_pages: number;
    pages_in_queue: number;
    pages_crawled: number;
  };
  items: InstantPageItem[];
}

export interface InstantPageItem {
  resource_type: string;
  status_code: number;
  location: string | null;
  url: string;
  meta: {
    title: string;
    charset: number;
    follow: boolean;
    generator: string | null;
    htags: {
      h1: string[];
      h2: string[];
      h3: string[];
      h4: string[];
      h5: string[];
      h6: string[];
    };
    description: string;
    favicon: string;
    meta_keywords: string;
    canonical: string;
    internal_links_count: number;
    external_links_count: number;
    inbound_links_count: number;
    images_count: number;
    images_size: number;
    scripts_count: number;
    scripts_size: number;
    stylesheets_count: number;
    stylesheets_size: number;
    title_length: number;
    description_length: number;
    content: {
      plain_text_size: number;
      plain_text_rate: number;
      plain_text_word_count: number;
      automated_readability_index: number;
      coleman_liau_readability_index: number;
      dale_chall_readability_index: number;
      flesch_kincaid_readability_index: number;
      smog_readability_index: number;
      description_to_content_consistency: number;
      title_to_content_consistency: number;
      meta_keywords_to_content_consistency: number;
    };
    deprecated_tags: string[];
    duplicate_meta_tags: string[];
    spell: Record<string, unknown>;
    social_media_tags: {
      og_type: string;
      og_title: string;
      og_description: string;
      og_image: string;
      og_url: string;
      og_site_name: string;
      fb_app_id: string;
      twitter_card: string;
      twitter_title: string;
      twitter_description: string;
      twitter_image: string;
    };
  };
  page_timing: {
    time_to_interactive: number;
    dom_complete: number;
    largest_contentful_paint: number;
    first_input_delay: number;
    connection_time: number;
    time_to_secure_connection: number;
    request_sent_time: number;
    waiting_time: number;
    download_time: number;
    duration_time: number;
    fetch_start: number;
    fetch_end: number;
  };
  onpage_score: number;
  total_dom_size: number;
  custom_js_response: Record<string, unknown> | null;
  resource_errors: {
    errors: Array<{
      line: number;
      column: number;
      message: string;
      status_code: number;
    }>;
    warnings: Array<{
      line: number;
      column: number;
      message: string;
      status_code: number;
    }>;
  } | null;
  broken_resources: boolean;
  broken_links: boolean;
  duplicate_title: boolean;
  duplicate_description: boolean;
  duplicate_content: boolean;
  click_depth: number;
  size: number;
  encoded_size: number;
  total_transfer_size: number;
  fetch_time: string;
  cache_control: {
    cachable: boolean;
    ttl: number;
  };
  checks: Record<string, boolean>;
  content_encoding: string;
  media_type: string;
  server: string;
  is_resource: boolean;
  url_length: number;
  relative_url_length: number;
  last_modified: {
    header: string | null;
    sitemap: string | null;
    meta_tag: string | null;
  };
}

// ============================================
// API Functions
// ============================================

/**
 * Run Lighthouse audit on a URL
 */
export async function getLighthouseAudit(
  url: string,
  forMobile: boolean = true
): Promise<LighthouseResult | null> {
  const response = await dataforseo.request<LighthouseResult>(
    "/on_page/lighthouse/live/json",
    "POST",
    [
      {
        url,
        for_mobile: forMobile,
        categories: ["performance", "accessibility", "best-practices", "seo"],
      },
    ]
  );

  return response.tasks?.[0]?.result?.[0] || null;
}

/**
 * Get instant page analysis
 */
export async function getInstantPage(
  url: string
): Promise<InstantPageResult | null> {
  const response = await dataforseo.request<InstantPageResult>(
    "/on_page/instant_pages",
    "POST",
    [
      {
        url,
        enable_javascript: true,
        enable_browser_rendering: true,
      },
    ]
  );

  return response.tasks?.[0]?.result?.[0] || null;
}

/**
 * Parse structured data (schema/microdata) from a page
 */
export async function getMicrodata(url: string) {
  const response = await dataforseo.request(
    "/on_page/microdata",
    "POST",
    [
      {
        url,
      },
    ]
  );

  return response.tasks?.[0]?.result || [];
}
