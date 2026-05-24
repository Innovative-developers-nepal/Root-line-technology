import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import { qk } from "../query-keys";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  socialLinks: Record<string, string>;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function fetchTeamList(): Promise<TeamMember[]> {
  return api.request<TeamMember[]>("/api/v1/team");
}

export function useTeamList() {
  return useQuery({ queryKey: qk.team.list(), queryFn: fetchTeamList });
}

export function useUpsertTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<TeamMember> & { id?: string }) =>
      input.id
        ? api.request<TeamMember>(`/api/v1/team/${input.id}`, { method: "PATCH", body: input })
        : api.request<TeamMember>("/api/v1/team", { method: "POST", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.team.all }),
  });
}

export function useDeleteTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.request<void>(`/api/v1/team/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.team.all }),
  });
}
