"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { breeds } from "@/data/breeds";
import {
  calculateTotalCost,
  type Country,
  type Currency,
  type Inputs,
  type Scenario,
  defaultInputs,
} from "@/lib/calculator";
import { convertCurrency, currencyForCountry, money } from "@/lib/format";
import { BreakdownChart, TimelineChart } from "./Charts";
import { AdSlot } from "./SiteChrome";
import { AffiliateBlock } from "./AffiliateBlock";

const clampInput = (value: number, max = 1_000_000) =>
  Number.isFinite(value) ? Math.min(max, Math.max(0, value)) : 0;

function NumberField({
  label,
  value,
  onChange,
  step = "1",
  max = 1_000_000,
  help,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
  max?: number;
  help?: string;
}) {
  return (
    <label className="grid gap-1 text-sm font-semibold">
      {label}
      <input
        type="number"
        inputMode="decimal"
        min="0"
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(clampInput(Number(event.target.value), max))}
        className="rounded-xl border border-[#dce5e0] bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#b9dfcb]"
      />
      {help ? <span className="text-xs font-normal text-[#65736d]">{help}</span> : null}
    </label>
  );
}

export default function CalculatorApp({
  initialBreed,
  initialProfile = "adult",
}: {
  initialBreed?: string;
  initialProfile?: "puppy" | "adult" | "senior";
}) {
  const start = breeds.find((breed) => breed.slug === initialBreed) ?? breeds[0];
  const [inputs, setInputs] = useState<Inputs>(() => ({
    ...defaultInputs(start),
    profile: initialProfile,
  }));
  const [step, setStep] = useState(1);
  const [quick, setQuick] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const state = params.get("state");
      if (state) {
        const decoded = JSON.parse(atob(state)) as Partial<Inputs> & { breed?: string };
        const breed = breeds.find((item) => item.slug === decoded.breed) ?? start;
        setInputs((current) => ({
          ...current,
          breed,
          age: Number.isFinite(decoded.age) ? Number(decoded.age) : current.age,
          profile: decoded.profile ?? current.profile,
          scenario: decoded.scenario ?? current.scenario,
          country: ["US", "UK", "CA", "AU", "BE", "NL"].includes(String(decoded.country)) ? decoded.country as Country : current.country,
          currency: ["USD", "GBP", "CAD", "AUD", "EUR"].includes(String(decoded.currency)) ? decoded.currency as Currency : current.currency,
          sex: decoded.sex === "male" || decoded.sex === "female" ? decoded.sex : current.sex,
          measurementSystem: decoded.measurementSystem === "metric" || decoded.measurementSystem === "imperial" ? decoded.measurementSystem : current.measurementSystem,
        }));
      }

      if (!initialBreed) {
        const raw = localStorage.getItem("rdcc-inputs");
        if (raw) {
          const stored = JSON.parse(raw) as Partial<Inputs> & { breed?: { slug?: string } };
              const breed = breeds.find((item) => item.slug === stored.breed?.slug) ?? start;
          const base = defaultInputs(breed);
          const merged = { ...base, ...stored, breed };
          merged.country = ["US", "UK", "CA", "AU", "BE", "NL"].includes(String(merged.country)) ? merged.country as Country : base.country;
          merged.currency = ["USD", "GBP", "CAD", "AUD", "EUR"].includes(String(merged.currency)) ? merged.currency as Currency : base.currency;
          merged.sex = merged.sex === "male" || merged.sex === "female" ? merged.sex : base.sex;
          merged.measurementSystem = merged.measurementSystem === "metric" || merged.measurementSystem === "imperial" ? merged.measurementSystem : base.measurementSystem;
          setInputs(merged);
        }
      }
    } catch {
      // Invalid shared/local state is ignored and the safe defaults remain active.
    }
  }, [initialBreed, start]);

  useEffect(() => {
    try {
      localStorage.setItem("rdcc-inputs", JSON.stringify(inputs));
    } catch {
      // Storage can be unavailable in private/restricted browser contexts.
    }
  }, [inputs]);

  const result = useMemo(() => calculateTotalCost(inputs), [inputs]);
  const set = (patch: Partial<Inputs>) => setInputs((current) => ({ ...current, ...patch }));
  const currency = inputs.currency;

  const setCountry = (country: Country) => {
    const nextCurrency = currencyForCountry(country);
    const monetaryKeys: (keyof Inputs)[] = [
      "foodPricePerKg", "treatPriceEach", "routineVet", "vaccines", "prevention",
      "fleaTick", "worming", "dental", "emergencyFund", "unexpected", "premium",
      "deductible", "annualLimit", "groomingPrice", "homeGrooming", "training",
      "walkPrice", "daycarePrice", "sitter", "travel", "toys", "accessories",
      "housing", "cleaning", "damage", "oneTime", "purchase", "income", "expenses",
      "savings", "existingEmergency",
    ];
    setInputs((current) => {
      if (current.currency === nextCurrency) return { ...current, country };
      const converted = { ...current, country, currency: nextCurrency };
      for (const key of monetaryKeys) {
        const value = current[key];
        if (typeof value === "number") {
          (converted[key] as number) = convertCurrency(value, current.currency, nextCurrency);
        }
      }
      return converted;
    });
  };

  const selectBreed = (slug: string) => {
    const breed = breeds.find((item) => item.slug === slug);
    if (!breed) return;
    setInputs({
      ...defaultInputs(breed),
      profile: inputs.profile,
      scenario: inputs.scenario,
      country: inputs.country,
      currency: inputs.currency,
      sex: inputs.sex,
      measurementSystem: inputs.measurementSystem,
    });
  };

  const share = async () => {
    try {
      const state = btoa(
        JSON.stringify({
          breed: inputs.breed.slug,
          age: inputs.age,
          profile: inputs.profile,
          scenario: inputs.scenario,
          country: inputs.country,
          currency: inputs.currency,
          sex: inputs.sex,
          measurementSystem: inputs.measurementSystem,
        }),
      );
      const url = `${window.location.origin}/dog-cost-calculator?state=${encodeURIComponent(state)}`;
      await navigator.clipboard.writeText(url);
      setShareState("copied");
    } catch {
      setShareState("failed");
    }
    window.setTimeout(() => setShareState("idle"), 2500);
  };

  const sections = ["Your Dog", "Food", "Healthcare", "Grooming & Training", "Lifestyle", "Your Results"];

  return (
    <main className="bg-[#fbfcfa] pb-20">
      <section className="grid-bg border-b">
        <div className="container-x py-14 md:py-20">
          <div className="max-w-3xl">
            <span className="rounded-full bg-[#dff2e8] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#1f7a58]">
              Realistic estimate
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              How much will your dog <span className="text-[#1f7a58]">really</span> cost?
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[#65736d]">
              Build a monthly, yearly, first-year and lifetime estimate. Costs are estimates, and every major assumption is editable.
            </p>
          </div>
        </div>
      </section>

      <div className="container-x">
        <AdSlot label="AD_SLOT_TOP" />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="card overflow-hidden">
            <div className="flex overflow-x-auto border-b bg-white" role="tablist" aria-label="Calculator steps">
              {sections.map((section, index) => (
                <button
                  key={section}
                  type="button"
                  role="tab"
                  aria-selected={step === index + 1}
                  onClick={() => setStep(index + 1)}
                  className={`min-w-max px-4 py-4 text-sm font-bold ${step === index + 1 ? "border-b-2 border-[#1f7a58] text-[#1f7a58]" : "text-[#65736d]"}`}
                >
                  {index + 1}. {section}
                </button>
              ))}
            </div>

            <div className="p-5 md:p-8">
              {step === 1 ? (
                <div className="grid gap-5">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-black">Your dog</h2>
                    <button type="button" onClick={() => setQuick((value) => !value)} className="rounded-full border px-3 py-1 text-xs font-bold">
                      {quick ? "Full mode" : "Quick estimate"}
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-1 text-sm font-semibold">
                      Breed
                      <select value={inputs.breed.slug} onChange={(event) => selectBreed(event.target.value)} className="rounded-xl border px-3 py-2.5">
                        {breeds.map((breed) => <option key={breed.slug} value={breed.slug}>{breed.name}</option>)}
                      </select>
                    </label>
                    <NumberField label="Age (years)" value={inputs.age} max={100} onChange={(value) => set({ age: Math.min(inputs.lifespan, value) })} />
                    {!quick ? <>
                      <NumberField label="Weight" value={inputs.weight} max={500} onChange={(value) => set({ weight: value })} />
                      <NumberField label="Expected lifespan (years)" value={inputs.lifespan} max={100} onChange={(value) => set({ lifespan: Math.max(inputs.age, value) })} />
                    </> : null}
                    <label className="grid gap-1 text-sm font-semibold">
                      Life stage
                      <select value={inputs.profile} onChange={(event) => set({ profile: event.target.value as Inputs["profile"] })} className="rounded-xl border px-3 py-2.5">
                        <option value="puppy">Puppy</option><option value="adult">Adult</option><option value="senior">Senior</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-sm font-semibold">
                      Scenario
                      <select value={inputs.scenario} onChange={(event) => set({ scenario: event.target.value as Scenario })} className="rounded-xl border px-3 py-2.5">
                        <option value="budget">Budget</option><option value="average">Average</option><option value="premium">Premium</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-sm font-semibold">
                      Country
                      <select value={inputs.country} onChange={(event) => setCountry(event.target.value as Country)} className="rounded-xl border px-3 py-2.5">
                        <option value="US">United States</option><option value="UK">United Kingdom</option><option value="CA">Canada</option><option value="AU">Australia</option><option value="BE">Belgium</option><option value="NL">Netherlands</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-sm font-semibold">
                      Measurement system
                      <select value={inputs.measurementSystem} onChange={(event) => set({ measurementSystem: event.target.value as Inputs["measurementSystem"] })} className="rounded-xl border px-3 py-2.5">
                        <option value="imperial">lb / miles</option><option value="metric">kg / km</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-sm font-semibold">
                      Sex
                      <select value={inputs.sex} onChange={(event) => set({ sex: event.target.value as Inputs["sex"] })} className="rounded-xl border px-3 py-2.5"><option value="female">Female</option><option value="male">Male</option></select>
                    </label>
                  </div>
                  {!quick ? <div className="grid gap-4 md:grid-cols-2">
                    <NumberField label={`Purchase / adoption (${currency})`} value={inputs.purchase} onChange={(value) => set({ purchase: value })} />
                    <NumberField label={`First supplies & setup (${currency})`} value={inputs.oneTime} onChange={(value) => set({ oneTime: value })} />
                  </div> : null}
                  <button type="button" onClick={() => setStep(2)} className="rounded-xl bg-[#1f7a58] px-5 py-3 font-bold text-white">Next: Food →</button>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="grid gap-5">
                  <h2 className="text-2xl font-black">Food</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-1 text-sm font-semibold">Food type<select value={inputs.foodType} onChange={(event) => set({ foodType: event.target.value })} className="rounded-xl border px-3 py-2.5"><option>dry</option><option>wet</option><option>raw</option><option>mixed</option><option>homemade</option></select></label>
                    <NumberField label={`Food price / kg (${currency})`} value={inputs.foodPricePerKg} step="0.1" onChange={(value) => set({ foodPricePerKg: value })} />
                    <NumberField label="Food grams / day" value={inputs.foodGramsPerDay} max={5000} onChange={(value) => set({ foodGramsPerDay: value })} />
                    <NumberField label="Treats / day" value={inputs.treatsPerDay} max={100} onChange={(value) => set({ treatsPerDay: value })} />
                    <NumberField label={`Price per treat (${currency})`} value={inputs.treatPriceEach} step="0.01" onChange={(value) => set({ treatPriceEach: value })} />
                  </div>
                  <div className="rounded-2xl bg-[#f6f7f3] p-4"><b>Estimated food:</b> {money(result.breakdown.food * 12, currency)}/year</div>
                  <button type="button" onClick={() => setStep(3)} className="rounded-xl bg-[#1f7a58] px-5 py-3 font-bold text-white">Next: Healthcare →</button>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="grid gap-5">
                  <h2 className="text-2xl font-black">Healthcare & insurance</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <NumberField label={`Routine vet / year (${currency})`} value={inputs.routineVet} onChange={(value) => set({ routineVet: value })} />
                    <NumberField label={`Vaccines / year (${currency})`} value={inputs.vaccines} onChange={(value) => set({ vaccines: value })} />
                    <NumberField label={`Preventive meds / year (${currency})`} value={inputs.prevention} onChange={(value) => set({ prevention: value })} />
                    <NumberField label={`Flea/tick / year (${currency})`} value={inputs.fleaTick} onChange={(value) => set({ fleaTick: value })} />
                    <NumberField label={`Worming / year (${currency})`} value={inputs.worming} onChange={(value) => set({ worming: value })} />
                    <NumberField label={`Dental care / year (${currency})`} value={inputs.dental} onChange={(value) => set({ dental: value })} />
                    <NumberField label={`Unexpected vet reserve / year (${currency})`} value={inputs.unexpected} onChange={(value) => set({ unexpected: value })} />
                    <label className="grid gap-1 text-sm font-semibold">Insurance<select value={inputs.insurance} onChange={(event) => set({ insurance: event.target.value as Inputs["insurance"] })} className="rounded-xl border px-3 py-2.5"><option value="none">No insurance</option><option value="basic">Basic</option><option value="standard">Standard</option><option value="premium">Premium</option></select></label>
                    <NumberField label={`Monthly premium (${currency})`} value={inputs.premium} onChange={(value) => set({ premium: value })} />
                    <NumberField label={`Deductible (${currency})`} value={inputs.deductible} onChange={(value) => set({ deductible: value })} />
                    <NumberField label="Reimbursement %" value={inputs.reimbursement} max={100} onChange={(value) => set({ reimbursement: value })} />
                    <NumberField label={`Annual limit (${currency})`} value={inputs.annualLimit} onChange={(value) => set({ annualLimit: value })} />
                  </div>
                  <p className="text-sm text-[#65736d]">Insurance is modeled as a budgeting estimate. Deductibles, reimbursement and annual limits are displayed as planning inputs; actual policy payouts depend on the policy.</p>
                  <button type="button" onClick={() => setStep(4)} className="rounded-xl bg-[#1f7a58] px-5 py-3 font-bold text-white">Next: Grooming & Training →</button>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="grid gap-5">
                  <h2 className="text-2xl font-black">Grooming & training</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <NumberField label="Professional grooming / month" value={inputs.groomingSessions} step="0.1" onChange={(value) => set({ groomingSessions: value })} />
                    <NumberField label={`Price per session (${currency})`} value={inputs.groomingPrice} onChange={(value) => set({ groomingPrice: value })} />
                    <NumberField label={`Home grooming / month (${currency})`} value={inputs.homeGrooming} onChange={(value) => set({ homeGrooming: value })} />
                    <NumberField label={`Training / year (${currency})`} value={inputs.training} onChange={(value) => set({ training: value })} />
                  </div>
                  <button type="button" onClick={() => setStep(5)} className="rounded-xl bg-[#1f7a58] px-5 py-3 font-bold text-white">Next: Lifestyle →</button>
                </div>
              ) : null}

              {step === 5 ? (
                <div className="grid gap-5">
                  <h2 className="text-2xl font-black">Lifestyle</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <NumberField label="Walks / week" value={inputs.walkingPerWeek} max={100} onChange={(value) => set({ walkingPerWeek: value })} />
                    <NumberField label={`Price per walk (${currency})`} value={inputs.walkPrice} onChange={(value) => set({ walkPrice: value })} />
                    <NumberField label="Daycare days / month" value={inputs.daycareDays} max={31} onChange={(value) => set({ daycareDays: value })} />
                    <NumberField label={`Daycare price / day (${currency})`} value={inputs.daycarePrice} onChange={(value) => set({ daycarePrice: value })} />
                    <NumberField label={`Pet sitter / month (${currency})`} value={inputs.sitter} onChange={(value) => set({ sitter: value })} />
                    <NumberField label={`Travel / month (${currency})`} value={inputs.travel} onChange={(value) => set({ travel: value })} />
                    <NumberField label={`Toys / month (${currency})`} value={inputs.toys} onChange={(value) => set({ toys: value })} />
                    <NumberField label={`Accessories / month (${currency})`} value={inputs.accessories} onChange={(value) => set({ accessories: value })} />
                    <NumberField label={`Housing / month (${currency})`} value={inputs.housing} onChange={(value) => set({ housing: value })} />
                    <NumberField label={`Cleaning / month (${currency})`} value={inputs.cleaning} onChange={(value) => set({ cleaning: value })} />
                    <NumberField label={`Damage allowance / month (${currency})`} value={inputs.damage} onChange={(value) => set({ damage: value })} />
                  </div>
                  <button type="button" onClick={() => setStep(6)} className="rounded-xl bg-[#1f7a58] px-5 py-3 font-bold text-white">See my results →</button>
                </div>
              ) : null}

              {step === 6 ? <Results inputs={inputs} result={result} currency={currency} share={share} shareState={shareState} setStep={setStep} /> : null}
            </div>
          </section>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="card p-5">
              <div className="text-sm font-bold text-[#65736d]">Estimated lifetime cost</div>
              <div className="mt-2 text-4xl font-black text-[#1f7a58]">{money(result.lifetime, currency)}</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Stat label="Monthly" value={money(result.monthly, currency)} />
                <Stat label="Yearly" value={money(result.yearly, currency)} />
                <Stat label="First year" value={money(result.firstYear, currency)} />
                <Stat label="Lifespan" value={`${inputs.lifespan} yrs`} />
              </div>
              <AdSlot label="AD_SLOT_RESULT" />
              <button type="button" onClick={() => setStep(6)} className="w-full rounded-xl border border-[#1f7a58] px-4 py-3 font-bold text-[#1f7a58]">See full breakdown</button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-[#f6f7f3] p-3"><div className="text-xs text-[#65736d]">{label}</div><div className="mt-1 font-extrabold">{value}</div></div>;
}

function Results({
  inputs,
  result,
  currency,
  share,
  shareState,
  setStep,
}: {
  inputs: Inputs;
  result: ReturnType<typeof calculateTotalCost>;
  currency: Currency;
  share: () => void;
  shareState: "idle" | "copied" | "failed";
  setStep: (step: number) => void;
}) {
  return (
    <div className="fade-in grid gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-[#65736d]">Your estimated dog ownership cost</div>
          <div className="mt-2 text-5xl font-black tracking-tight">{money(result.lifetime, currency)}</div>
          <div className="text-[#65736d]">Estimated lifetime cost</div>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <button type="button" onClick={() => window.print()} className="rounded-xl border px-4 py-2 font-bold">Print / Save</button>
          <button type="button" onClick={share} className="rounded-xl bg-[#1f7a58] px-4 py-2 font-bold text-white">
            {shareState === "copied" ? "Link copied" : shareState === "failed" ? "Copy failed" : "Share result"}
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3"><Stat label="Monthly" value={money(result.monthly, currency)} /><Stat label="Yearly" value={money(result.yearly, currency)} /><Stat label="First year" value={money(result.firstYear, currency)} /></div>
      <AdSlot label="AD_SLOT_RESULT" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5"><h3 className="text-xl font-black">Where your money goes</h3><BreakdownChart result={result} currency={currency} /><div className="grid gap-2 text-sm">{Object.entries(result.breakdown).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([key, value]) => <div className="flex justify-between" key={key}><span className="capitalize">{key}</span><b>{Math.round(value * 100)}%</b></div>)}</div></div>
        <div className="card p-5"><h3 className="text-xl font-black">How costs change over time</h3><TimelineChart result={result} currency={currency} /></div>
      </div>

      <div className="card soft p-6"><h3 className="text-xl font-black">Emergency fund estimate</h3><p className="mt-2 text-[#65736d]">A general planning range based on breed risk, age and veterinary assumptions.</p><div className="mt-4 text-3xl font-black text-[#1f7a58]">{money(result.emergency.low, currency)} – {money(result.emergency.high, currency)}</div></div>
      <AffiliateBlock />
      <div className="card p-6"><h3 className="text-xl font-black">Can you afford this dog?</h3><p className="mt-2 text-[#65736d]">A simple budgeting screen based on your entered income, expenses, savings and modeled monthly dog cost.</p><div className="mt-4 rounded-2xl p-4 text-center font-black" style={{ background: result.affordability === "comfortable" ? "#dff2e8" : result.affordability === "manageable" ? "#fff2d8" : "#ffe2e2" }}>{result.affordability === "comfortable" ? "🟢 Comfortable" : result.affordability === "manageable" ? "🟡 Manageable" : "🔴 Financially risky"}</div><Link href="/can-i-afford-a-dog" className="mt-4 inline-block font-bold text-[#1f7a58]">Open affordability calculator →</Link></div>
      <div className="grid gap-3 md:grid-cols-3"><button type="button" onClick={() => setStep(1)} className="rounded-xl border px-4 py-3 font-bold">Edit inputs</button><Link href={`/breeds/${inputs.breed.slug}-cost`} className="rounded-xl border px-4 py-3 text-center font-bold">See {inputs.breed.name} costs</Link><Link href="/compare" className="rounded-xl bg-[#1f7a58] px-4 py-3 text-center font-bold text-white">Compare breeds</Link></div>
      <p className="text-xs text-[#65736d]">This calculator provides estimates for informational purposes only. Actual dog ownership costs vary depending on location, breed, health, lifestyle and individual circumstances.</p>
    </div>
  );
}
