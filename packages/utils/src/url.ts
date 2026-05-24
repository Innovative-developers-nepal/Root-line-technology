export function joinUrl(...parts: string[]): string {
  return parts
    .map((p, i) => (i === 0 ? p.replace(/\/+$/, "") : p.replace(/^\/+|\/+$/g, "")))
    .filter(Boolean)
    .join("/");
}

export type QueryValue = string | number | boolean | undefined | null;

export function withQuery(url: string, params: Record<string, QueryValue>): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    usp.set(k, String(v));
  }
  const qs = usp.toString();
  if (!qs) return url;
  return url.includes("?") ? `${url}&${qs}` : `${url}?${qs}`;
}

export function parseQuery(qs: string): Record<string, string> {
  const usp = new URLSearchParams(qs.startsWith("?") ? qs.slice(1) : qs);
  const out: Record<string, string> = {};
  usp.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}
