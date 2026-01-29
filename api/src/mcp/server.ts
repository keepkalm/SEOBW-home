import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as gsc from "../tools/gsc.js";
import * as ga4 from "../tools/ga4.js";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "seobandwagon",
    version: "1.0.0",
  });

  // GSC Tools
  server.tool(
    "gsc_list_sites",
    "List all verified sites in Google Search Console",
    {
      user_id: z.string().describe("The user ID for authentication"),
    },
    async ({ user_id }) => {
      try {
        const sites = await gsc.listSites(user_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(sites, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "gsc_search_performance",
    "Query search analytics data from Google Search Console",
    {
      user_id: z.string().describe("The user ID for authentication"),
      site_url: z
        .string()
        .describe("The site URL (e.g., https://example.com/ or sc-domain:example.com)"),
      start_date: z.string().describe("Start date in YYYY-MM-DD format"),
      end_date: z.string().describe("End date in YYYY-MM-DD format"),
      dimensions: z
        .array(z.enum(["query", "page", "country", "device", "date"]))
        .optional()
        .describe("Dimensions to group by (default: ['query'])"),
      row_limit: z
        .number()
        .optional()
        .describe("Maximum rows to return (default: 1000, max: 25000)"),
    },
    async ({ user_id, site_url, start_date, end_date, dimensions, row_limit }) => {
      try {
        const result = await gsc.searchPerformance(user_id, {
          siteUrl: site_url,
          startDate: start_date,
          endDate: end_date,
          dimensions: dimensions,
          rowLimit: row_limit,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "gsc_url_inspection",
    "Inspect a URL's index status in Google Search Console",
    {
      user_id: z.string().describe("The user ID for authentication"),
      site_url: z.string().describe("The site URL"),
      inspection_url: z.string().describe("The specific URL to inspect"),
    },
    async ({ user_id, site_url, inspection_url }) => {
      try {
        const result = await gsc.urlInspection(user_id, {
          siteUrl: site_url,
          inspectionUrl: inspection_url,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "gsc_list_sitemaps",
    "List all sitemaps for a site in Google Search Console",
    {
      user_id: z.string().describe("The user ID for authentication"),
      site_url: z.string().describe("The site URL"),
    },
    async ({ user_id, site_url }) => {
      try {
        const sitemaps = await gsc.listSitemaps(user_id, site_url);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(sitemaps, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "gsc_submit_sitemap",
    "Submit a sitemap to Google Search Console",
    {
      user_id: z.string().describe("The user ID for authentication"),
      site_url: z.string().describe("The site URL"),
      sitemap_url: z.string().describe("The full URL of the sitemap to submit"),
    },
    async ({ user_id, site_url, sitemap_url }) => {
      try {
        const result = await gsc.submitSitemap(user_id, site_url, sitemap_url);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "gsc_delete_sitemap",
    "Delete a sitemap from Google Search Console",
    {
      user_id: z.string().describe("The user ID for authentication"),
      site_url: z.string().describe("The site URL"),
      sitemap_url: z.string().describe("The full URL of the sitemap to delete"),
    },
    async ({ user_id, site_url, sitemap_url }) => {
      try {
        const result = await gsc.deleteSitemap(user_id, site_url, sitemap_url);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "gsc_index_coverage",
    "Get index coverage summary for a site",
    {
      user_id: z.string().describe("The user ID for authentication"),
      site_url: z.string().describe("The site URL"),
    },
    async ({ user_id, site_url }) => {
      try {
        const result = await gsc.indexCoverage(user_id, site_url);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // GA4 Tools
  server.tool(
    "ga4_list_properties",
    "List all accessible Google Analytics 4 properties",
    {
      user_id: z.string().describe("The user ID for authentication"),
    },
    async ({ user_id }) => {
      try {
        const properties = await ga4.listProperties(user_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(properties, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "ga4_page_report",
    "Get page-level traffic data from Google Analytics 4",
    {
      user_id: z.string().describe("The user ID for authentication"),
      property_id: z.string().describe("The GA4 property ID (numbers only)"),
      start_date: z.string().describe("Start date in YYYY-MM-DD format"),
      end_date: z.string().describe("End date in YYYY-MM-DD format"),
      page_path: z
        .string()
        .optional()
        .describe("Filter by page path (partial match)"),
    },
    async ({ user_id, property_id, start_date, end_date, page_path }) => {
      try {
        const result = await ga4.pageReport(user_id, {
          propertyId: property_id,
          startDate: start_date,
          endDate: end_date,
          pagePath: page_path,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "ga4_traffic_sources",
    "Get traffic sources breakdown from Google Analytics 4",
    {
      user_id: z.string().describe("The user ID for authentication"),
      property_id: z.string().describe("The GA4 property ID (numbers only)"),
      start_date: z.string().describe("Start date in YYYY-MM-DD format"),
      end_date: z.string().describe("End date in YYYY-MM-DD format"),
      page_path: z
        .string()
        .optional()
        .describe("Filter by page path (partial match)"),
    },
    async ({ user_id, property_id, start_date, end_date, page_path }) => {
      try {
        const result = await ga4.trafficSources(user_id, {
          propertyId: property_id,
          startDate: start_date,
          endDate: end_date,
          pagePath: page_path,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "ga4_engagement_metrics",
    "Get engagement metrics (time on page, bounce rate, etc.) from Google Analytics 4",
    {
      user_id: z.string().describe("The user ID for authentication"),
      property_id: z.string().describe("The GA4 property ID (numbers only)"),
      start_date: z.string().describe("Start date in YYYY-MM-DD format"),
      end_date: z.string().describe("End date in YYYY-MM-DD format"),
      page_path: z
        .string()
        .optional()
        .describe("Filter by page path (partial match)"),
    },
    async ({ user_id, property_id, start_date, end_date, page_path }) => {
      try {
        const result = await ga4.engagementMetrics(user_id, {
          propertyId: property_id,
          startDate: start_date,
          endDate: end_date,
          pagePath: page_path,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "ga4_conversions",
    "Get conversion events data from Google Analytics 4",
    {
      user_id: z.string().describe("The user ID for authentication"),
      property_id: z.string().describe("The GA4 property ID (numbers only)"),
      start_date: z.string().describe("Start date in YYYY-MM-DD format"),
      end_date: z.string().describe("End date in YYYY-MM-DD format"),
      page_path: z
        .string()
        .optional()
        .describe("Filter by page path (partial match)"),
    },
    async ({ user_id, property_id, start_date, end_date, page_path }) => {
      try {
        const result = await ga4.conversions(user_id, {
          propertyId: property_id,
          startDate: start_date,
          endDate: end_date,
          pagePath: page_path,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "ga4_realtime",
    "Get real-time active users data from Google Analytics 4",
    {
      user_id: z.string().describe("The user ID for authentication"),
      property_id: z.string().describe("The GA4 property ID (numbers only)"),
    },
    async ({ user_id, property_id }) => {
      try {
        const result = await ga4.realtime(user_id, property_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  return server;
}
