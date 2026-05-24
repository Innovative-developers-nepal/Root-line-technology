import { useQuery } from "@tanstack/react-query";
import { api } from "../client";

export type DashboardStats = {
  users: { total: number; active: number };
  contacts: { total: number; pending: number };
  blog: { total: number; published: number };
  caseStudies: { total: number };
  recentContacts: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    status: string;
    createdAt: string;
  }>;
};

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return api.request<DashboardStats>("/api/v1/dashboard/");
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
    refetchInterval: 60_000,
  });
}
