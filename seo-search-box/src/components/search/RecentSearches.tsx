"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Globe, Hash, Phone, Building2, MapPin, ArrowRight } from "lucide-react";
import { cn, formatRelativeDate } from "@/lib/utils";
import type { InputType } from "@/lib/parsers/inputParser";

interface RecentSearch {
  id: string;
  inputType: InputType;
  inputValue: string;
  createdAt: string;
}

const TYPE_ICONS: Record<InputType, typeof Hash> = {
  keyword: Hash,
  url: Globe,
  phone: Phone,
  business: Building2,
  address: MapPin,
};

const TYPE_COLORS: Record<InputType, string> = {
  keyword: "text-blue-400",
  url: "text-green-400",
  phone: "text-purple-400",
  business: "text-orange-400",
  address: "text-pink-400",
};

export function RecentSearches() {
  const [searches, setSearches] = useState<RecentSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentSearches() {
      try {
        const response = await fetch("/api/history?limit=5");
        if (response.ok) {
          const data = await response.json();
          setSearches(data.searches || []);
        }
      } catch (error) {
        console.error("Failed to fetch recent searches:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentSearches();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Recent Searches</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-lg bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (searches.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="mx-auto h-12 w-12 text-slate-600 mb-3" />
        <h3 className="text-lg font-medium text-white mb-1">No recent searches</h3>
        <p className="text-slate-400">Your search history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Recent Searches</h3>
        <Link
          href="/history"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="space-y-2">
        {searches.map((search) => {
          const Icon = TYPE_ICONS[search.inputType];
          return (
            <Link
              key={search.id}
              href={`/results?q=${encodeURIComponent(search.inputValue)}&type=${search.inputType}`}
              className="flex items-center justify-between rounded-lg bg-slate-800/50 border border-slate-700 p-4 hover:bg-slate-800 hover:border-slate-600 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700",
                    TYPE_COLORS[search.inputType]
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-white">{search.inputValue}</p>
                  <p className="text-sm text-slate-400">
                    {formatRelativeDate(search.createdAt)}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
