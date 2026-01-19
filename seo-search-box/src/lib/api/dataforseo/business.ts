/**
 * DataForSEO Business Data API
 *
 * Endpoints for business data: Google Reviews, Google My Business info
 */

import { dataforseo } from "./client";

// ============================================
// Types
// ============================================

export interface GoogleReviewsResult {
  type: string;
  keyword: string;
  location_code: number;
  language_code: string;
  check_url: string;
  datetime: string;
  title: string;
  rating: {
    rating_type: string;
    value: number;
    votes_count: number;
    rating_max: number;
  };
  reviews_count: number;
  items_count: number;
  items: GoogleReviewItem[];
}

export interface GoogleReviewItem {
  type: string;
  rank_group: number;
  rank_absolute: number;
  position: string;
  review_id: string;
  rating: {
    rating_type: string;
    value: number;
    votes_count: number;
    rating_max: number;
  };
  timestamp: string;
  review_text: string;
  review_url: string;
  review_images: string[] | null;
  owner_answer: string | null;
  owner_timestamp: string | null;
  original_review_url: string | null;
  profile_name: string;
  profile_url: string;
  profile_image_url: string;
  local_guide: boolean;
  reviews_count: number;
  photos_count: number;
}

export interface BusinessInfoResult {
  type: string;
  keyword: string;
  location_code: number;
  language_code: string;
  check_url: string;
  datetime: string;
  title: string;
  description: string;
  category: string;
  additional_categories: string[];
  cid: string;
  feature_id: string;
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
  url: string;
  domain: string;
  logo: string;
  main_image: string;
  total_photos: number;
  snippet: string;
  latitude: number;
  longitude: number;
  is_claimed: boolean;
  attributes: {
    available_attributes: Record<string, string[]>;
    unavailable_attributes: Record<string, string[]>;
  };
  place_topics: Record<string, number>;
  rating: {
    rating_type: string;
    value: number;
    votes_count: number;
    rating_max: number;
    rating_distribution: Record<string, number>;
  };
  hotel_rating: number | null;
  price_level: string;
  rating_distribution: Record<string, number>;
  people_also_search: Array<{
    cid: string;
    feature_id: string;
    title: string;
    rating: {
      rating_type: string;
      value: number;
      votes_count: number;
      rating_max: number;
    };
    category: string;
  }>;
  work_time: {
    work_hours: {
      timetable: Record<
        string,
        Array<{
          open: { hour: number; minute: number };
          close: { hour: number; minute: number };
        }>
      >;
      current_status: string;
    };
  };
  popular_times: {
    popular_times_by_day: Record<
      string,
      Array<{
        hour: number;
        popularity: number;
      }>
    > | null;
  };
  local_business_links: Array<{
    type: string;
    title: string;
    url: string;
  }>;
  contact_info: Array<{
    contact_type: string;
    contact_url: string;
  }>;
  check_url_map: string;
}

// ============================================
// API Functions
// ============================================

/**
 * Get Google reviews for a business
 */
export async function getGoogleReviews(
  keyword: string,
  locationCode: number = 2840,
  languageCode: string = "en",
  depth: number = 100,
  sortBy: "most_relevant" | "newest" | "highest_rating" | "lowest_rating" = "most_relevant"
): Promise<GoogleReviewsResult | null> {
  const response = await dataforseo.request<GoogleReviewsResult>(
    "/business_data/google/reviews/live/advanced",
    "POST",
    [
      {
        keyword,
        location_code: locationCode,
        language_code: languageCode,
        depth,
        sort_by: sortBy,
      },
    ]
  );

  return response.tasks?.[0]?.result?.[0] || null;
}

/**
 * Get Google business info by keyword (business name)
 */
export async function getBusinessInfo(
  keyword: string,
  locationCode: number = 2840,
  languageCode: string = "en"
): Promise<BusinessInfoResult | null> {
  const response = await dataforseo.request<BusinessInfoResult>(
    "/business_data/google/my_business_info/live",
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
 * Get Google business info by place_id
 */
export async function getBusinessInfoByPlaceId(
  placeId: string,
  locationCode: number = 2840,
  languageCode: string = "en"
): Promise<BusinessInfoResult | null> {
  const response = await dataforseo.request<BusinessInfoResult>(
    "/business_data/google/my_business_info/live",
    "POST",
    [
      {
        place_id: placeId,
        location_code: locationCode,
        language_code: languageCode,
      },
    ]
  );

  return response.tasks?.[0]?.result?.[0] || null;
}

/**
 * Maps search result structure
 */
interface MapsSearchResult {
  items: Array<{
    title: string;
    address: string;
    phone: string;
    url: string;
    category: string;
    rating: {
      value: number;
      votes_count: number;
    };
    address_info: {
      city: string;
      region: string;
      zip: string;
    };
  }>;
}

/**
 * Search for businesses matching a query
 */
export async function searchBusinesses(
  keyword: string,
  locationCode: number = 2840,
  languageCode: string = "en",
  limit: number = 20
) {
  // Use Google Maps API for business search
  const response = await dataforseo.request<MapsSearchResult>(
    "/serp/google/maps/live/advanced",
    "POST",
    [
      {
        keyword,
        location_code: locationCode,
        language_code: languageCode,
        depth: limit,
      },
    ]
  );

  return response.tasks?.[0]?.result?.[0]?.items || [];
}
