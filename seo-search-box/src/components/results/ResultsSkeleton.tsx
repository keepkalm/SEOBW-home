import type { InputType } from "@/lib/parsers/inputParser";

interface ResultsSkeletonProps {
  type: InputType;
}

export function ResultsSkeleton({ type }: ResultsSkeletonProps) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-slate-800/50 border border-slate-700 p-6"
          >
            <div className="h-4 w-20 bg-slate-700 rounded mb-3" />
            <div className="h-8 w-24 bg-slate-700 rounded" />
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Large Card */}
          <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-6">
            <div className="h-6 w-32 bg-slate-700 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 w-48 bg-slate-700 rounded" />
                  <div className="h-4 w-16 bg-slate-700 rounded" />
                </div>
              ))}
            </div>
          </div>

          {type === "url" && (
            <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-6">
              <div className="h-6 w-40 bg-slate-700 rounded mb-4" />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center">
                    <div className="h-16 w-16 mx-auto bg-slate-700 rounded-full mb-2" />
                    <div className="h-4 w-20 mx-auto bg-slate-700 rounded" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Info Card */}
          <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-6">
            <div className="h-6 w-24 bg-slate-700 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="h-3 w-16 bg-slate-700 rounded mb-1" />
                  <div className="h-4 w-full bg-slate-700 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-6">
            <div className="h-6 w-28 bg-slate-700 rounded mb-4" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-6 w-16 bg-slate-700 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Message */}
      <div className="text-center py-4">
        <p className="text-slate-400">
          Analyzing {type === "url" ? "domain" : type}...
        </p>
      </div>
    </div>
  );
}
