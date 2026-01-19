import Link from "next/link";

const footerLinks = {
  tools: [
    { label: "SEO Audit", href: "/seo-audit" },
    { label: "Rank Tracker", href: "/rank-tracker" },
    { label: "Citation Monitor", href: "/citation-monitor" },
    { label: "Keyword Research", href: "/keyword-research" },
  ],
  services: [
    { label: "Local SEO", href: "/local-seo" },
    { label: "Technical SEO", href: "/technical-seo" },
    { label: "WordPress SEO", href: "/wordpress-seo" },
    { label: "SEO Consulting", href: "/seo-consulting" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Pricing", href: "#pricing" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black py-[100px] px-10 border-t-4 border-pink">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[60px] mb-20">
          <div>
            <Link
              href="/"
              className="block font-heading text-5xl text-[#F5F5F5] tracking-[3px] mb-5 no-underline transition-all hover:text-pink"
            >
              SEO BANDWAGON
            </Link>
            <p className="text-xl text-pink mb-[30px]">
              SEO without the corporate nonsense
            </p>
            <p className="text-[#F5F5F5]/70 leading-[1.8]">
              Built in Port Townsend, WA since 2010. SEO tools for small businesses who want results, not meetings.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-[1.75rem] text-pink tracking-[2px] mb-[25px]">
              TOOLS
            </h3>
            <ul className="list-none">
              {footerLinks.tools.map((link) => (
                <li key={link.href} className="mb-[15px]">
                  <Link
                    href={link.href}
                    className="text-[#F5F5F5]/70 no-underline text-lg transition-all hover:text-pink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-[1.75rem] text-pink tracking-[2px] mb-[25px]">
              SERVICES
            </h3>
            <ul className="list-none">
              {footerLinks.services.map((link) => (
                <li key={link.href} className="mb-[15px]">
                  <Link
                    href={link.href}
                    className="text-[#F5F5F5]/70 no-underline text-lg transition-all hover:text-pink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-[1.75rem] text-pink tracking-[2px] mb-[25px]">
              COMPANY
            </h3>
            <ul className="list-none">
              {footerLinks.company.map((link) => (
                <li key={link.href} className="mb-[15px]">
                  <Link
                    href={link.href}
                    className="text-[#F5F5F5]/70 no-underline text-lg transition-all hover:text-pink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t-2 border-pink/30 text-center text-[#F5F5F5]/50">
          <p>
            © 2026 SEO Bandwagon &bull; Port Townsend, WA &bull;{" "}
            <Link href="/privacy" className="text-pink hover:underline">
              Privacy
            </Link>{" "}
            &bull;{" "}
            <Link href="/terms" className="text-pink hover:underline">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
