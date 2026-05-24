import { ResourceFormShell } from "@/components/resource-form-shell";
import { TeamForm } from "@/components/forms/team-form";

export default function NewTeamPage() {
  return (
    <ResourceFormShell title="New team member" backHref="/team">
      <TeamForm />
    </ResourceFormShell>
  );
}
