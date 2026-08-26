import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CalculatorApp from "@/components/CalculatorApp";
import { breedMap, breeds } from "@/data/breeds";
import { money } from "@/lib/format";
import { calculateTotalCost, defaultInputs } from "@/lib/calculator";

export function generateStaticParams() {
  return breeds.map((breed) => ({ slug: `${breed.slug}-cost` }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const breed = breedMap[slug.replace(/-cost$/i, "")];
  if (!breed) return { title: "Dog Breed Cost Guide", description: "Dog ownership cost guide." };
  return {
    title: `${breed.name} Cost Calculator`,
    description: `Estimate the monthly, yearly, first-year and lifetime cost of owning a ${breed.name}.`,
    alternates: { canonical: `/breeds/${breed.slug}-cost` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const breed = breedMap[slug.replace(/-cost$/i, "")];
  if (!breed) notFound();

  const result = calculateTotalCost(defaultInputs(breed));
  const faqEntities = breed.faq.map((question) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: `The cost of owning a ${breed.name} varies with location, age, health, food, insurance and lifestyle. Use the calculator to model your own assumptions.`,
    },
  }));

  return (
    <main>
      <section className="bg-[#f6f7f3]">
        <div className="container-x py-14">
          <div className="text-sm font-black uppercase tracking-wider text-[#1f7a58]">Breed cost guide</div>
          <h1 className="mt-2 text-5xl font-black">How much does a {breed.name} cost?</h1>
          <p className="mt-4 max-w-3xl text-lg text-[#65736d]">{breed.description} Use the calculator below to replace the default assumptions with your own lifestyle and location.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-4">
            <K label="Monthly" value={money(result.monthly, "USD")} />
            <K label="Yearly" value={money(result.yearly, "USD")} />
            <K label="First year" value={money(result.firstYear, "USD")} />
            <K label="Lifetime" value={money(result.lifetime, "USD")} />
          </div>
        </div>
      </section>
      <CalculatorApp initialBreed={breed.slug} />
      <section className="container-x pb-16">
        <div className="card p-7">
          <h2 className="text-2xl font-black">{breed.name} cost FAQ</h2>
          {breed.faq.map((question) => (
            <details key={question} className="mt-3 border-b py-3">
              <summary className="cursor-pointer font-bold">{question}</summary>
              <p className="mt-2 text-[#65736d]">The answer depends on location, age, health, food choice, insurance and lifestyle. Use the calculator above to model your own assumptions rather than relying on a single fixed number.</p>
            </details>
          ))}
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqEntities }) }} />
        <p className="mt-6 text-xs text-[#65736d]">Preset figures are planning assumptions, not veterinary pricing or financial advice.</p>
        <Link href="/breeds" className="mt-4 inline-block font-bold text-[#1f7a58]">← Browse all breeds</Link>
      </section>
    </main>
  );
}

function K({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white p-4"><div className="text-xs text-[#65736d]">{label}</div><div className="mt-1 text-xl font-black">{value}</div></div>;
}
