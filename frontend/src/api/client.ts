import type { HealthDTO, SongDTO } from "./types";

const DEFAULT_TIMEOUT_MS = 8000;

export class ApiError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

/**
 * Isolated, typed client for the Céline Dion API.
 * The API is served on the same origin under `/api` in production
 * (see backend/openapi.json). `VITE_API_BASE` can point at another origin
 * during development.
 */
export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_API_BASE ?? "") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  getHealth(options?: RequestOptions): Promise<HealthDTO> {
    return this.request<HealthDTO>("/api/health", options);
  }

  getSongs(options?: RequestOptions): Promise<SongDTO[]> {
    return this.request<SongDTO[]>("/api/songs", options);
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(new DOMException("Request timed out", "TimeoutError")),
      options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    );
    const onAbort = () => controller.abort(options.signal?.reason);
    options.signal?.addEventListener("abort", onAbort, { once: true });

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new ApiError(`API ${path} responded with ${response.status}`, response.status);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof DOMException && error.name === "AbortError") throw error;
      throw new ApiError(
        error instanceof Error ? error.message : `Unable to reach ${path}`,
        null,
      );
    } finally {
      window.clearTimeout(timeout);
      options.signal?.removeEventListener("abort", onAbort);
    }
  }
}

export const apiClient = new ApiClient();
