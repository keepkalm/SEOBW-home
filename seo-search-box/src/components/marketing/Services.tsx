import Link from "next/link";

const services = [
  {
    icon: "📍",
    title: "LOCAL SEO",
    description:
      "Show up in Google Maps. Dominate local search. We optimize your Google Business Profile, build citations across 50+ directories, and track your local rankings by neighborhood.",
    link: "/local-seo",
    linkText: "LEARN MORE →",
  },
  {
    icon: "📊",
    title: "RANK TRACKING",
    description:
      "Daily rank checks for your keywords. Track competitors. Monitor local rankings. Get alerts when you hit page 1. Free for 10 keywords, unlimited on Pro.",
    link: "/rank-tracker",
    linkText: "START TRACKING →",
  },
  {
    icon: "🔧",
    title: "TECHNICAL SEO",
    description:
      "47-point technical audit. Find broken links, missing tags, slow pages. Get a prioritized fix list with time estimates. WordPress automation available.",
    link: "/technical-seo",
    linkText: "RUN AUDIT →",
  },
];

export function Services() {
  return (
    <section className="py-[120px] px-10 bg-navy" id="services">
      <div className="text-center max-w-[900px] mx-auto mb-20">
        <h2 className="font-heading text-[clamp(3rem,6vw,5rem)] text-[#F5F5F5] tracking-[4px] mb-5">
          WHAT WE DO
        </h2>
        <p className="text-2xl text-pink">
          SEO tools and services without the corporate nonsense
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((service) => (
          <div
            key={service.title}
            className="bg-[#F5F5F5]/5 p-[50px] border-2 border-pink/30 transition-all hover:border-pink hover:-translate-y-[5px] hover:bg-[#F5F5F5]/[0.08]"
          >
            <div className="text-6xl mb-[30px]">{service.icon}</div>
            <h3 className="font-heading text-[2rem] text-pink tracking-[2px] mb-5">
              {service.title}
            </h3>
            <p className="text-[#F5F5F5]/90 leading-[1.8] mb-[30px]">
              {service.description}
            </p>
            <Link
              href={service.link}
              className="font-heading text-lg text-pink no-underline tracking-[1px] hover:underline"
            >
              {service.linkText}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
