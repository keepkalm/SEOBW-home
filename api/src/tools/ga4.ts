import { google, analyticsdata_v1beta } from "googleapis";
import { getValidTokens, getAuthenticatedClient } from "../auth/tokens.js";

type AnalyticsData = analyticsdata_v1beta.Analyticsdata;

async function getAnalyticsClient(userId: string): Promise<AnalyticsData> {
  const { accessToken } = await getValidTokens(userId);
  const auth = getAuthenticatedClient(accessToken);
  return google.analyticsdata({ version: "v1beta", auth });
}

async function getAnalyticsAdminClient(userId: string) {
  const { accessToken } = await getValidTokens(userId);
  const auth = getAuthenticatedClient(accessToken);
  return google.analyticsadmin({ version: "v1beta", auth });
}

export async function listProperties(userId: string) {
  const admin = await getAnalyticsAdminClient(userId);

  const response = await admin.accountSummaries.list();
  const properties: Array<{
    account: string;
    accountName: string;
    propertyId: string;
    propertyName: string;
  }> = [];

  for (const account of response.data.accountSummaries || []) {
    for (const property of account.propertySummaries || []) {
      properties.push({
        account: account.account || "",
        accountName: account.displayName || "",
        propertyId: property.property?.replace("properties/", "") || "",
        propertyName: property.displayName || "",
      });
    }
  }

  return properties;
}

export interface GA4ReportParams {
  propertyId: string;
  startDate: string;
  endDate: string;
  pagePath?: string;
}

export async function pageReport(userId: string, params: GA4ReportParams) {
  const analytics = await getAnalyticsClient(userId);

  const request: analyticsdata_v1beta.Schema$RunReportRequest = {
    dateRanges: [{ startDate: params.startDate, endDate: params.endDate }],
    dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
    metrics: [
      { name: "screenPageViews" },
      { name: "sessions" },
      { name: "totalUsers" },
      { name: "newUsers" },
      { name: "averageSessionDuration" },
      { name: "bounceRate" },
    ],
    limit: "100",
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
  };

  if (params.pagePath) {
    request.dimensionFilter = {
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          matchType: "CONTAINS",
          value: params.pagePath,
        },
      },
    };
  }

  const response = await analytics.properties.runReport({
    property: `properties/${params.propertyId}`,
    requestBody: request,
  });

  return formatReportResponse(response.data, [
    "pagePath",
    "pageTitle",
    "screenPageViews",
    "sessions",
    "totalUsers",
    "newUsers",
    "averageSessionDuration",
    "bounceRate",
  ]);
}

export async function trafficSources(userId: string, params: GA4ReportParams) {
  const analytics = await getAnalyticsClient(userId);

  const request: analyticsdata_v1beta.Schema$RunReportRequest = {
    dateRanges: [{ startDate: params.startDate, endDate: params.endDate }],
    dimensions: [
      { name: "sessionSource" },
      { name: "sessionMedium" },
      { name: "sessionCampaignName" },
    ],
    metrics: [
      { name: "sessions" },
      { name: "totalUsers" },
      { name: "newUsers" },
      { name: "screenPageViews" },
      { name: "averageSessionDuration" },
      { name: "bounceRate" },
    ],
    limit: "100",
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  };

  if (params.pagePath) {
    request.dimensionFilter = {
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          matchType: "CONTAINS",
          value: params.pagePath,
        },
      },
    };
  }

  const response = await analytics.properties.runReport({
    property: `properties/${params.propertyId}`,
    requestBody: request,
  });

  return formatReportResponse(response.data, [
    "sessionSource",
    "sessionMedium",
    "sessionCampaignName",
    "sessions",
    "totalUsers",
    "newUsers",
    "screenPageViews",
    "averageSessionDuration",
    "bounceRate",
  ]);
}

export async function engagementMetrics(
  userId: string,
  params: GA4ReportParams
) {
  const analytics = await getAnalyticsClient(userId);

  const request: analyticsdata_v1beta.Schema$RunReportRequest = {
    dateRanges: [{ startDate: params.startDate, endDate: params.endDate }],
    dimensions: [{ name: "pagePath" }],
    metrics: [
      { name: "screenPageViews" },
      { name: "userEngagementDuration" },
      { name: "averageSessionDuration" },
      { name: "engagedSessions" },
      { name: "engagementRate" },
      { name: "bounceRate" },
      { name: "sessionsPerUser" },
      { name: "screenPageViewsPerSession" },
    ],
    limit: "100",
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
  };

  if (params.pagePath) {
    request.dimensionFilter = {
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          matchType: "CONTAINS",
          value: params.pagePath,
        },
      },
    };
  }

  const response = await analytics.properties.runReport({
    property: `properties/${params.propertyId}`,
    requestBody: request,
  });

  return formatReportResponse(response.data, [
    "pagePath",
    "screenPageViews",
    "userEngagementDuration",
    "averageSessionDuration",
    "engagedSessions",
    "engagementRate",
    "bounceRate",
    "sessionsPerUser",
    "screenPageViewsPerSession",
  ]);
}

export async function conversions(userId: string, params: GA4ReportParams) {
  const analytics = await getAnalyticsClient(userId);

  const request: analyticsdata_v1beta.Schema$RunReportRequest = {
    dateRanges: [{ startDate: params.startDate, endDate: params.endDate }],
    dimensions: [{ name: "eventName" }],
    metrics: [
      { name: "eventCount" },
      { name: "totalUsers" },
      { name: "eventCountPerUser" },
      { name: "conversions" },
    ],
    limit: "100",
    orderBys: [{ metric: { metricName: "conversions" }, desc: true }],
  };

  if (params.pagePath) {
    request.dimensionFilter = {
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          matchType: "CONTAINS",
          value: params.pagePath,
        },
      },
    };
  }

  const response = await analytics.properties.runReport({
    property: `properties/${params.propertyId}`,
    requestBody: request,
  });

  return formatReportResponse(response.data, [
    "eventName",
    "eventCount",
    "totalUsers",
    "eventCountPerUser",
    "conversions",
  ]);
}

interface RealtimeRow {
  screenName: string;
  country: string;
  activeUsers: number;
}

export async function realtime(userId: string, propertyId: string) {
  const analytics = await getAnalyticsClient(userId);

  const response = await analytics.properties.runRealtimeReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dimensions: [{ name: "unifiedScreenName" }, { name: "country" }],
      metrics: [{ name: "activeUsers" }],
      limit: "100",
    },
  });

  const rows: RealtimeRow[] =
    response.data.rows?.map((row) => ({
      screenName: row.dimensionValues?.[0]?.value || "",
      country: row.dimensionValues?.[1]?.value || "",
      activeUsers: parseInt(row.metricValues?.[0]?.value || "0", 10),
    })) || [];

  const totalActiveUsers = rows.reduce(
    (sum: number, row: RealtimeRow) => sum + row.activeUsers,
    0
  );

  return {
    totalActiveUsers,
    byPage: rows.filter((r: RealtimeRow) => r.screenName).slice(0, 20),
  };
}

function formatReportResponse(
  data: analyticsdata_v1beta.Schema$RunReportResponse,
  columns: string[]
) {
  const rows =
    data.rows?.map((row) => {
      const result: Record<string, string | number> = {};
      const dimensionCount = data.dimensionHeaders?.length || 0;

      columns.forEach((col, idx) => {
        if (idx < dimensionCount) {
          result[col] = row.dimensionValues?.[idx]?.value || "";
        } else {
          const metricIdx = idx - dimensionCount;
          const value = row.metricValues?.[metricIdx]?.value || "0";
          result[col] = isNaN(parseFloat(value)) ? value : parseFloat(value);
        }
      });

      return result;
    }) || [];

  return {
    rows,
    rowCount: data.rowCount || 0,
  };
}
