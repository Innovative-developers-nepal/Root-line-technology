"use client";

import { useState } from "react";
import { api } from "@rootline/api-client";
import { Popover } from "@rootline/ui/components";
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
  Share2,
} from "lucide-react";

interface SharePopoverProps {
  url: string;
  title: string;
  slug: string;
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

export function SharePopover({ url, title, slug }: SharePopoverProps) {
  const [copied, setCopied] = useState(false);

  function trackShare() {
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
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
          aria-label="Share this article"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={8}
          className="z-50 w-56 rounded-lg border bg-popover p-3 shadow-md outline-none"
        >
          <div className="grid grid-cols-4 gap-2">
            {PLATFORMS.map((platform) => {
              const Icon = platform.icon;
              return (
                <a
                  key={platform.id}
                  href={platform.href(url, title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackShare}
                  className="flex flex-col items-center gap-1 rounded-md p-2 text-xs transition-colors hover:bg-muted"
                  aria-label={`Share on ${platform.label}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] text-muted-foreground">{platform.label}</span>
                </a>
              );
            })}

            {/* Copy link */}
            <button
              onClick={copyLink}
              className="flex flex-col items-center gap-1 rounded-md p-2 text-xs transition-colors hover:bg-muted"
              aria-label="Copy link"
            >
              {copied ? <Check className="h-5 w-5 text-green-500" /> : <Link className="h-5 w-5" />}
              <span className="text-[10px] text-muted-foreground">{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
          <Popover.Arrow className="fill-popover" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
