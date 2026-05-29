"use client";

import { useState } from "react";
import { api } from "@rootline/api-client";
import {
  Link,
  Twitter,
  Linkedin,
  Facebook,
  Send,
  Globe,
  Mail,
  MessageCircle,
  Check,
} from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  slug: string;
  initialShareCount?: number;
}

const PLATFORMS = [
  {
    id: "twitter",
    label: "Twitter",
    icon: Twitter,
    href: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    href: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: Facebook,
    href: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    href: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
  },
  {
    id: "telegram",
    label: "Telegram",
    icon: Send,
    href: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: "reddit",
    label: "Reddit",
    icon: Globe,
    href: (url: string, title: string) =>
      `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    href: (url: string, title: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
];

export function ShareButtons({ url, title, slug, initialShareCount = 0 }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [shareCount, setShareCount] = useState(initialShareCount);

  function trackShare() {
    setShareCount((c) => c + 1);
    api.request(`/api/v1/blog/${slug}/share`, { method: "POST" }).catch(() => {});
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackShare();
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {shareCount > 0 ? `${shareCount} shares` : "Share"}
      </span>

      <button
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
        aria-label="Copy link"
      >
        {copied ? <Check className="h-4 w-4" /> : <Link className="h-4 w-4" />}
        {copied ? "Copied!" : "Copy link"}
      </button>

      {PLATFORMS.map((platform) => {
        const Icon = platform.icon;
        return (
          <a
            key={platform.id}
            href={platform.href(url, title)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackShare}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
            aria-label={`Share on ${platform.label}`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{platform.label}</span>
          </a>
        );
      })}
    </div>
  );
}
