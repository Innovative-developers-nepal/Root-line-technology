"use client";
import { useRouter } from "next/navigation";
import { signOut, useUser } from "@rootline/auth-client";
import { Button } from "@rootline/ui/components";
import { initials } from "@rootline/utils";

export function Topbar() {
  const router = useRouter();
  const user = useUser();
  const onSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="text-sm text-muted-foreground">Admin console</div>
      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {initials(user.name ?? user.email)}
            </div>
            <span className="hidden text-sm text-muted-foreground md:inline">{user.email}</span>
          </div>
        )}
        <Button variant="outline" size="sm" onClick={onSignOut}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
