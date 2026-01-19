import Link from "next/link";

export function CTA() {
  return (
    <section className="py-[120px] px-10 bg-navy text-center border-y-4 border-pink">
      <div className="max-w-[900px] mx-auto">
        <h2 className="font-heading text-[clamp(3rem,6vw,5rem)] text-[#F5F5F5] tracking-[4px] mb-[30px]">
          READY TO FIX YOUR SEO?
        </h2>

        <p className="text-2xl text-pink mb-[50px]">
          Free audit shows what&apos;s broken. Free rank tracking shows where you stand. No credit card required.
        </p>

        <Link
          href="#scan"
          className="inline-block font-heading text-xl bg-pink text-[#F5F5F5] py-[18px] px-[45px] tracking-[2px] no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(245,55,150,0.5)]"
        >
          SCAN YOUR SITE NOW
        </Link>
      </div>
    </section>
  );
}
