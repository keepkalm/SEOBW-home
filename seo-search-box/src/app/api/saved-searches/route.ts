import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  saveSearchForUser,
  getUserSavedSearches,
  deleteSavedSearch,
} from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const savedSearches = await getUserSavedSearches(session.user.id, limit);

    return NextResponse.json({
      savedSearches: savedSearches.map((s) => ({
        id: s.id,
        name: s.name,
        createdAt: s.createdAt,
        search: s.search,
      })),
    });
  } catch (error) {
    console.error("Saved searches GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved searches" },
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
    const { searchId, name } = body as { searchId: string; name?: string };

    if (!searchId) {
      return NextResponse.json(
        { error: "Search ID is required" },
        { status: 400 }
      );
    }

    const savedSearch = await saveSearchForUser(
      session.user.id,
      searchId,
      name
    );

    return NextResponse.json({
      success: true,
      savedSearch,
    });
  } catch (error) {
    console.error("Saved searches POST error:", error);
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Saved search ID is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteSavedSearch(id, session.user.id);

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Saved search not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deleted: deleted[0],
    });
  } catch (error) {
    console.error("Saved searches DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete saved search" },
      { status: 500 }
    );
  }
}
