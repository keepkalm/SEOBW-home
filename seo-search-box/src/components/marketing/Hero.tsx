import { BrandedSearchBox } from "@/components/search/BrandedSearchBox";

export function Hero() {
  return (
    <section className="min-h-[90vh] flex items-center py-20 px-10 relative overflow-hidden bg-navy" id="scan">
      <div className="max-w-[1000px] mx-auto text-center">
        <h1 className="font-heading text-[clamp(3rem,10vw,7rem)] text-[#F5F5F5] tracking-[4px] leading-[0.95] mb-[30px]">
          SEO THAT <span className="text-pink">ACTUALLY WORKS</span>
        </h1>

        <p className="text-2xl text-pink mb-5 tracking-[1px]">
          Free SEO audit. Rank tracking. Local SEO tools.
        </p>

        <p className="text-xl text-[#F5F5F5]/90 leading-[1.8] mb-[50px] max-w-[700px] mx-auto">
          Skip the corporate bureaucracy. Get a free SEO audit in 30 seconds. Track your rankings. Fix what&apos;s broken. No sales calls required.
        </p>

        <BrandedSearchBox />

        <p className="font-mono text-sm text-[#F5F5F5]/50 mt-[30px]">
          <strong className="text-pink">12,847</strong> sites scanned this week &bull; Since 2010 &bull; Seattle, WA
        </p>
      </div>
    </section>
  );
}
