/**
 * DataForSEO Content Analysis API
 *
 * Endpoints for content analysis: sentiment analysis, category detection
 */

import { dataforseo } from "./client";

// ============================================
// Types
// ============================================

export interface SentimentAnalysisResult {
  type: string;
  sentences: SentimentSentence[];
  connotation_types: {
    positive: number;
    negative: number;
    neutral: number;
  };
  text_category: string[];
  page_category: string[];
}

export interface SentimentSentence {
  text: string;
  offset: number;
  length: number;
  sentiment: {
    connotation_type: "positive" | "negative" | "neutral";
    score: number;
  };
  highlight: Array<{
    text: string;
    offset: number;
    length: number;
  }>;
}

export interface CategoryAnalysisResult {
  type: string;
  url: string;
  text_category: Array<{
    category: string;
    confidence_score: number;
  }>;
  page_category: Array<{
    category: string;
    confidence_score: number;
  }>;
}

export interface ContentSearchResult {
  type: string;
  url: string;
  domain: string;
  main_domain: string;
  url_rank: number;
  spam_score: number;
  domain_rank: number;
  fetch_time: string;
  country: string;
  language: string;
  score: number;
  page_category: string[];
  page_types: string[];
  content_info: {
    content_type: string;
    title: string;
    main_title: string;
    previous_title: string;
    level: number;
    author: string;
    snippet: string;
    snippet_length: number;
    social_metrics: {
      likes_count: number;
      comments_count: number;
      shares_count: number;
    } | null;
    highlighted_text: string;
    language: string;
    sentiment_connotations: {
      anger: number;
      happiness: number;
      love: number;
      sadness: number;
      share: number;
      fun: number;
    };
    connotation_types: {
      positive: number;
      negative: number;
      neutral: number;
    };
    text_category: string[];
    date_published: string;
    content_quality_score: number;
  };
}

// ============================================
// API Functions
// ============================================

/**
 * Analyze sentiment of text content
 */
export async function getSentimentAnalysis(
  text: string
): Promise<SentimentAnalysisResult | null> {
  const response = await dataforseo.request<SentimentAnalysisResult>(
    "/content_analysis/sentiment_analysis/live",
    "POST",
    [
      {
        text,
      },
    ]
  );

  return response.tasks?.[0]?.result?.[0] || null;
}

/**
 * Analyze sentiment of content from a URL
 */
export async function getSentimentAnalysisFromUrl(
  url: string
): Promise<SentimentAnalysisResult | null> {
  // First fetch the page content, then analyze
  const response = await dataforseo.request<SentimentAnalysisResult>(
    "/content_analysis/sentiment_analysis/live",
    "POST",
    [
      {
        url,
      },
    ]
  );

  return response.tasks?.[0]?.result?.[0] || null;
}

/**
 * Detect categories of content
 */
export async function getCategoryAnalysis(
  url: string
): Promise<CategoryAnalysisResult | null> {
  const response = await dataforseo.request<CategoryAnalysisResult>(
    "/content_analysis/category/live",
    "POST",
    [
      {
        url,
      },
    ]
  );

  return response.tasks?.[0]?.result?.[0] || null;
}

/**
 * Search for content by keyword
 */
export async function searchContent(
  keyword: string,
  limit: number = 10,
  filters?: {
    publishedMin?: string;
    publishedMax?: string;
    sentimentMin?: number;
    sentimentMax?: number;
  }
): Promise<ContentSearchResult[]> {
  const searchFilters: string[][] = [];

  if (filters?.publishedMin) {
    searchFilters.push(["content_info.date_published", ">=", filters.publishedMin]);
  }
  if (filters?.publishedMax) {
    searchFilters.push(["content_info.date_published", "<=", filters.publishedMax]);
  }

  const response = await dataforseo.request<ContentSearchResult>(
    "/content_analysis/search/live",
    "POST",
    [
      {
        keyword,
        limit,
        search_mode: "as_is",
        filters: searchFilters.length > 0 ? searchFilters : undefined,
        order_by: ["content_info.content_quality_score,desc"],
      },
    ]
  );

  return response.tasks?.[0]?.result || [];
}
