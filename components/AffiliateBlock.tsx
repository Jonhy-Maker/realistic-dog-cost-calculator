export function AffiliateBlock() {
  const items = ["Dog food", "Dog bed", "Crate", "Leash", "Insurance", "Grooming tools", "Toys", "Training gear"];
  return <section className="card bg-[#f6f7f3] p-6">
    <div className="text-xs font-black uppercase tracking-wider text-[#1f7a58]">Recommended for your dog</div>
    <h3 className="mt-2 text-xl font-black">Useful ownership essentials</h3>
    <p className="mt-2 text-sm text-[#65736d]">This area is reserved for clearly labeled recommendations after approved affiliate partners and destinations are configured.</p>
    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{items.map((item) => <div key={item} className="rounded-xl bg-white p-3 text-sm font-bold">{item}</div>)}</div>
    <p className="mt-4 text-xs text-[#65736d]">No affiliate links are active in this build.</p>
  </section>;
}
