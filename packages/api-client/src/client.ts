import { withQuery, joinUrl } from "@rootline/utils";
import { ApiError } from "./error";
import type { ApiEnvelope } from "./types";

export type FetchOpts = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

export type RequestMeta = {
  pagination?: { nextCursor?: string | null; total?: number };
};

export type ApiClient = {
  request<T>(path: string, opts?: FetchOpts): Promise<T>;
  requestWithMeta<T>(path: string, opts?: FetchOpts): Promise<{ data: T; meta?: RequestMeta }>;
  baseUrl: string;
};

export function createApiClient(baseUrl: string): ApiClient {
  async function requestRaw<T>(path: string, opts: FetchOpts = {}): Promise<{ data: T; meta?: RequestMeta }> {
    const url = withQuery(joinUrl(baseUrl, path), opts.query ?? {});
    const isFormData = opts.body instanceof FormData;
    const res = await fetch(url, {
      method: opts.method ?? "GET",
      credentials: "include",
      signal: opts.signal,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(opts.headers ?? {}),
      },
      body:
        opts.body === undefined
          ? undefined
          : isFormData
            ? (opts.body as FormData)
            : JSON.stringify(opts.body),
    });

    const text = await res.text();
    const json: unknown = text ? safeParse(text) : null;

    if (!res.ok) {
      const env = json as { message?: string; code?: string; details?: unknown } | null;
      throw new ApiError(res.status, env?.message ?? res.statusText, env?.code, env?.details);
    }

    const env = (json ?? { success: true, data: null }) as ApiEnvelope<T>;
    return { data: env.data as T, meta: env.meta as RequestMeta | undefined };
  }

  return {
    baseUrl,
    async request<T>(path: string, opts: FetchOpts = {}): Promise<T> {
      const { data } = await requestRaw<T>(path, opts);
      return data;
    },
    async requestWithMeta<T>(path: string, opts: FetchOpts = {}): Promise<{ data: T; meta?: RequestMeta }> {
      return requestRaw<T>(path, opts);
    },
  };
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

const DEFAULT_BASE =
  typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000") : "";

export const api = createApiClient(DEFAULT_BASE);
