const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://ec2-13-62-52-105.eu-north-1.compute.amazonaws.com/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

class ApiClient {
  private baseUrl: string;
  private getToken: () => Promise<string | null>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.getToken = async () => null;
  }

  setTokenProvider(provider: () => Promise<string | null>) {
    this.getToken = provider;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      const result = await response.json();

      // Handle suspended account
      if (result.error?.code === "ACCOUNT_SUSPENDED") {
        window.dispatchEvent(
          new CustomEvent("account-suspended", { detail: result.error })
        );
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          details: error,
        },
      };
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>("GET", endpoint);
  }
  post<T>(endpoint: string, data?: unknown) {
    return this.request<T>("POST", endpoint, data);
  }
  put<T>(endpoint: string, data?: unknown) {
    return this.request<T>("PUT", endpoint, data);
  }
  delete<T>(endpoint: string) {
    return this.request<T>("DELETE", endpoint);
  }
}

export const api = new ApiClient(API_URL);
