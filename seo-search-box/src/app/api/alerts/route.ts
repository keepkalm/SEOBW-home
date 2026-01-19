import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createAlert,
  getUserAlerts,
  updateAlert,
  deleteAlert,
  type AlertType,
} from "@/lib/db/queries";

const VALID_ALERT_TYPES: AlertType[] = [
  "rank_change",
  "traffic_change",
  "new_backlink",
];

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const alerts = await getUserAlerts(session.user.id);

    return NextResponse.json({
      alerts: alerts.map((a) => ({
        id: a.id,
        alertType: a.alertType,
        threshold: a.threshold,
        isActive: a.isActive,
        lastTriggered: a.lastTriggered,
        createdAt: a.createdAt,
        search: a.search,
      })),
    });
  } catch (error) {
    console.error("Alerts GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
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
    const { searchId, alertType, threshold } = body as {
      searchId: string;
      alertType: AlertType;
      threshold?: number;
    };

    if (!searchId) {
      return NextResponse.json(
        { error: "Search ID is required" },
        { status: 400 }
      );
    }

    if (!alertType || !VALID_ALERT_TYPES.includes(alertType)) {
      return NextResponse.json(
        {
          error: `Invalid alert type. Must be one of: ${VALID_ALERT_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const alert = await createAlert(
      session.user.id,
      searchId,
      alertType,
      threshold
    );

    return NextResponse.json({
      success: true,
      alert,
    });
  } catch (error) {
    console.error("Alerts POST error:", error);
    return NextResponse.json(
      { error: "Failed to create alert" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, isActive } = body as { id: string; isActive?: boolean };

    if (!id) {
      return NextResponse.json(
        { error: "Alert ID is required" },
        { status: 400 }
      );
    }

    const updates: { isActive?: boolean; lastTriggered?: Date } = {};
    if (typeof isActive === "boolean") {
      updates.isActive = isActive;
    }

    const updated = await updateAlert(id, session.user.id, updates);

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Alert not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      alert: updated[0],
    });
  } catch (error) {
    console.error("Alerts PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update alert" },
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
        { error: "Alert ID is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteAlert(id, session.user.id);

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Alert not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deleted: deleted[0],
    });
  } catch (error) {
    console.error("Alerts DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete alert" },
      { status: 500 }
    );
  }
}
