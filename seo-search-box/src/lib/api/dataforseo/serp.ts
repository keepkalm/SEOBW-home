/**
 * DataForSEO SERP API
 *
 * Endpoints for SERP data: autocomplete, Google Maps, Local Finder
 */

import { dataforseo } from "./client";

// ============================================
// Types
// ============================================

export interface AutocompleteResult {
  keyword: string;
  location_code: number;
  language_code: string;
  search_partners: boolean;
  device: string;
  os: string;
  items: Array<{
    type: string;
    suggestion: string;
    suggestion_type: string;
    relevant_keywords: string[] | null;
    search_query_time: string;
    highlighted: string[];
  }>;
}

export interface GoogleMapsResult {
  keyword: string;
  type: string;
  se_domain: string;
  location_code: number;
  language_code: string;
  check_url: string;
  datetime: string;
  item_types: string[];
  items_count: number;
  items: GoogleMapsItem[];
}

export interface GoogleMapsItem {
  type: string;
  rank_group: number;
  rank_absolute: number;
  domain: string;
  title: string;
  url: string;
  contact_url: string;
  rating: {
    rating_type: string;
    value: number;
    votes_count: number;
    rating_max: number;
  };
  hotel_rating: number | null;
  price_level: string;
  snippet: string;
  address: string;
  address_info: {
    borough: string;
    address: string;
    city: string;
    zip: string;
    region: string;
    country_code: string;
  };
  place_id: string;
  phone: string;
  main_image: string;
  category: string;
  additional_categories: string[];
  category_ids: string[];
  work_hours: {
    current_status: string;
    timetable: Record<string, Array<{ open: { hour: number; minute: number }; close: { hour: number; minute: number } }>>;
  };
  feature_id: string;
  cid: string;
  latitude: number;
  longitude: number;
  is_claimed: boolean;
  local_justifications: Array<{
    type: string;
    text: string;
  }>;
  is_directory_item: boolean;
}

export interface LocalFinderResult {
  keyword: string;
  type: string;
  se_domain: string;
  location_code: number;
  language_code: string;
  check_url: string;
  datetime: string;
  item_types: string[];
  items_count: number;
  items: GoogleMapsItem[];
}

// ============================================
// API Functions
// ============================================

/**
 * Get Google autocomplete suggestions for a keyword
 */
export async function getAutocomplete(
  keyword: string,
  locationCode: number = 2840,
  languageCode: string = "en"
): Promise<AutocompleteResult | null> {
  const response = await dataforseo.request<AutocompleteResult>(
    "/serp/google/autocomplete/live",
    "POST",
    [
      {
        keyword,
        location_code: locationCode,
        language_code: languageCode,
      },
    ]
  );

  return response.tasks?.[0]?.result?.[0] || null;
}

/**
 * Get Google Maps results for a query
 */
export async function getGoogleMaps(
  keyword: string,
  locationCode: number = 2840,
  languageCode: string = "en",
  depth: number = 20
): Promise<GoogleMapsResult | null> {
  const response = await dataforseo.request<GoogleMapsResult>(
    "/serp/google/maps/live/advanced",
    "POST",
    [
      {
        keyword,
        location_code: locationCode,
        language_code: languageCode,
        depth,
      },
    ]
  );

  return response.tasks?.[0]?.result?.[0] || null;
}

/**
 * Get Google Local Finder results (extended local business listings)
 */
export async function getLocalFinder(
  keyword: string,
  locationCode: number = 2840,
  languageCode: string = "en",
  depth: number = 20
): Promise<LocalFinderResult | null> {
  const response = await dataforseo.request<LocalFinderResult>(
    "/serp/google/local_finder/live/advanced",
    "POST",
    [
      {
        keyword,
        location_code: locationCode,
        language_code: languageCode,
        depth,
      },
    ]
  );

  return response.tasks?.[0]?.result?.[0] || null;
}

/**
 * Get organic SERP results
 */
export async function getOrganicSerp(
  keyword: string,
  locationCode: number = 2840,
  languageCode: string = "en",
  depth: number = 100
) {
  const response = await dataforseo.request(
    "/serp/google/organic/live/regular",
    "POST",
    [
      {
        keyword,
        location_code: locationCode,
        language_code: languageCode,
        depth,
      },
    ]
  );

  return response.tasks?.[0]?.result?.[0] || null;
}
