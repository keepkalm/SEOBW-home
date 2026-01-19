"use client";

import { useState } from "react";
import Link from "next/link";

export function MarketingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-navy-light backdrop-blur-[10px] border-b-2 border-pink sticky top-0 z-[100]">
      <div className="max-w-[1400px] mx-auto px-10 py-5 flex justify-between items-center">
        <Link
          href="/"
          className="font-heading text-[2rem] text-[#F5F5F5] tracking-[2px] no-underline transition-all hover:text-pink"
        >
          SEO BANDWAGON
        </Link>

        <ul className="hidden md:flex gap-10 list-none">
          <li>
            <Link
              href="#services"
              className="font-heading text-xl text-[#F5F5F5]/70 no-underline tracking-[1px] transition-all hover:text-[#F5F5F5]"
            >
              SERVICES
            </Link>
          </li>
          <li>
            <Link
              href="#pricing"
              className="font-heading text-xl text-[#F5F5F5]/70 no-underline tracking-[1px] transition-all hover:text-[#F5F5F5]"
            >
              PRICING
            </Link>
          </li>
          <li>
            <Link
              href="#faq"
              className="font-heading text-xl text-[#F5F5F5]/70 no-underline tracking-[1px] transition-all hover:text-[#F5F5F5]"
            >
              FAQ
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="font-heading text-xl text-[#F5F5F5]/70 no-underline tracking-[1px] transition-all hover:text-[#F5F5F5]"
            >
              BLOG
            </Link>
          </li>
        </ul>

        <Link
          href="#scan"
          className="hidden md:block font-heading text-xl bg-pink text-[#F5F5F5] py-3 px-[30px] border-none tracking-[2px] no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(245,55,150,0.5)]"
        >
          FREE AUDIT
        </Link>

        <button
          className="md:hidden bg-transparent border-none cursor-pointer p-2.5"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="block w-[25px] h-[3px] bg-[#F5F5F5] my-[5px] transition-all"></span>
          <span className="block w-[25px] h-[3px] bg-[#F5F5F5] my-[5px] transition-all"></span>
          <span className="block w-[25px] h-[3px] bg-[#F5F5F5] my-[5px] transition-all"></span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-navy border-t border-pink/30">
          <ul className="list-none py-4">
            <li>
              <Link
                href="#services"
                className="block font-heading text-xl text-[#F5F5F5]/70 no-underline tracking-[1px] py-3 px-10 hover:text-[#F5F5F5] hover:bg-pink/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                SERVICES
              </Link>
            </li>
            <li>
              <Link
                href="#pricing"
                className="block font-heading text-xl text-[#F5F5F5]/70 no-underline tracking-[1px] py-3 px-10 hover:text-[#F5F5F5] hover:bg-pink/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                PRICING
              </Link>
            </li>
            <li>
              <Link
                href="#faq"
                className="block font-heading text-xl text-[#F5F5F5]/70 no-underline tracking-[1px] py-3 px-10 hover:text-[#F5F5F5] hover:bg-pink/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="block font-heading text-xl text-[#F5F5F5]/70 no-underline tracking-[1px] py-3 px-10 hover:text-[#F5F5F5] hover:bg-pink/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                BLOG
              </Link>
            </li>
            <li className="px-10 py-3">
              <Link
                href="#scan"
                className="block font-heading text-xl bg-pink text-[#F5F5F5] py-3 px-[30px] border-none tracking-[2px] no-underline text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FREE AUDIT
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
