import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getUserSearches,
  saveSearch,
  deleteSearch,
  getSearchWithData,
  searchUserHistory,
  getUserSearchStats,
  type InputType,
} from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ searches: [] });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const query = searchParams.get("q");
    const includeStats = searchParams.get("stats") === "true";
    const searchId = searchParams.get("id");

    // Get specific search with full data
    if (searchId) {
      const search = await getSearchWithData(searchId);
      if (!search || search.userId !== session.user.id) {
        return NextResponse.json({ error: "Search not found" }, { status: 404 });
      }
      return NextResponse.json({ search });
    }

    // Search within history
    if (query) {
      const results = await searchUserHistory(session.user.id, query, limit);
      return NextResponse.json({
        searches: results.map((s) => ({
          id: s.id,
          inputType: s.inputType,
          inputValue: s.inputValue,
          normalizedValue: s.normalizedValue,
          createdAt: s.createdAt,
        })),
      });
    }

    // Get user searches
    const userSearches = await getUserSearches(session.user.id, limit, offset);

    // Optionally include stats
    let stats = null;
    if (includeStats) {
      stats = await getUserSearchStats(session.user.id);
    }

    return NextResponse.json({
      searches: userSearches.map((s) => ({
        id: s.id,
        inputType: s.inputType,
        inputValue: s.inputValue,
        normalizedValue: s.normalizedValue,
        createdAt: s.createdAt,
      })),
      stats,
      pagination: {
        limit,
        offset,
        hasMore: userSearches.length === limit,
      },
    });
  } catch (error) {
    console.error("History API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { inputType, inputValue, normalizedValue } = body as {
      inputType: InputType;
      inputValue: string;
      normalizedValue?: string;
    };

    if (!inputType || !inputValue) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newSearch = await saveSearch({
      userId: session.user.id,
      inputType,
      inputValue,
      normalizedValue,
    });

    return NextResponse.json({
      success: true,
      search: newSearch,
    });
  } catch (error) {
    console.error("Save history error:", error);
    return NextResponse.json(
      { error: "Failed to save search" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const searchId = searchParams.get("id");

    if (!searchId) {
      return NextResponse.json(
        { error: "Search ID required" },
        { status: 400 }
      );
    }

    const deleted = await deleteSearch(searchId, session.user.id);

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Search not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deleted: deleted[0],
    });
  } catch (error) {
    console.error("Delete history error:", error);
    return NextResponse.json(
      { error: "Failed to delete search" },
      { status: 500 }
    );
  }
}
