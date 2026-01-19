/**
 * Search-related TypeScript types
 */

export type InputType = "keyword" | "url" | "phone" | "business";

export interface SearchResult {
  id: string;
  inputType: InputType;
  inputValue: string;
  normalizedValue: string;
  createdAt: Date;
  userId?: string;
}

export interface KeywordSearchResult {
  keyword: {
    keyword: string;
    searchVolume: number | null;
    cpcLow: number | null;
    cpcHigh: number | null;
    cpcAvg: number | null;
    competition: number | null;
    difficulty: number | null;
    monthlySearches: Array<{
      year: number;
      month: number;
      search_volume: number;
    }>;
  };
  relatedKeywords: Array<{
    keyword: string;
    searchVolume: number | null;
    cpc: number | null;
    type: string;
  }>;
  autocomplete: string[];
  intent: {
    label: string;
    probability: number;
  } | null;
  topUrls: Array<{
    url: string;
    domain: string;
    title: string;
    position: number;
  }>;
}

export interface DomainSearchResult {
  domain: {
    domain: string;
    domainRank: number | null;
    organicTraffic: number | null;
    organicKeywords: number | null;
  };
  backlinks: {
    total: number;
    referringDomains: number;
    dofollow: number;
    nofollow: number;
  };
  rankedKeywords: Array<{
    keyword: string;
    position: number;
    searchVolume: number | null;
    url: string;
  }>;
  competitors: Array<{
    domain: string;
    intersections: number;
    avgPosition: number;
  }>;
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  } | null;
  pageAnalysis: {
    title: string;
    metaDescription: string;
    wordCount: number;
    internalLinks: number;
    externalLinks: number;
    images: number;
  } | null;
  whois: {
    registrar: string;
    createdDate: string;
    expiryDate: string;
    nameServers: string[];
  } | null;
}

export interface BusinessSearchResult {
  business: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    website: string;
    category: string;
    rating: number | null;
    reviewCount: number | null;
    latitude: number | null;
    longitude: number | null;
    placeId: string | null;
    cid: string | null;
    hours: Record<string, string> | null;
  } | null;
  reviews: {
    rating: number;
    totalReviews: number;
    reviews: Array<{
      author: string;
      rating: number;
      text: string;
      date: string;
      profileImage: string | null;
    }>;
    sentiment: {
      positive: number;
      negative: number;
      neutral: number;
    };
  } | null;
  maps: Array<{
    name: string;
    address: string;
    rating: number | null;
    reviewCount: number | null;
    category: string;
    phone: string;
    website: string;
    latitude: number | null;
    longitude: number | null;
    placeId: string | null;
    cid: string | null;
  }>;
}

export interface PhoneSearchResult {
  business: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    website: string;
    category: string;
    rating: number | null;
    reviewCount: number | null;
    latitude: number | null;
    longitude: number | null;
    placeId: string | null;
    cid: string | null;
  } | null;
  alternateResults: Array<{
    name: string;
    address: string;
    phone: string;
    category: string;
    latitude: number | null;
    longitude: number | null;
    placeId: string | null;
    cid: string | null;
  }>;
}
