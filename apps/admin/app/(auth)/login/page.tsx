import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { Card } from "@rootline/ui/components";

export const metadata: Metadata = {
  title: "Sign in — Rootline Admin",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md p-8">
        <h1 className="font-display text-3xl">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Rootline admin console</p>
        <div className="mt-8">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </Card>
    </main>
  );
}
