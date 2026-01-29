import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface UserTokens {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  token_expiry: string;
  gsc_connected: boolean;
  ga4_connected: boolean;
  created_at: string;
  updated_at: string;
}

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;

    if (!url || !key) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
    }

    supabase = createClient(url, key);
  }
  return supabase;
}

export async function getTokensByUserId(
  userId: string
): Promise<UserTokens | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("user_tokens")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // No rows found
    }
    throw error;
  }

  return data as UserTokens;
}

export async function upsertTokens(
  userId: string,
  accessToken: string,
  refreshToken: string,
  tokenExpiry: Date,
  gscConnected: boolean = true,
  ga4Connected: boolean = true
): Promise<UserTokens> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("user_tokens")
    .upsert(
      {
        user_id: userId,
        access_token: accessToken,
        refresh_token: refreshToken,
        token_expiry: tokenExpiry.toISOString(),
        gsc_connected: gscConnected,
        ga4_connected: ga4Connected,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as UserTokens;
}

export async function updateAccessToken(
  userId: string,
  accessToken: string,
  tokenExpiry: Date
): Promise<void> {
  const client = getSupabaseClient();

  const { error } = await client
    .from("user_tokens")
    .update({
      access_token: accessToken,
      token_expiry: tokenExpiry.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}

export async function deleteTokens(userId: string): Promise<void> {
  const client = getSupabaseClient();

  const { error } = await client
    .from("user_tokens")
    .delete()
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}
