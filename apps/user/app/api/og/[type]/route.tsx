import { ImageResponse } from "next/og";
import { OgTemplate } from "@rootline/seo/og";

export const runtime = "edge";

export async function GET(req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const url = new URL(req.url);
  const title = url.searchParams.get("title") ?? "Rootline Technology";
  const subtitle = url.searchParams.get("subtitle") ?? undefined;
  const kind = (["page", "blog", "service", "job"] as const).find((k) => k === type) ?? "page";

  return new ImageResponse(<OgTemplate title={title} subtitle={subtitle} kind={kind} />, {
    width: 1200,
    height: 630,
  });
}
