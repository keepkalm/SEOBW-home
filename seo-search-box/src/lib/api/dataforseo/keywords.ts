/**
 * DataForSEO Keywords Data API
 *
 * Endpoints for keyword research: search volume, CPC, competition, suggestions
 */

import { dataforseo } from "./client";

// ============================================
// Types
// ============================================

export interface KeywordSearchVolumeResult {
  keyword: string;
  location_code: number;
  language_code: string;
  search_partners: boolean;
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
  keyword_info_normalized_with_bing: {
    last_updated_time: string;
    search_volume: number;
    is_normalized: boolean;
  } | null;
  impressions_info: {
    se_type: string;
    last_updated_time: string;
    bid: number;
    match_type: string;
    ad_position_min: number;
    ad_position_max: number;
    ad_position_average: number;
    cpc_min: number;
    cpc_max: number;
    cpc_average: number;
    daily_impressions_min: number;
    daily_impressions_max: number;
    daily_impressions_average: number;
    daily_clicks_min: number;
    daily_clicks_max: number;
    daily_clicks_average: number;
    daily_cost_min: number;
    daily_cost_max: number;
    daily_cost_average: number;
  } | null;
  bing_keyword_info: {
    last_updated_time: string;
    search_volume: number;
  } | null;
  search_intent_info: {
    se_type: string;
    main_intent: string;
    foreign_intent: string[];
    last_updated_time: string;
  } | null;
}

export interface KeywordSuggestionsResult {
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
}

export interface SearchIntentResult {
  keyword: string;
  keyword_intent: {
    label: string; // informational | commercial | transactional | navigational
    probability: number;
  };
  secondary_keyword_intents: Array<{
    label: string;
    probability: number;
  }> | null;
}

// ============================================
// API Functions
// ============================================

/**
 * Get search volume and keyword data for one or more keywords
 */
export async function getSearchVolume(
  keywords: string[],
  locationCode: number = 2840, // US
  languageCode: string = "en"
): Promise<KeywordSearchVolumeResult[]> {
  const response = await dataforseo.request<KeywordSearchVolumeResult>(
    "/keywords_data/google_ads/search_volume/live",
    "POST",
    [
      {
        keywords,
        location_code: locationCode,
        language_code: languageCode,
        include_serp_info: true,
        include_search_volume_history: true,
      },
    ]
  );

  return response.tasks?.[0]?.result || [];
}

/**
 * Get keyword suggestions based on a seed keyword
 */
export async function getKeywordSuggestions(
  keyword: string,
  locationCode: number = 2840,
  languageCode: string = "en",
  limit: number = 100
): Promise<KeywordSuggestionsResult[]> {
  const response = await dataforseo.request<KeywordSuggestionsResult>(
    "/keywords_data/google_ads/keywords_for_keywords/live",
    "POST",
    [
      {
        keywords: [keyword],
        location_code: locationCode,
        language_code: languageCode,
        include_serp_info: false,
        limit,
      },
    ]
  );

  return response.tasks?.[0]?.result || [];
}

/**
 * Get keywords that a specific site ranks for
 */
export async function getKeywordsForSite(
  targetDomain: string,
  locationCode: number = 2840,
  languageCode: string = "en",
  limit: number = 100
): Promise<KeywordSuggestionsResult[]> {
  const response = await dataforseo.request<KeywordSuggestionsResult>(
    "/keywords_data/google_ads/keywords_for_site/live",
    "POST",
    [
      {
        target: targetDomain,
        location_code: locationCode,
        language_code: languageCode,
        limit,
      },
    ]
  );

  return response.tasks?.[0]?.result || [];
}

/**
 * Classify search intent for keywords
 */
export async function getSearchIntent(
  keywords: string[]
): Promise<SearchIntentResult[]> {
  const response = await dataforseo.request<SearchIntentResult>(
    "/dataforseo_labs/google/search_intent/live",
    "POST",
    [
      {
        keywords,
      },
    ]
  );

  return response.tasks?.[0]?.result || [];
}
