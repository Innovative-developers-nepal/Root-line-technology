import { ResourceFormShell } from "@/components/resource-form-shell";
import { JobForm } from "@/components/forms/job-form";

export default function NewJobPage() {
  return (
    <ResourceFormShell title="New job" backHref="/jobs">
      <JobForm />
    </ResourceFormShell>
  );
}
