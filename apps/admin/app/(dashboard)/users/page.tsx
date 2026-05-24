import { Card } from "@rootline/ui/components";
import { AdminPageHeader } from "@/components/page-header";

export default function UsersAdminPage() {
  return (
    <>
      <AdminPageHeader title="Users" description="Role management lands Phase 8." />
      <Card className="p-10 text-center text-sm text-muted-foreground">
        SUPER_ADMIN-only screen. Wires to /api/v1/users + roles + permissions.
      </Card>
    </>
  );
}
