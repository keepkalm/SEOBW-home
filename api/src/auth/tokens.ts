import { google } from "googleapis";
import {
  getTokensByUserId,
  updateAccessToken,
  UserTokens,
} from "../db/supabase.js";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export interface ValidTokens {
  accessToken: string;
  refreshToken: string;
}

export async function getValidTokens(userId: string): Promise<ValidTokens> {
  const tokens = await getTokensByUserId(userId);

  if (!tokens) {
    throw new Error(
      `No tokens found for user ${userId}. Please authenticate at /auth/google?user_id=${userId}`
    );
  }

  const expiry = new Date(tokens.token_expiry);
  const now = new Date();

  // Refresh if token expires within 5 minutes
  if (expiry.getTime() - now.getTime() < 5 * 60 * 1000) {
    const refreshedTokens = await refreshAccessToken(userId, tokens);
    return {
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken,
    };
  }

  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
  };
}

async function refreshAccessToken(
  userId: string,
  tokens: UserTokens
): Promise<ValidTokens> {
  oauth2Client.setCredentials({
    refresh_token: tokens.refresh_token,
  });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();

    if (!credentials.access_token) {
      throw new Error("Failed to refresh access token");
    }

    const newExpiry = credentials.expiry_date
      ? new Date(credentials.expiry_date)
      : new Date(Date.now() + 3600 * 1000);

    await updateAccessToken(userId, credentials.access_token, newExpiry);

    return {
      accessToken: credentials.access_token,
      refreshToken: tokens.refresh_token,
    };
  } catch (error) {
    throw new Error(
      `Token refresh failed for user ${userId}. Please re-authenticate at /auth/google?user_id=${userId}`
    );
  }
}

export function getAuthenticatedClient(accessToken: string) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  client.setCredentials({ access_token: accessToken });
  return client;
}
