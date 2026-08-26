"use client";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#e4ebe7]/80 bg-white/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-extrabold tracking-tight"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#dff2e8] text-xl">
            🐶
          </span>
          <span>Realistic Dog Cost</span>
        </Link>

        <button
          className="md:hidden rounded-lg border px-3 py-2"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
        >
          ☰
        </button>

        <nav
          className={`${open ? "flex" : "hidden"} absolute left-4 right-4 top-16 flex-col gap-3 rounded-2xl border bg-white p-4 shadow-xl md:static md:flex md:flex-row md:border-0 md:p-0 md:shadow-none`}
        >
          <Link href="/dog-cost-calculator">Calculator</Link>
          <Link href="/breeds">Breeds</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/can-i-afford-a-dog">Affordability</Link>
          <Link href="/emergency-fund">Emergency Fund</Link>
          <Link href="/faq">FAQ</Link>
          <Link
            href="/dog-cost-calculator"
            className="rounded-xl bg-[#1f7a58] px-4 py-2 font-bold text-white"
          >
            Calculate
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t bg-[#f6f7f3]">
      <div className="container-x grid gap-8 py-12 md:grid-cols-4">
        <div>
          <div className="font-extrabold">🐶 Realistic Dog Cost</div>
          <p className="mt-3 text-sm text-[#65736d]">
            A practical ownership-cost estimator built for real-world
            budgeting.
          </p>
        </div>

        <div>
          <div className="font-bold">Tools</div>
          <div className="mt-3 grid gap-2 text-sm">
            <Link href="/dog-cost-calculator">Dog Cost Calculator</Link>
            <Link href="/compare">Compare Breeds</Link>
            <Link href="/can-i-afford-a-dog">
              Can I Afford a Dog?
            </Link>
            <Link href="/emergency-fund">Emergency Fund</Link>
          </div>
        </div>

        <div>
          <div className="font-bold">Explore</div>
          <div className="mt-3 grid gap-2 text-sm">
            <Link href="/breeds">All Breeds</Link>
            <Link href="/puppy-cost-calculator">Puppy Calculator</Link>
            <Link href="/dog-cost-per-month">Cost Per Month</Link>
            <Link href="/dog-cost-per-year">Cost Per Year</Link>
          </div>
        </div>

        <div>
          <div className="font-bold">Legal</div>
          <div className="mt-3 grid gap-2 text-sm">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>

      <div className="container-x border-t py-6 text-xs text-[#65736d]">
        Estimates are informational only. Actual costs vary by location,
        breed, health, lifestyle and individual circumstances.
      </div>
    </footer>
  );
}

/* Google AdSense */
export function AdSlot({
  label = "AD_SLOT_CONTENT",
}: {
  label?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const adsbygoogle = (window.adsbygoogle =
        window.adsbygoogle || []);

      adsbygoogle.push({});

      setLoaded(true);
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  /*
   * AD_SLOT_TOP en AD_SLOT_RESULT gebruiken hetzelfde AdSense
   * publisher-account, maar krijgen een verschillend slot-ID.
   */
  const slotId =
  label === "AD_SLOT_TOP"
    ? "1234567890"
    : label === "AD_SLOT_RESULT"
      ? "9876543210"
      : "1234567890";

  return (
    <div className="no-print my-6 flex min-h-20 w-full justify-center">
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
        }}
        data-ad-client="ca-pub-7925832816251718"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      {!loaded && (
        <span className="sr-only">
          Advertentie wordt geladen
        </span>
      )}
    </div>
  );
}
