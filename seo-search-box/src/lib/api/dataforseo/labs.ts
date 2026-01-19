/**
 * DataForSEO Labs API
 *
 * Advanced intelligence endpoints: ranked keywords, competitors, keyword ideas, historical SERP
 */

import { dataforseo } from "./client";

// ============================================
// Types
// ============================================

export interface RankedKeywordResult {
  se_type: string;
  keyword_data: {
    keyword: string;
    location_code: number;
    language_code: string;
    keyword_info: {
      se_type: string;
      last_updated_time: string;
      competition: number;
      competition_level: string;
      cpc: number;
      search_volume: number;
      low_top_of_page_bid: number;
      high_top_of_page_bid: number;
      categories: number[];
      monthly_searches: Array<{
        year: number;
        month: number;
        search_volume: number;
      }>;
    };
    search_intent_info: {
      se_type: string;
      main_intent: string;
      foreign_intent: string[];
    } | null;
  };
  ranked_serp_element: {
    se_type: string;
    serp_item: {
      type: string;
      rank_group: number;
      rank_absolute: number;
      position: string;
      xpath: string;
      domain: string;
      title: string;
      url: string;
      breadcrumb: string;
      website_name: string;
      is_image: boolean;
      is_video: boolean;
      is_featured_snippet: boolean;
      is_malicious: boolean;
      description: string;
      pre_snippet: string;
      extended_snippet: string;
      amp_version: boolean;
      rating: {
        rating_type: string;
        value: number;
        votes_count: number;
        rating_max: number;
      } | null;
      highlighted: string[];
      links: Array<{
        type: string;
        title: string;
        url: string;
        description: string;
      }>;
      about_this_result: Record<string, unknown>;
      timestamp: string;
      rectangle: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    };
    check_url: string;
    serp_item_types: string[];
    se_results_count: string;
    last_updated_time: string;
    previous_updated_time: string;
  };
}

export interface CompetitorDomainResult {
  se_type: string;
  domain: string;
  avg_position: number;
  sum_position: number;
  intersections: number;
  full_domain_metrics: {
    organic: {
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
      etv: number;
      impressions_etv: number;
      count: number;
      estimated_paid_traffic_cost: number;
      is_new: number;
      is_up: number;
      is_down: number;
      is_lost: number;
    };
    paid: Record<string, number>;
    featured_snippet: Record<string, number>;
    local_pack: Record<string, number>;
  };
  metrics: {
    organic: {
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
      etv: number;
      impressions_etv: number;
      count: number;
      estimated_paid_traffic_cost: number;
    };
    paid: Record<string, number>;
    featured_snippet: Record<string, number>;
    local_pack: Record<string, number>;
  };
}

export interface KeywordIdeaResult {
  se_type: string;
  keyword: string;
  location_code: number;
  language_code: string;
  keyword_info: {
    se_type: string;
    last_updated_time: string;
    competition: number;
    competition_level: string;
    cpc: number;
    search_volume: number;
    low_top_of_page_bid: number;
    high_top_of_page_bid: number;
    categories: number[];
    monthly_searches: Array<{
      year: number;
      month: number;
      search_volume: number;
    }>;
  };
  keyword_info_normalized_with_bing: Record<string, unknown> | null;
  impressions_info: Record<string, unknown> | null;
  serp_info: {
    se_type: string;
    check_url: string;
    serp_item_types: string[];
    se_results_count: number;
    last_updated_time: string;
    previous_updated_time: string;
  };
  search_intent_info: {
    se_type: string;
    main_intent: string;
    foreign_intent: string[];
  } | null;
}

export interface HistoricalSerpResult {
  se_type: string;
  keyword: string;
  type: string;
  location_code: number;
  language_code: string;
  datetime: string;
  item_types: string[];
  se_results_count: number;
  items_count: number;
  items: Array<{
    type: string;
    rank_group: number;
    rank_absolute: number;
    domain: string;
    title: string;
    url: string;
    description: string;
    breadcrumb: string;
  }>;
}

// ============================================
// API Functions
// ============================================

/**
 * Get all keywords a domain ranks for
 */
export async function getRankedKeywords(
  target: string,
  locationCode: number = 2840,
  languageCode: string = "en",
  limit: number = 100,
  offset: number = 0,
  orderBy: string = "keyword_data.keyword_info.search_volume,desc"
): Promise<RankedKeywordResult[]> {
  const response = await dataforseo.request<RankedKeywordResult>(
    "/dataforseo_labs/google/ranked_keywords/live",
    "POST",
    [
      {
        target,
        location_code: locationCode,
        language_code: languageCode,
        limit,
        offset,
        order_by: [orderBy],
        include_serp_info: true,
        include_clickstream_data: false,
      },
    ]
  );

  return response.tasks?.[0]?.result || [];
}

/**
 * Get competitor domains for a target domain
 */
export async function getCompetitorDomains(
  target: string,
  locationCode: number = 2840,
  languageCode: string = "en",
  limit: number = 20
): Promise<CompetitorDomainResult[]> {
  const response = await dataforseo.request<CompetitorDomainResult>(
    "/dataforseo_labs/google/competitors_domain/live",
    "POST",
    [
      {
        target,
        location_code: locationCode,
        language_code: languageCode,
        limit,
        exclude_top_domains: true,
        max_rank_group: 100,
      },
    ]
  );

  return response.tasks?.[0]?.result || [];
}

/**
 * Get related keyword ideas
 */
export async function getKeywordIdeas(
  keyword: string,
  locationCode: number = 2840,
  languageCode: string = "en",
  limit: number = 100
): Promise<KeywordIdeaResult[]> {
  const response = await dataforseo.request<KeywordIdeaResult>(
    "/dataforseo_labs/google/keyword_ideas/live",
    "POST",
    [
      {
        keyword,
        location_code: locationCode,
        language_code: languageCode,
        limit,
        include_serp_info: true,
        include_seed_keyword: false,
      },
    ]
  );

  return response.tasks?.[0]?.result || [];
}

/**
 * Get historical SERP data for a keyword
 */
export async function getHistoricalSerp(
  keyword: string,
  locationCode: number = 2840,
  languageCode: string = "en"
): Promise<HistoricalSerpResult[]> {
  const response = await dataforseo.request<HistoricalSerpResult>(
    "/dataforseo_labs/google/historical_serps/live",
    "POST",
    [
      {
        keyword,
        location_code: locationCode,
        language_code: languageCode,
      },
    ]
  );

  return response.tasks?.[0]?.result || [];
}

/**
 * Get domain rank overview (metrics over time)
 */
export async function getDomainRankOverview(
  target: string,
  locationCode: number = 2840,
  languageCode: string = "en"
) {
  const response = await dataforseo.request(
    "/dataforseo_labs/google/domain_rank_overview/live",
    "POST",
    [
      {
        target,
        location_code: locationCode,
        language_code: languageCode,
      },
    ]
  );

  return response.tasks?.[0]?.result?.[0] || null;
}
