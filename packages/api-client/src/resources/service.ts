import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import { qk } from "../query-keys";

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: unknown;
  iconKey?: string;
  order: number;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt: string;
  updatedAt: string;
};

export async function fetchServiceList(): Promise<Service[]> {
  return api.request<Service[]>("/api/v1/services");
}

export async function fetchService(slug: string): Promise<Service> {
  return api.request<Service>(`/api/v1/services/${slug}`);
}

export function useServiceList() {
  return useQuery({ queryKey: qk.service.list(), queryFn: fetchServiceList });
}

export function useService(slug: string) {
  return useQuery({ queryKey: qk.service.detail(slug), queryFn: () => fetchService(slug), enabled: !!slug });
}

export function useUpsertService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<Service> & { id?: string }) =>
      input.id
        ? api.request<Service>(`/api/v1/services/admin/${input.id}`, { method: "PUT", body: input })
        : api.request<Service>("/api/v1/services/admin", { method: "POST", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.service.all }),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.request<void>(`/api/v1/services/admin/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.service.all }),
  });
}
