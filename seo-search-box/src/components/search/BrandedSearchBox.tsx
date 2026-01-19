"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { parseInput } from "@/lib/parsers/inputParser";

const PLACEHOLDER_EXAMPLES = [
  { text: "Enter a URL", example: "mysite.com" },
  { text: "Enter a keyword", example: '"plumber near me"' },
  { text: "Enter a business name", example: "Joe's Pizza" },
  { text: "Enter an address", example: "123 Main St" },
  { text: "Enter a phone number", example: "555-123-4567" },
];

export function BrandedSearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim() || isLoading) return;

      setIsLoading(true);

      try {
        const parsed = parseInput(query);
        const params = new URLSearchParams({
          q: parsed.normalized || query,
          type: parsed.type,
        });

        router.push(`/results?${params.toString()}`);
      } catch (error) {
        console.error("Search error:", error);
        setIsLoading(false);
      }
    },
    [query, isLoading, router]
  );

  const showPlaceholder = !query && !isFocused;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[750px] mx-auto">
      <div className="relative rounded-full p-[3px] bg-pink animate-pulse-glow">
        <div className="flex bg-navy rounded-full overflow-hidden">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder=" "
              aria-label="Enter a URL, keyword, business name, address, or phone number"
              autoComplete="off"
              disabled={isLoading}
              className="w-full font-mono text-base py-[22px] px-[35px] bg-transparent border-none text-[#F5F5F5] outline-none"
            />

            {showPlaceholder && (
              <div
                className="typewriter-container absolute top-0 left-[35px] right-[120px] h-full flex items-center pointer-events-none font-mono text-base"
                aria-hidden="true"
              >
                {PLACEHOLDER_EXAMPLES.map((item, index) => (
                  <span key={index} className="typewriter-text text-[#F5F5F5]/60">
                    {item.text}{" "}
                    <span className="text-[#F5F5F5]/40">(e.g., </span>
                    <span className="text-pink font-medium">{item.example}</span>
                    <span className="text-[#F5F5F5]/40">)</span>
                    <span className="text-pink font-bold animate-blink">_</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="font-heading text-xl bg-pink text-[#F5F5F5] py-[22px] px-[45px] border-none tracking-[2px] cursor-pointer transition-all whitespace-nowrap hover:bg-pink-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                SCANNING...
              </span>
            ) : (
              "SCAN NOW"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
