"use client";

import { useState } from "react";

const faqs = [
  {
    question: "WHAT IS SEO?",
    answer:
      "SEO (Search Engine Optimization) makes your website show up higher in Google search results. When someone searches for what you offer, good SEO gets you on page 1 instead of page 10. It includes technical fixes, content optimization, and building your online reputation through reviews and citations.",
  },
  {
    question: "WHAT IS LOCAL SEO?",
    answer:
      "Local SEO gets your business into Google's \"map pack\" - the 3 businesses shown with a map when someone searches \"plumber near me\" or \"coffee shop downtown.\" It involves optimizing your Google Business Profile, building citations across directories, getting reviews, and creating location-specific content.",
  },
  {
    question: "HOW LONG DOES SEO TAKE?",
    answer:
      "Technical fixes can show results in days. Ranking improvements typically take 4-8 weeks for less competitive keywords, 3-6 months for competitive terms. Local SEO often moves faster. We track rankings daily so you see every change.",
  },
  {
    question: "WHY IS THIS SO CHEAP?",
    answer:
      "We automated the work. Most SEO agencies charge $1,500-$10,000/month because they have big teams doing manual work. Our tools do 80% of that automatically. You get the results without paying for overhead.",
  },
  {
    question: "DO YOU WORK WITH AGENCIES?",
    answer:
      "Yes. Our Enterprise plan includes white label reports, bulk scanning, and API access. You can run audits for clients under your own branding. No \"powered by\" footers unless you want them.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-[120px] px-10 bg-navy" id="faq">
      <div className="text-center max-w-[900px] mx-auto mb-20">
        <h2 className="font-heading text-[clamp(3rem,6vw,5rem)] text-[#F5F5F5] tracking-[4px] mb-5">
          QUESTIONS
        </h2>
        <p className="text-2xl text-pink">Direct answers, no corporate speak</p>
      </div>

      <div className="max-w-[900px] mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={faq.question}
            className="bg-[#F5F5F5]/5 border-2 border-pink/30 mb-5 overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full font-heading text-2xl text-pink tracking-[2px] p-[30px] cursor-pointer flex justify-between items-center transition-colors hover:bg-pink/10 text-left bg-transparent border-none"
            >
              {faq.question}
              <span
                className={`text-[2rem] transition-transform ${
                  openIndex === index ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-[500px] pb-[30px] px-[30px]" : "max-h-0"
              }`}
            >
              <p className="text-[#F5F5F5]/90 leading-[1.8] text-lg">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
