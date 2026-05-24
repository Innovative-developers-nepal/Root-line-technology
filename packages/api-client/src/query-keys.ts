export const qk = {
  blog: {
    all: ["blog"] as const,
    list: (filters?: object) => ["blog", "list", filters ?? {}] as const,
    detail: (slug: string) => ["blog", "detail", slug] as const,
  },
  caseStudy: {
    all: ["caseStudy"] as const,
    list: (filters?: object) => ["caseStudy", "list", filters ?? {}] as const,
    detail: (slug: string) => ["caseStudy", "detail", slug] as const,
  },
  service: {
    all: ["service"] as const,
    list: (filters?: object) => ["service", "list", filters ?? {}] as const,
    detail: (slug: string) => ["service", "detail", slug] as const,
  },
  team: {
    all: ["team"] as const,
    list: (filters?: object) => ["team", "list", filters ?? {}] as const,
  },
  job: {
    all: ["job"] as const,
    list: (filters?: object) => ["job", "list", filters ?? {}] as const,
    detail: (slug: string) => ["job", "detail", slug] as const,
  },
  application: {
    all: ["application"] as const,
    list: (filters?: object) => ["application", "list", filters ?? {}] as const,
  },
  contact: {
    all: ["contact"] as const,
    list: (filters?: object) => ["contact", "list", filters ?? {}] as const,
  },
} as const;
