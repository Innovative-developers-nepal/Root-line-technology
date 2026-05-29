import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, renderJsonLd, SITE } from "@rootline/seo";
import { fetchBlogList, type BlogPost } from "@rootline/api-client";
import { BlogList } from "@/components/blog-list";

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
      <BlogList posts={posts} />

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
