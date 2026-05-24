import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Badge, Separator } from "@rootline/ui/components";
import { RichTextRenderer } from "@rootline/ui/editor";
import {
  buildMetadata,
  breadcrumbJsonLd,
  articleJsonLd,
  renderJsonLd,
  SITE,
} from "@rootline/seo";
import { fetchBlog, fetchBlogList, type BlogPost } from "@rootline/api-client";
import { formatDate } from "@rootline/utils";
import { ReadingProgress } from "@/components/reading-progress";
import { ShareButtons } from "@/components/share-buttons";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function postUrl(slug: string) {
  return `${SITE.url}/blog/${slug}`;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    return await fetchBlog(slug);
  } catch {
    return null;
  }
}

async function getRelatedPosts(category: string, currentSlug: string): Promise<BlogPost[]> {
  try {
    const page = await fetchBlogList({ take: 4, published: true, category });
    return page.items.filter((p) => p.slug !== currentSlug).slice(0, 3);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return buildMetadata({
    title: post?.title ?? "Post",
    description: post?.excerpt,
    path: `/blog/${slug}`,
    type: "article",
    image: post?.coverImage,
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.category, post.slug);
  const url = postUrl(post.slug);

  return (
    <>
      <ReadingProgress />

      <main className="min-h-dvh">
        {/* Back link */}
        <div className="border-b">
          <Container size="md" className="py-4">
            <Link
              href="/blog"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              &larr; Back to Blog
            </Link>
          </Container>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative aspect-[2/1] w-full overflow-hidden bg-muted lg:aspect-[3/1]">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Article header */}
        <Container size="md" className="py-12">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-sm text-muted-foreground">
              {post.publishedAt ? formatDate(post.publishedAt, "long") : ""}
              {post.readTime ? ` · ${post.readTime} min read` : ""}
            </span>
          </div>

          <h1 className="mt-6 font-display text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">{post.author}</p>
              <p className="text-xs text-muted-foreground">
                {post.publishedAt
                  ? formatDate(post.publishedAt, "long")
                  : "Draft"}
                {post.readTime ? ` · ${post.readTime} min read` : ""}
              </p>
            </div>
          </div>
        </Container>

        {/* Article body */}
        <Container size="md">
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <RichTextRenderer content={post.content} />
          </article>
        </Container>

        {/* Tags */}
        {post.tags.length > 0 && (
          <Container size="md" className="pb-6 pt-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </Container>
        )}

        {/* Share */}
        <Container size="md" className="pb-12">
          <Separator className="mb-6" />
          <ShareButtons url={url} title={post.title} />
        </Container>

        {/* Author bio */}
        <Container size="md" className="pb-16">
          <div className="flex items-start gap-4 rounded-lg border p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="font-semibold">{post.author}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Team Rootline. Writing about security, engineering, and product design.
              </p>
            </div>
          </div>
        </Container>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="border-t bg-muted/30">
            <Container size="md" className="py-16">
              <h2 className="font-display text-2xl">Related articles</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.id} href={`/blog/${r.slug}`}>
                    <article className="group rounded-lg border bg-card p-5 transition-colors hover:bg-muted/50">
                      <p className="text-xs text-muted-foreground">
                        {r.publishedAt ? formatDate(r.publishedAt, "long") : ""}
                      </p>
                      <h3 className="mt-2 font-display text-lg group-hover:text-primary">
                        {r.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {r.excerpt}
                      </p>
                    </article>
                  </Link>
                ))}
              </div>
            </Container>
          </div>
        )}
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Blog", url: `${SITE.url}/blog` },
              { name: post.title, url },
            ]),
            articleJsonLd({
              title: post.title,
              description: post.excerpt,
              slug: post.slug,
              image: post.coverImage,
              publishedAt: post.publishedAt ?? post.createdAt,
              updatedAt: post.updatedAt,
            }),
          ),
        }}
      />
    </>
  );
}
