import Link from "next/link";
import { Button } from "@rootline/ui/components";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">404</p>
        <h1 className="mt-4 font-display text-5xl">Page not found</h1>
        <Button asChild className="mt-8">
          <Link href="/">Back to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
