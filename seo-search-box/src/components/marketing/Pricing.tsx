import Link from "next/link";

const plans = [
  {
    name: "FREE",
    price: "$0",
    period: "forever",
    features: [
      "SEO audits (unlimited scans)",
      "10 keywords tracked",
      "Citation monitoring",
      "Weekly email reports",
      "1 business location",
    ],
    cta: "START FREE",
    ctaLink: "#scan",
    badge: null,
  },
  {
    name: "PRO",
    price: "$99",
    period: "/month",
    features: [
      "Everything in Free",
      "Unlimited keywords",
      "Competitor tracking",
      "Unlimited locations",
      "Priority support",
    ],
    cta: "GO PRO",
    ctaLink: "/signup?plan=pro",
    badge: "POPULAR",
  },
  {
    name: "ENTERPRISE",
    price: "CUSTOM",
    period: "let's talk",
    features: [
      "Everything in Pro",
      "White label reports",
      "API access",
      "Dedicated support",
      "Custom development",
    ],
    cta: "CONTACT US",
    ctaLink: "/contact",
    badge: null,
  },
];

export function Pricing() {
  return (
    <section className="py-[120px] px-10 bg-[#F5F5F5]" id="pricing">
      <div className="text-center max-w-[900px] mx-auto mb-20">
        <h2 className="font-heading text-[clamp(3rem,6vw,5rem)] text-navy tracking-[4px] mb-5">
          PRICING
        </h2>
        <p className="text-2xl text-pink">
          No hidden fees. No surprise charges. No contracts.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-navy p-[60px_40px] text-center border-t-[6px] border-pink relative transition-all hover:scale-105 hover:shadow-[0_20px_60px_rgba(245,55,150,0.3)]"
          >
            {plan.badge && (
              <span className="absolute top-[30px] right-[30px] bg-pink text-[#F5F5F5] py-2 px-5 font-heading text-base tracking-[2px]">
                {plan.badge}
              </span>
            )}

            <h3 className="font-heading text-[2.5rem] text-pink tracking-[3px] mb-[30px]">
              {plan.name}
            </h3>

            <div className="font-heading text-[5rem] text-[#F5F5F5] tracking-[2px] mb-2.5">
              {plan.price}
            </div>

            <div className="text-xl text-[#F5F5F5]/70 mb-10">{plan.period}</div>

            <ul className="list-none mb-10 text-left">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="py-[15px] border-b border-[#F5F5F5]/10 text-[#F5F5F5]/90"
                >
                  <span className="text-pink font-bold mr-2.5">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={plan.ctaLink}
              className="block w-full font-heading text-xl bg-pink text-[#F5F5F5] py-[18px] px-[45px] tracking-[2px] no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(245,55,150,0.5)]"
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
