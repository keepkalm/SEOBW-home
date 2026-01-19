const testimonials = [
  {
    quote:
      "Finally found an SEO tool that shows me exactly what's broken without the enterprise sales pitch. Fixed 23 issues in one afternoon.",
    author: "SARAH CHEN",
    role: "Owner, Chen's Bakery Seattle",
  },
  {
    quote:
      "Went from invisible on Google Maps to #2 in the local pack within 90 days. The citation monitoring alone is worth it.",
    author: "MIKE RODRIGUEZ",
    role: "Rodriguez Plumbing",
  },
  {
    quote:
      "We switched from Semrush to save money and honestly the local SEO features are better. No regrets.",
    author: "ALEX KIM",
    role: "Marketing Director, PNW Dental Group",
  },
];

export function Testimonials() {
  return (
    <section className="py-[120px] px-10 bg-navy">
      <div className="text-center max-w-[900px] mx-auto mb-20">
        <h2 className="font-heading text-[clamp(3rem,6vw,5rem)] text-[#F5F5F5] tracking-[4px] mb-5">
          WHAT PEOPLE SAY
        </h2>
        <p className="text-2xl text-pink">Real feedback from real businesses</p>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.author}
            className="bg-[#F5F5F5]/5 p-[50px] border-l-4 border-pink"
          >
            <p className="text-xl text-[#F5F5F5]/95 leading-[1.8] mb-[30px] italic">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <div className="font-heading text-xl text-pink tracking-[2px] mb-[5px]">
              {testimonial.author}
            </div>
            <div className="text-[#F5F5F5]/60">{testimonial.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
