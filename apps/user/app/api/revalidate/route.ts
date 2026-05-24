import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? "";

export async function POST(req: NextRequest) {
  if (!REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Revalidation disabled" }, { status: 503 });
  }

  const secret = req.headers.get("x-revalidate-secret");
  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { paths } = (await req.json().catch(() => ({}))) as { paths?: string[] };
  if (!Array.isArray(paths) || paths.length === 0) {
    return NextResponse.json({ error: "paths array required" }, { status: 400 });
  }

  for (const p of paths) {
    if (typeof p === "string" && p.startsWith("/")) {
      revalidatePath(p);
    }
  }

  return NextResponse.json({ revalidated: paths, at: Date.now() });
}
