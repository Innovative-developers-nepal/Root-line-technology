import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import { qk } from "../query-keys";
import type { CursorPage, ListFilters } from "../types";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: "SERVICES_INQUIRY" | "CAREERS" | "OTHER" | "GENERAL";
  message: string;
  read: boolean;
  createdAt: string;
};

export type SubmitContactInput = Omit<ContactMessage, "id" | "read" | "createdAt">;

export async function submitContact(input: SubmitContactInput): Promise<ContactMessage> {
  return api.request<ContactMessage>("/api/v1/contacts", { method: "POST", body: input });
}

export function useSubmitContact() {
  return useMutation({ mutationFn: submitContact });
}

export function useContactList(filters: ListFilters = {}) {
  return useInfiniteQuery({
    queryKey: qk.contact.list(filters),
    queryFn: async ({ pageParam }) => {
      const { data, meta } = await api.requestWithMeta<ContactMessage[]>("/api/v1/contacts", {
        query: { ...filters, cursor: pageParam as string | undefined },
      });
      return { items: data ?? [], nextCursor: meta?.pagination?.nextCursor ?? null };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}

export function useMarkContactRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.request<ContactMessage>(`/api/v1/contacts/${id}/read`, { method: "PATCH" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.contact.all }),
  });
}
