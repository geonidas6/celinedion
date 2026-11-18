const DEFAULT_TIMEOUT_MS = 8000;
export class ApiError extends Error {
    status;
    constructor(message, status = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}
/**
 * Isolated, typed client for the Céline Dion API.
 * The API is served on the same origin under `/api` in production
 * (see backend/openapi.json). `VITE_API_BASE` can point at another origin
 * during development.
 */
export class ApiClient {
    baseUrl;
    constructor(baseUrl = import.meta.env.VITE_API_BASE ?? "") {
        this.baseUrl = baseUrl.replace(/\/$/, "");
    }
    getHealth(options) {
        return this.request("/api/health", options);
    }
    getSongs(options) {
        return this.request("/api/songs", options);
    }
    async request(path, options = {}) {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(new DOMException("Request timed out", "TimeoutError")), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
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
            return (await response.json());
        }
        catch (error) {
            if (error instanceof ApiError)
                throw error;
            if (error instanceof DOMException && error.name === "AbortError")
                throw error;
            throw new ApiError(error instanceof Error ? error.message : `Unable to reach ${path}`, null);
        }
        finally {
            window.clearTimeout(timeout);
            options.signal?.removeEventListener("abort", onAbort);
        }
    }
}
export const apiClient = new ApiClient();
