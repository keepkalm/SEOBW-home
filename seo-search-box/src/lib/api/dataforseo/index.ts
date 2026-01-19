/**
 * DataForSEO API - Main Export
 *
 * Exports all DataForSEO API functions from a single entry point
 */

// Base client
export { dataforseo, DataForSEOClient } from "./client";
export type { DataForSEOConfig, DataForSEOResponse } from "./client";

// Keywords Data API
export {
  getSearchVolume,
  getKeywordSuggestions,
  getKeywordsForSite,
  getSearchIntent,
} from "./keywords";
export type {
  KeywordSearchVolumeResult,
  KeywordSuggestionsResult,
  SearchIntentResult,
} from "./keywords";

// Backlinks API
export {
  getBacklinksSummary,
  getBacklinks,
  getReferringDomains,
  getNewLostBacklinks,
} from "./backlinks";
export type {
  BacklinksSummaryResult,
  BacklinkResult,
  ReferringDomainResult,
} from "./backlinks";

// DataForSEO Labs API
export {
  getRankedKeywords,
  getCompetitorDomains,
  getKeywordIdeas,
  getHistoricalSerp,
  getDomainRankOverview,
} from "./labs";
export type {
  RankedKeywordResult,
  CompetitorDomainResult,
  KeywordIdeaResult,
  HistoricalSerpResult,
} from "./labs";

// SERP API
export {
  getAutocomplete,
  getGoogleMaps,
  getLocalFinder,
  getOrganicSerp,
} from "./serp";
export type {
  AutocompleteResult,
  GoogleMapsResult,
  GoogleMapsItem,
  LocalFinderResult,
} from "./serp";

// On-Page API
export {
  getLighthouseAudit,
  getInstantPage,
  getMicrodata,
} from "./onpage";
export type {
  LighthouseResult,
  LighthouseItem,
  InstantPageResult,
  InstantPageItem,
} from "./onpage";

// Business Data API
export {
  getGoogleReviews,
  getBusinessInfo,
  getBusinessInfoByPlaceId,
  searchBusinesses,
} from "./business";
export type {
  GoogleReviewsResult,
  GoogleReviewItem,
  BusinessInfoResult,
} from "./business";

// Content Analysis API
export {
  getSentimentAnalysis,
  getSentimentAnalysisFromUrl,
  getCategoryAnalysis,
  searchContent,
} from "./content";
export type {
  SentimentAnalysisResult,
  SentimentSentence,
  CategoryAnalysisResult,
  ContentSearchResult,
} from "./content";

// Domain Analytics / WHOIS API
export {
  getWhois,
  getTechnologies,
  bulkWhoisLookup,
} from "./whois";
export type {
  WhoisResult,
  TechnologyResult,
} from "./whois";
