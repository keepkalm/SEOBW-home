/**
 * DataForSEO API Client
 *
 * Base client for making authenticated requests to DataForSEO API.
 * All endpoint-specific methods are in separate files.
 */

const DATAFORSEO_API_URL = "https://api.dataforseo.com/v3";

export interface DataForSEOConfig {
  login: string;
  password: string;
}

export interface DataForSEOResponse<T> {
  version: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  tasks_count: number;
  tasks_error: number;
  tasks: Array<{
    id: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: Record<string, unknown>;
    result: T[];
  }>;
}

class DataForSEOClient {
  private login: string;
  private password: string;
  private authHeader: string;

  constructor(config?: DataForSEOConfig) {
    this.login = config?.login || process.env.DATAFORSEO_LOGIN || "";
    this.password = config?.password || process.env.DATAFORSEO_PASSWORD || "";

    if (!this.login || !this.password) {
      console.warn("DataForSEO credentials not configured");
    }

    this.authHeader = `Basic ${Buffer.from(`${this.login}:${this.password}`).toString("base64")}`;
  }

  /**
   * Make an authenticated request to the DataForSEO API
   */
  async request<T>(
    endpoint: string,
    method: "GET" | "POST" = "POST",
    body?: unknown
  ): Promise<DataForSEOResponse<T>> {
    const url = `${DATAFORSEO_API_URL}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`DataForSEO API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status_code !== 20000) {
      throw new Error(`DataForSEO error: ${data.status_message}`);
    }

    return data;
  }

  /**
   * Get account balance and limits
   */
  async getAccountInfo() {
    return this.request("/appendix/user_data", "GET");
  }
}

// Export singleton instance
export const dataforseo = new DataForSEOClient();

// Export class for custom instances
export { DataForSEOClient };
