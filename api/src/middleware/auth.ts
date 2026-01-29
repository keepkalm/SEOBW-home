import { Request, Response, NextFunction } from "express";
import { getTokensByUserId } from "../db/supabase.js";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export async function validateUserSession(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.query.user_id as string;

  if (!userId) {
    res.status(401).json({
      error: "user_id query parameter is required",
      hint: "Add ?user_id=YOUR_USER_ID to the request URL",
    });
    return;
  }

  try {
    const tokens = await getTokensByUserId(userId);

    if (!tokens) {
      res.status(401).json({
        error: "User not authenticated",
        hint: `Visit /auth/google?user_id=${userId} to connect your Google account`,
      });
      return;
    }

    req.userId = userId;
    next();
  } catch (error) {
    console.error("Auth validation error:", error);
    res.status(500).json({
      error: "Failed to validate user session",
    });
  }
}

export function getUserIdFromRequest(req: Request): string {
  const userId = req.query.user_id as string;
  if (!userId) {
    throw new Error("user_id is required");
  }
  return userId;
}
