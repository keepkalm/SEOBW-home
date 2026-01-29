import { google, searchconsole_v1 } from "googleapis";
import { getValidTokens, getAuthenticatedClient } from "../auth/tokens.js";

type SearchConsole = searchconsole_v1.Searchconsole;

async function getSearchConsoleClient(userId: string): Promise<SearchConsole> {
  const { accessToken } = await getValidTokens(userId);
  const auth = getAuthenticatedClient(accessToken);
  return google.searchconsole({ version: "v1", auth });
}

export async function listSites(userId: string) {
  const searchconsole = await getSearchConsoleClient(userId);
  const response = await searchconsole.sites.list();
  return response.data.siteEntry || [];
}

export interface SearchPerformanceParams {
  siteUrl: string;
  startDate: string;
  endDate: string;
  dimensions?: string[];
  filters?: Array<{
    dimension: string;
    operator: string;
    expression: string;
  }>;
  rowLimit?: number;
}

export async function searchPerformance(
  userId: string,
  params: SearchPerformanceParams
) {
  const searchconsole = await getSearchConsoleClient(userId);

  const requestBody: searchconsole_v1.Schema$SearchAnalyticsQueryRequest = {
    startDate: params.startDate,
    endDate: params.endDate,
    dimensions: params.dimensions || ["query"],
    rowLimit: params.rowLimit || 1000,
  };

  if (params.filters && params.filters.length > 0) {
    requestBody.dimensionFilterGroups = [
      {
        filters: params.filters.map((f) => ({
          dimension: f.dimension,
          operator: f.operator,
          expression: f.expression,
        })),
      },
    ];
  }

  const response = await searchconsole.searchanalytics.query({
    siteUrl: params.siteUrl,
    requestBody,
  });

  return {
    rows: response.data.rows || [],
    responseAggregationType: response.data.responseAggregationType,
  };
}

export interface UrlInspectionParams {
  siteUrl: string;
  inspectionUrl: string;
}

export async function urlInspection(
  userId: string,
  params: UrlInspectionParams
) {
  const { accessToken } = await getValidTokens(userId);
  const auth = getAuthenticatedClient(accessToken);
  const searchconsole = google.searchconsole({ version: "v1", auth });

  const response = await searchconsole.urlInspection.index.inspect({
    requestBody: {
      siteUrl: params.siteUrl,
      inspectionUrl: params.inspectionUrl,
    },
  });

  return response.data.inspectionResult;
}

export async function listSitemaps(userId: string, siteUrl: string) {
  const searchconsole = await getSearchConsoleClient(userId);
  const response = await searchconsole.sitemaps.list({ siteUrl });
  return response.data.sitemap || [];
}

export async function submitSitemap(
  userId: string,
  siteUrl: string,
  feedpath: string
) {
  const searchconsole = await getSearchConsoleClient(userId);
  await searchconsole.sitemaps.submit({ siteUrl, feedpath });
  return { success: true, message: `Sitemap ${feedpath} submitted successfully` };
}

export async function deleteSitemap(
  userId: string,
  siteUrl: string,
  feedpath: string
) {
  const searchconsole = await getSearchConsoleClient(userId);
  await searchconsole.sitemaps.delete({ siteUrl, feedpath });
  return { success: true, message: `Sitemap ${feedpath} deleted successfully` };
}

export async function indexCoverage(userId: string, siteUrl: string) {
  // Note: Index coverage data requires the Search Console API v1
  // This uses the search analytics as a proxy for indexed pages
  const searchconsole = await getSearchConsoleClient(userId);

  // Get pages that appeared in search results (indicates they're indexed)
  const response = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: getDateString(-90), // Last 90 days
      endDate: getDateString(-1),
      dimensions: ["page"],
      rowLimit: 25000,
    },
  });

  const indexedPages = response.data.rows || [];

  return {
    totalIndexedPages: indexedPages.length,
    samplePages: indexedPages.slice(0, 100).map((row) => ({
      page: row.keys?.[0],
      clicks: row.clicks,
      impressions: row.impressions,
    })),
    note: "This shows pages that appeared in search results. For full index coverage, use Google Search Console UI.",
  };
}

function getDateString(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split("T")[0];
}
