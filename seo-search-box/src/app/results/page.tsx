import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { SearchBox } from "@/components/search/SearchBox";
import { ResultsPanel } from "@/components/results/ResultsPanel";
import { ResultsSkeleton } from "@/components/results/ResultsSkeleton";
import type { InputType } from "@/lib/parsers/inputParser";

interface ResultsPageProps {
  searchParams: Promise<{
    q?: string;
    type?: InputType;
  }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const query = params.q;
  const inputType = params.type || "keyword";

  if (!query) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Search Box at top */}
        <div className="max-w-4xl mx-auto mb-8">
          <SearchBox />
        </div>

        {/* Results Section */}
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">
              Results for &quot;{query}&quot;
            </h1>
            <p className="text-slate-400 mt-1">
              Analyzing as: <span className="text-blue-400 capitalize">{inputType}</span>
            </p>
          </div>

          <Suspense fallback={<ResultsSkeleton type={inputType} />}>
            <ResultsPanel query={query} type={inputType} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
