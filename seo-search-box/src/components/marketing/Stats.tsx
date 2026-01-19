const stats = [
  { number: "2010", label: "FOUNDED IN SEATTLE" },
  { number: "47", label: "POINT SEO AUDIT" },
  { number: "50+", label: "CITATION DIRECTORIES" },
  { number: "$0", label: "TO GET STARTED" },
];

export function Stats() {
  return (
    <section className="py-[120px] px-10 bg-[#F5F5F5]">
      <div className="text-center max-w-[900px] mx-auto mb-20">
        <h2 className="font-heading text-[clamp(3rem,6vw,5rem)] text-navy tracking-[4px] mb-5">
          BY THE NUMBERS
        </h2>
        <p className="text-2xl text-pink">
          Results that speak louder than marketing copy
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-[60px]">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-heading text-[clamp(3.5rem,8vw,5rem)] text-pink tracking-[2px] leading-none mb-[15px]">
              {stat.number}
            </div>
            <div className="text-xl text-navy tracking-[1px]">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
