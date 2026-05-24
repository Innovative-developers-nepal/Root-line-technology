import { ResourceFormShell } from "@/components/resource-form-shell";
import { ServiceForm } from "@/components/forms/service-form";

export default function NewServicePage() {
  return (
    <ResourceFormShell title="New service" backHref="/services">
      <ServiceForm />
    </ResourceFormShell>
  );
}
