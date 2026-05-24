"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@rootline/ui/components";

export function ResourceFormShell({
  title,
  description,
  backHref,
  children,
}: {
  title: string;
  description?: string;
  backHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href={backHref as never}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <div>
        <h1 className="font-display text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}
