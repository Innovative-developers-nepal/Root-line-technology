import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import { qk } from "../query-keys";
import type { CursorPage, ListFilters } from "../types";

export type JobApplication = {
  id: string;
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  coverNote?: string;
  resumeFile: string;
  status: "NEW" | "REVIEW" | "INTERVIEW" | "REJECTED" | "HIRED";
  createdAt: string;
};

export type SubmitApplicationInput = Omit<JobApplication, "id" | "status" | "createdAt">;

export async function submitApplication(input: SubmitApplicationInput): Promise<JobApplication> {
  return api.request<JobApplication>("/api/v1/applications", { method: "POST", body: input });
}

export function useSubmitApplication() {
  return useMutation({ mutationFn: submitApplication });
}

export function useApplicationList(filters: ListFilters = {}) {
  return useInfiniteQuery({
    queryKey: qk.application.list(filters),
    queryFn: async ({ pageParam }) => {
      const { data, meta } = await api.requestWithMeta<JobApplication[]>("/api/v1/applications/admin/all", {
        query: { ...filters, cursor: pageParam as string | undefined },
      });
      return { items: data ?? [], nextCursor: meta?.pagination?.nextCursor ?? null };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: JobApplication["status"] }) =>
      api.request<JobApplication>(`/api/v1/applications/${id}`, { method: "PATCH", body: { status } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.application.all }),
  });
}
