"use client";
import { useMemo, useState } from "react";
import { breeds, type Breed } from "@/data/breeds";
import { calculateTotalCost, defaultInputs, type Result } from "@/lib/calculator";
import { money } from "@/lib/format";

type Comparison = { b: Breed; r: Result };
type Row = { label: string; value: (x: Comparison) => string };

export default function Page() {
  const [selected, setSelected] = useState([breeds[0].slug, breeds[1].slug, breeds[3].slug]);
  const data = useMemo<Comparison[]>(() => selected.flatMap((slug) => {
    const breed = breeds.find((item) => item.slug === slug);
    return breed ? [{ b: breed, r: calculateTotalCost(defaultInputs(breed)) }] : [];
  }), [selected]);

  const toggle = (slug: string) => setSelected((current) =>
    current.includes(slug) ? current.filter((item) => item !== slug) : current.length < 4 ? [...current, slug] : current,
  );

  const rows: Row[] = [
    { label: "First-year cost", value: (x) => money(x.r.firstYear, "USD") },
    { label: "Monthly cost", value: (x) => money(x.r.monthly, "USD") },
    { label: "Yearly cost", value: (x) => money(x.r.yearly, "USD") },
    { label: "Lifetime cost", value: (x) => money(x.r.lifetime, "USD") },
    { label: "Food / month", value: (x) => money(x.r.breakdown.food, "USD") },
    { label: "Vet / month", value: (x) => money(x.r.breakdown.vet, "USD") },
    { label: "Grooming / month", value: (x) => money(x.r.breakdown.grooming, "USD") },
    { label: "Insurance / month", value: (x) => money(x.r.breakdown.insurance, "USD") },
    { label: "Lifespan", value: (x) => `${x.b.lifespan} yrs` },
  ];

  return <main className="container-x py-14">
    <div className="max-w-3xl">
      <div className="text-sm font-black uppercase tracking-wider text-[#1f7a58]">Compare dog costs</div>
      <h1 className="mt-2 text-5xl font-black">Which breed costs more to own?</h1>
      <p className="mt-4 text-lg text-[#65736d]">Choose up to four breeds. Standardized estimates are useful for comparison; the full calculator lets you customize every assumption.</p>
    </div>
    <div className="mt-8 flex flex-wrap gap-2" aria-label="Select breeds">
      {breeds.map((breed) => <button type="button" key={breed.slug} aria-pressed={selected.includes(breed.slug)} onClick={() => toggle(breed.slug)} className={`rounded-full border px-3 py-2 text-sm font-bold ${selected.includes(breed.slug) ? "border-[#1f7a58] bg-[#dff2e8] text-[#1f7a58]" : "bg-white"}`}>{breed.name}</button>)}
    </div>
    <div className="card mt-8 overflow-x-auto">
      <table className="w-full min-w-[760px] text-left"><caption className="sr-only">Dog breed cost comparison</caption><thead><tr className="border-b bg-[#f6f7f3]"><th scope="col" className="p-4">Metric</th>{data.map((item) => <th scope="col" className="p-4" key={item.b.slug}>{item.b.name}</th>)}</tr></thead><tbody>{rows.map((row) => <tr className="border-b" key={row.label}><th scope="row" className="p-4 font-bold">{row.label}</th>{data.map((item) => <td className="p-4" key={item.b.slug}>{row.value(item)}</td>)}</tr>)}</tbody></table>
    </div>
    <p className="mt-5 text-xs text-[#65736d]">Currency shown in USD for standardized comparison. The calculator can display estimates in supported currencies using an approximate conversion rate.</p>
  </main>;
}
