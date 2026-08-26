import type { Metadata } from "next";
import { AdSlot } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Dog Cost Calculator FAQ",
  description: "Answers to common questions about the cost of owning a dog.",
  alternates: { canonical: "/faq" },
};

const questions = [
  "How much does a dog cost per year?",
  "How much does a dog cost per month?",
  "How much does a puppy cost?",
  "How expensive is a Labrador?",
  "How much should I budget for vet bills?",
  "Is pet insurance worth it?",
  "How much should I save for emergencies?",
  "What is the cheapest dog to own?",
  "What is the most expensive dog to own?",
];

const answer = "There is no single correct number. Costs depend on country, breed, age, health, food, insurance, grooming, exercise, training and lifestyle. Use the calculator to model those inputs.";

export default function Page() {
  return (
    <main className="container-x py-14">
      <h1 className="text-5xl font-black">Dog cost calculator FAQ</h1>
      <p className="mt-4 max-w-2xl text-lg text-[#65736d]">The calculator makes its assumptions visible instead of pretending there is one universal price.</p>
      <AdSlot label="AD_SLOT_TOP" />
      <div className="card p-6">
        {questions.map((question) => <details key={question} className="border-b py-5"><summary className="cursor-pointer text-lg font-black">{question}</summary><p className="mt-3 leading-7 text-[#65736d]">{answer}</p></details>)}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: questions.map((question) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) }) }} />
    </main>
  );
}
