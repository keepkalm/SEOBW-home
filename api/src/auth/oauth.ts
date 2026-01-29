import { Router, Request, Response } from "express";
import { google } from "googleapis";
import { upsertTokens } from "../db/supabase.js";

const router = Router();

const SCOPES = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/webmasters",
  "https://www.googleapis.com/auth/analytics.readonly",
];

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

// GET /auth/google?user_id=xxx
router.get("/google", (req: Request, res: Response) => {
  const userId = req.query.user_id as string;

  if (!userId) {
    res.status(400).json({ error: "user_id is required" });
    return;
  }

  const oauth2Client = getOAuth2Client();

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // Force consent to ensure refresh token is returned
    state: userId, // Pass user_id through OAuth flow
  });

  res.redirect(authUrl);
});

// GET /auth/google/callback
router.get("/google/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const userId = req.query.state as string;

  if (!code) {
    res.status(400).json({ error: "Authorization code is required" });
    return;
  }

  if (!userId) {
    res.status(400).json({ error: "User ID (state) is missing" });
    return;
  }

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      res.status(400).json({
        error: "Failed to obtain tokens. Please try again.",
      });
      return;
    }

    const tokenExpiry = tokens.expiry_date
      ? new Date(tokens.expiry_date)
      : new Date(Date.now() + 3600 * 1000);

    await upsertTokens(
      userId,
      tokens.access_token,
      tokens.refresh_token,
      tokenExpiry,
      true,
      true
    );

    // Success page
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SEO Bandwagon - Connected</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 3rem;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.15);
              text-align: center;
              max-width: 400px;
            }
            h1 { color: #333; margin-bottom: 1rem; }
            p { color: #666; line-height: 1.6; }
            .success-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            .user-id {
              background: #f5f5f5;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              font-family: monospace;
              margin: 1rem 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✓</div>
            <h1>Successfully Connected!</h1>
            <p>Your Google Search Console and Analytics accounts are now linked.</p>
            <div class="user-id">User ID: ${userId}</div>
            <p>You can now close this window and use the MCP tools in Claude Code.</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).json({
      error: "Failed to complete authentication",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /auth/status?user_id=xxx
router.get("/status", async (req: Request, res: Response) => {
  const userId = req.query.user_id as string;

  if (!userId) {
    res.status(400).json({ error: "user_id is required" });
    return;
  }

  try {
    const { getTokensByUserId } = await import("../db/supabase.js");
    const tokens = await getTokensByUserId(userId);

    if (!tokens) {
      res.json({
        connected: false,
        message: `Not connected. Visit /auth/google?user_id=${userId} to authenticate.`,
      });
      return;
    }

    res.json({
      connected: true,
      gsc_connected: tokens.gsc_connected,
      ga4_connected: tokens.ga4_connected,
      token_expiry: tokens.token_expiry,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to check status",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
