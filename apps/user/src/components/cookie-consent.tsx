"use client";
import { useEffect, useState } from "react";
import { Button, Dialog } from "@rootline/ui/components";
import { cn } from "@rootline/ui/lib/cn";

const STORAGE_KEY = "rootline:cookie-consent";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

// best-effort: respect the analytics choice if PostHog is on the page
function applyConsent(consent: Consent) {
  const ph = (window as unknown as {
    posthog?: { opt_in_capturing?: () => void; opt_out_capturing?: () => void };
  }).posthog;
  if (!ph) return;
  if (consent.analytics) ph.opt_in_capturing?.();
  else ph.opt_out_capturing?.();
}

function Toggle({
  checked,
  onChange,
  disabled,
  label,
  description,
}: {
  checked: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          checked ? "bg-primary" : "bg-muted",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform",
            checked && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

export function CookieConsent() {
  // undefined = not yet read from storage; null = no choice made yet
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      setConsent(raw ? (JSON.parse(raw) as Consent) : null);
    } catch {
      setConsent(null);
    }
  }, []);

  const persist = (next: Consent) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    applyConsent(next);
    setConsent(next);
    setPrefsOpen(false);
  };

  const acceptAll = () => persist({ necessary: true, analytics: true, marketing: true });
  const rejectAll = () => persist({ necessary: true, analytics: false, marketing: false });
  const savePrefs = () => persist({ necessary: true, analytics, marketing });

  // hide until storage is read and only show when no choice has been made
  if (consent !== null) return null;

  return (
    <>
      <div className="fixed bottom-2 left-3 z-50 w-[calc(100%-2rem)] max-w-4xl sm:bottom-4">
        <div className="flex flex-col gap-6 rounded-xl border border-border/60 bg-card p-5 shadow-lg backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6">
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-medium tracking-tight text-foreground">
              Everyone loves a good cookie 🍪
            </p>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              At Rootline, we use cookies to improve your experience, personalize
              content, enhance communication, and analyze traffic.
            </p>
          </div>

          <div className="w-full shrink-0 sm:w-auto sm:min-w-fit">
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={acceptAll} variant="dark">
                Accept all
              </Button>
              <Button onClick={rejectAll} variant="dark">
                Reject all
              </Button>
            </div>
            <Button
              onClick={() => setPrefsOpen(true)}
              variant="secondary"
              className="mt-2.5 w-full"
            >
              Manage preferences
            </Button>
          </div>
        </div>
      </div>

      <Dialog.Root open={prefsOpen} onOpenChange={setPrefsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-md focus:outline-none">
            <Dialog.Title className="font-display text-xl tracking-tight text-foreground">
              Cookie preferences
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-muted-foreground">
              Choose which cookies Rootline may use. Necessary cookies are always on.
            </Dialog.Description>

            <div className="mt-4 divide-y divide-border">
              <Toggle
                checked
                disabled
                label="Strictly necessary"
                description="Required for the site to function. Always active."
              />
              <Toggle
                checked={analytics}
                onChange={setAnalytics}
                label="Analytics"
                description="Help us understand usage so we can improve the experience."
              />
              <Toggle
                checked={marketing}
                onChange={setMarketing}
                label="Marketing"
                description="Used to personalize content and measure campaigns."
              />
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
              <Button onClick={savePrefs} variant="outline">
                Save preferences
              </Button>
              <Button onClick={acceptAll} variant="dark">
                Accept all
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
