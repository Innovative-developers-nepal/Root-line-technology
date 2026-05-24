import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, SectionHeading } from "@rootline/ui/blocks";
import { Container, Badge, Card } from "@rootline/ui/components";
import {
  buildMetadata,
  breadcrumbJsonLd,
  jobPostingJsonLd,
  renderJsonLd,
  SITE,
} from "@rootline/seo";
import { fetchJob, type Job } from "@rootline/api-client";
import { ApplyForm } from "@/components/apply-form";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

async function getJob(slug: string): Promise<Job | null> {
  try {
    return await fetchJob(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  return buildMetadata({
    title: job?.title ?? "Role",
    description: job ? `${job.title} at Rootline Technology — ${job.location}.` : undefined,
    path: `/careers/${slug}`,
  });
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();

  return (
    <main className="min-h-dvh">
      <Section>
        <Container>
          <SectionHeading eyebrow={job.department ?? "Open role"} title={job.title} />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge>{job.type.replace("_", " ")}</Badge>
            <span className="text-sm text-muted-foreground">{job.location}</span>
            {job.salaryRange && (
              <span className="text-sm text-muted-foreground">· {job.salaryRange}</span>
            )}
          </div>

          <Card className="mt-12 p-8">
            <h2 className="font-display text-2xl">Apply</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Send a short note and your resume. We reply to every applicant.
            </p>
            <div className="mt-6">
              <ApplyForm jobId={job.id} jobSlug={job.slug} />
            </div>
          </Card>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Careers", url: `${SITE.url}/careers` },
              { name: job.title, url: `${SITE.url}/careers/${job.slug}` },
            ]),
            jobPostingJsonLd({
              title: job.title,
              description: job.title,
              slug: job.slug,
              location: job.location,
              type: job.type,
              postedAt: job.postedAt,
            }),
          ),
        }}
      />
    </main>
  );
}
