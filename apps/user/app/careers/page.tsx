import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@rootline/ui/blocks";
import { Container, Card, Badge } from "@rootline/ui/components";
import { buildMetadata, breadcrumbJsonLd, renderJsonLd, SITE } from "@rootline/seo";
import { fetchJobList, type Job } from "@rootline/api-client";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description: "Build at Rootline. Open roles across engineering and security.",
  path: "/careers",
});

export const dynamic = "force-dynamic";

async function getJobs(): Promise<Job[]> {
  try {
    const page = await fetchJobList({ take: 50 });
    return page.items;
  } catch {
    return [];
  }
}

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <main className="min-h-dvh">
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Careers"
            title="Build at Rootline"
            description="Small, senior team. Real work, no buzzwords."
            size="lg"
          />

          <div className="mt-12 flex flex-col gap-4">
            {jobs.length === 0 ? (
              <Card className="p-10 text-center">
                <p className="text-muted-foreground">No open roles right now. Check back soon.</p>
              </Card>
            ) : (
              jobs.map((job) => (
                <Link key={job.id} href={`/careers/${job.slug}`}>
                  <Card className="p-6 transition-colors hover:bg-muted/50">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-xl">{job.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {job.department ? `${job.department} · ` : ""}
                          {job.location}
                        </p>
                      </div>
                      <Badge>{(job.type ?? "").replace("_", " ")}</Badge>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Careers", url: `${SITE.url}/careers` },
            ]),
          ),
        }}
      />
    </main>
  );
}
