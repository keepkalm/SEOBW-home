import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getKeywordHistory,
  getDomainHistory,
  getSerpHistory,
  getDomainRankHistory,
  getTopKeywords,
  getTopDomains,
  getUserSearchStats,
} from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const days = parseInt(searchParams.get("days") || "90", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    switch (type) {
      case "keyword-history": {
        const keyword = searchParams.get("keyword");
        if (!keyword) {
          return NextResponse.json(
            { error: "Keyword parameter is required" },
            { status: 400 }
          );
        }
        const history = await getKeywordHistory(keyword, days);
        return NextResponse.json({ history });
      }

      case "domain-history": {
        const domain = searchParams.get("domain");
        if (!domain) {
          return NextResponse.json(
            { error: "Domain parameter is required" },
            { status: 400 }
          );
        }
        const history = await getDomainHistory(domain, days);
        return NextResponse.json({ history });
      }

      case "serp-history": {
        const keyword = searchParams.get("keyword");
        const domain = searchParams.get("domain");
        if (!keyword || !domain) {
          return NextResponse.json(
            { error: "Both keyword and domain parameters are required" },
            { status: 400 }
          );
        }
        const history = await getSerpHistory(keyword, domain, days);
        return NextResponse.json({ history });
      }

      case "domain-rank-history": {
        const domain = searchParams.get("domain");
        if (!domain) {
          return NextResponse.json(
            { error: "Domain parameter is required" },
            { status: 400 }
          );
        }
        const history = await getDomainRankHistory(domain, days);
        return NextResponse.json({ history });
      }

      case "top-keywords": {
        const topKeywords = await getTopKeywords(session.user.id, limit);
        return NextResponse.json({ topKeywords });
      }

      case "top-domains": {
        const topDomains = await getTopDomains(session.user.id, limit);
        return NextResponse.json({ topDomains });
      }

      case "stats": {
        const stats = await getUserSearchStats(session.user.id);
        return NextResponse.json({ stats });
      }

      case "overview":
      default: {
        // Return an overview of user analytics
        const [stats, topKeywords, topDomains] = await Promise.all([
          getUserSearchStats(session.user.id),
          getTopKeywords(session.user.id, 5),
          getTopDomains(session.user.id, 5),
        ]);

        return NextResponse.json({
          stats,
          topKeywords,
          topDomains,
        });
      }
    }
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
