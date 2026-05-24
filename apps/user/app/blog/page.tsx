import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@rootline/ui/blocks";
import { Container, Card } from "@rootline/ui/components";
import { buildMetadata, breadcrumbJsonLd, renderJsonLd, SITE } from "@rootline/seo";
import { fetchBlogList, type BlogPost } from "@rootline/api-client";
import { formatDate } from "@rootline/utils";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Engineering notes, security write-ups, and product thinking.",
  path: "/blog",
});

export const dynamic = "force-dynamic";

async function getPosts(): Promise<BlogPost[]> {
  try {
    const page = await fetchBlogList({ take: 20, published: true });
    return page.items;
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-dvh">
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Blog"
            title="Writing from Rootline"
            description="Field notes from engineering and security work."
            size="lg"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {posts.length === 0 ? (
              <Card className="p-10 text-center md:col-span-2">
                <p className="text-muted-foreground">No posts yet.</p>
              </Card>
            ) : (
              posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full p-6 transition-colors hover:bg-muted/50">
                    <h3 className="font-display text-xl">{post.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                    <p className="mt-4 text-xs text-muted-foreground">
                      {post.publishedAt ? formatDate(post.publishedAt, "long") : ""}
                      {post.readTime ? ` · ${post.readTime} min` : ""}
                    </p>
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
              { name: "Blog", url: `${SITE.url}/blog` },
            ]),
          ),
        }}
      />
    </main>
  );
}
