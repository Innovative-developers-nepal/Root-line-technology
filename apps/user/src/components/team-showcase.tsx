"use client";

import { useEffect, useState } from "react";
import { Github, Linkedin, Globe, Twitter } from "lucide-react";
import { cn } from "@rootline/ui/lib/cn";

export type ShowcaseMember = {
  name: string;
  role: string;
  position?: string;
  bio: string;
  image?: string;
  links?: {
    github?: string;
    linkedin?: string;
    website?: string;
    twitter?: string;
  };
};

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({
  member,
  className,
}: {
  member: ShowcaseMember;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (member.image && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={member.image}
        alt={member.name}
        onError={() => setFailed(true)}
        className={cn(
          "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]",
          className,
        )}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-linear-to-br from-primary/15 to-accent/15 transition-colors duration-300",
        className,
      )}
    >
      <span className="font-display text-2xl text-primary/70">
        {initials(member.name)}
      </span>
    </div>
  );
}

// ─── Grid layout (7 cols × 4 rows) ───────────────────────────────────────────
//
//  Col:  1          2           3       4       5        6       7
//  Row1: [photo]   [Built]     [photo] [photo] [photo]  [photo] [photo]
//  Row2: [photo]   [by]        [photo] [photo] [detail──────]   [photo]
//  Row3: [photo]   [Super]     [photo] [photo] [detail──────]   [photo]
//  Row4: [photo]   [Builders────────]  [photo] [photo]  [photo] [photo]
//
// Special cells (1-indexed [row, col]):
//   Built    → [1, 2]
//   by       → [2, 2]
//   Super    → [3, 2]
//   Builders → [4, 2–3]  (span 2 cols)
//   Detail   → [2–3, 5–6] (span 2 cols × 2 rows)
//
// All remaining cells are filled with member photo tiles in reading order.

const SPECIAL_KEYS = new Set([
  "1,2",
  "2,2",
  "3,2",
  "4,2",
  "4,3",
  "2,5",
  "2,6",
  "3,5",
  "3,6",
]);

function getPhotoSlots() {
  const slots: { row: number; col: number }[] = [];
  for (let r = 1; r <= 4; r++) {
    for (let c = 1; c <= 7; c++) {
      if (!SPECIAL_KEYS.has(`${r},${c}`)) slots.push({ row: r, col: c });
    }
  }
  return slots; // 19 available slots
}

const PHOTO_SLOTS = getPhotoSlots();

const ROTATE_INTERVAL_MS = 3500;

const RESUME_AFTER_INTERACTION_MS = 8000;

export function TeamShowcase({ members }: { members: ShowcaseMember[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interactedAt, setInteractedAt] = useState<number | null>(null);

  useEffect(() => {
    if (paused || members.length <= 1) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    if (interactedAt) {
      const delay = Math.max(
        RESUME_AFTER_INTERACTION_MS - (Date.now() - interactedAt),
        0,
      );
      const timeout = window.setTimeout(() => setInteractedAt(null), delay);
      return () => window.clearTimeout(timeout);
    }

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % members.length);
    }, ROTATE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, members.length, interactedAt]);

  const selectMember = (i: number) => {
    setActive(i);
    setInteractedAt(Date.now());
  };

  const activeMember = members[active] ?? members[0];
  if (!activeMember) return null;

  return (
    <>
      {/* ── Mobile layout (below md) ── */}
      <div className="flex flex-col gap-5 md:hidden">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {members.map((m, i) => (
            <button
              key={m.name}
              type="button"
              onClick={() => selectMember(i)}
              aria-pressed={i === active}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-xl border transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                i === active
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-border/60 hover:border-primary/40",
              )}
            >
              <Avatar member={m} />
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-1.5 pb-1 pt-3 text-left text-[10px] font-medium leading-tight text-white">
                {m.name}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
              {activeMember.role}
            </span>
            {activeMember.position && (
              <span className="inline-flex w-fit rounded-full border border-border bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground/80">
                {activeMember.position}
              </span>
            )}
          </div>
          <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-foreground">
            {activeMember.name}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {activeMember.bio}
          </p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1">
              {members.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectMember(i)}
                  aria-label={`View ${members[i]?.name}`}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all duration-200",
                    i === active
                      ? "scale-150 bg-primary"
                      : "bg-border hover:bg-primary/40",
                  )}
                />
              ))}
            </div>
            {activeMember.links && (
              <div className="flex items-center gap-1">
                {activeMember.links.github && (
                  <a href={activeMember.links.github} target="_blank" rel="noopener noreferrer"
                     aria-label={`${activeMember.name} on GitHub`}
                     className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Github className="size-3.5" />
                  </a>
                )}
                {activeMember.links.linkedin && (
                  <a href={activeMember.links.linkedin} target="_blank" rel="noopener noreferrer"
                     aria-label={`${activeMember.name} on LinkedIn`}
                     className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Linkedin className="size-3.5" />
                  </a>
                )}
                {activeMember.links.twitter && (
                  <a href={activeMember.links.twitter} target="_blank" rel="noopener noreferrer"
                     aria-label={`${activeMember.name} on Twitter`}
                     className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Twitter className="size-3.5" />
                  </a>
                )}
                {activeMember.links.website && (
                  <a href={activeMember.links.website} target="_blank" rel="noopener noreferrer"
                     aria-label={`${activeMember.name} website`}
                     className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Globe className="size-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop layout (md+) ── */}
      <div className="hidden md:block">
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="relative z-40 w-full"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gridTemplateRows: "repeat(4, 1fr)",
            gap: "8px",
            aspectRatio: "7 / 4",
          }}
        >
          {/* ── Label: Built ── */}
          <div
            className="flex items-center justify-center rounded-2xl bg-foreground text-background"
            style={{ gridColumn: "2", gridRow: "1" }}
          >
            <span className="font-display text-2xl font-bold tracking-tight">
              Built
            </span>
          </div>

          {/* ── Label: by ── */}
          <div
            className="flex items-center justify-center rounded-2xl bg-[#2a2a2a] text-[#f5f0e8]"
            style={{ gridColumn: "2", gridRow: "2" }}
          >
            <span className="font-display text-2xl font-bold italic tracking-tight">
              by
            </span>
          </div>

          {/* ── Label: Super ── */}
          <div
            className="flex items-center justify-center rounded-2xl bg-primary text-primary-foreground"
            style={{ gridColumn: "2", gridRow: "3" }}
          >
            <span className="font-display text-2xl font-bold tracking-tight">
              Super
            </span>
          </div>

          {/* ── Label: Builders (spans 2 cols) ── */}
          <div
            className="flex items-center justify-center rounded-2xl bg-muted text-foreground"
            style={{ gridColumn: "2 / 4", gridRow: "4" }}
          >
            <span className="font-display text-2xl font-bold tracking-tight">
              Builders
            </span>
          </div>

          {/* ── Detail card (spans cols 5–6, rows 2–3) ── */}
          <div
            className="flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden"
            style={{ gridColumn: "5 / 7", gridRow: "2 / 4", padding: "16px" }}
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                {activeMember.role}
              </span>
              {activeMember.position && (
                <span className="inline-flex w-fit rounded-full border border-border bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground/80">
                  {activeMember.position}
                </span>
              )}
            </div>
            <h3 className="mt-2 font-display text-lg font-bold leading-tight tracking-tight text-foreground line-clamp-1">
              {activeMember.name}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-6">
              {activeMember.bio}
            </p>
            <div className="mt-auto flex items-center justify-between gap-2 pt-2">
              <div className="flex flex-wrap items-center gap-1">
                {members.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectMember(i)}
                    aria-label={`View ${members[i]?.name}`}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-all duration-200",
                      i === active
                        ? "scale-150 bg-primary"
                        : "bg-border hover:bg-primary/40",
                    )}
                  />
                ))}
              </div>
              {activeMember.links && (
                <div className="flex items-center gap-1">
                  {activeMember.links.github && (
                    <a href={activeMember.links.github} target="_blank" rel="noopener noreferrer"
                       aria-label={`${activeMember.name} on GitHub`}
                       className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <Github className="size-3.5" />
                    </a>
                  )}
                  {activeMember.links.linkedin && (
                    <a href={activeMember.links.linkedin} target="_blank" rel="noopener noreferrer"
                       aria-label={`${activeMember.name} on LinkedIn`}
                       className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <Linkedin className="size-3.5" />
                    </a>
                  )}
                  {activeMember.links.twitter && (
                    <a href={activeMember.links.twitter} target="_blank" rel="noopener noreferrer"
                       aria-label={`${activeMember.name} on Twitter`}
                       className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <Twitter className="size-3.5" />
                    </a>
                  )}
                  {activeMember.links.website && (
                    <a href={activeMember.links.website} target="_blank" rel="noopener noreferrer"
                       aria-label={`${activeMember.name} website`}
                       className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <Globe className="size-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Member tiles, plus a few brand-glyph tiles for balance ── */}
          {PHOTO_SLOTS.map((slot, i) => {
            const style = { gridColumn: String(slot.col), gridRow: String(slot.row) };
            const m = members[i];

            if (m) {
              return (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => selectMember(i)}
                  aria-pressed={i === active}
                  style={style}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    i === active
                      ? "border-primary ring-2 ring-primary/40"
                      : "border-border/60 hover:border-primary/40",
                  )}
                >
                  <Avatar member={m} />
                  <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-2 pb-1.5 pt-5 text-left text-[10px] font-medium leading-tight text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 aria-pressed:opacity-100">
                    {m.name}
                  </span>
                </button>
              );
            }

            if ((i - members.length) % 3 !== 0) return null;
            return (
              <div
                key={`fill-${slot.row}-${slot.col}`}
                aria-hidden
                style={style}
                className="flex items-center justify-center rounded-2xl bg-muted text-primary/30"
              >
                <svg viewBox="0 0 24 24" fill="none" className="size-6">
                  <path d="M12 5 6 18M12 5l6 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <circle cx="12" cy="5" r="2.2" fill="currentColor" />
                  <circle cx="6" cy="18" r="1.8" fill="currentColor" />
                  <circle cx="18" cy="14" r="1.8" fill="currentColor" />
                </svg>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}