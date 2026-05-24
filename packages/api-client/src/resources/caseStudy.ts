import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import { qk } from "../query-keys";
import type { CursorPage, ListFilters } from "../types";

export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: unknown;
  coverImage?: string;
  client?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function fetchCaseStudyList(filters: ListFilters = {}): Promise<CursorPage<CaseStudy>> {
  const { data, meta } = await api.requestWithMeta<CaseStudy[]>("/api/v1/case-studies", { query: { ...filters } });
  return { items: data ?? [], nextCursor: meta?.pagination?.nextCursor ?? null };
}

export async function fetchCaseStudy(slug: string): Promise<CaseStudy> {
  return api.request<CaseStudy>(`/api/v1/case-studies/${slug}`);
}

export function useCaseStudyList(filters: ListFilters = {}) {
  return useInfiniteQuery({
    queryKey: qk.caseStudy.list(filters),
    queryFn: ({ pageParam }) =>
      fetchCaseStudyList({ ...filters, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}

export function useCaseStudy(slug: string) {
  return useQuery({
    queryKey: qk.caseStudy.detail(slug),
    queryFn: () => fetchCaseStudy(slug),
    enabled: !!slug,
  });
}

export function useUpsertCaseStudy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<CaseStudy> & { id?: string }) =>
      input.id
        ? api.request<CaseStudy>(`/api/v1/case-studies/${input.id}`, { method: "PATCH", body: input })
        : api.request<CaseStudy>("/api/v1/case-studies", { method: "POST", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.caseStudy.all }),
  });
}

export function useDeleteCaseStudy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.request<void>(`/api/v1/case-studies/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.caseStudy.all }),
  });
}
