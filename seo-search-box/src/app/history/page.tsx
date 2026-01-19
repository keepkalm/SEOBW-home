import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserSearches } from "@/lib/db/queries";
import { Navbar } from "@/components/common/Navbar";
import { HistoryClient } from "@/components/history/HistoryClient";

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch user's search history
  const searches = session.user.id
    ? await getUserSearches(session.user.id, 100, 0)
    : [];

  // Transform for client component
  const formattedSearches = searches.map((search) => ({
    id: search.id,
    inputType: search.inputType,
    inputValue: search.inputValue,
    normalizedValue: search.normalizedValue,
    createdAt: search.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <HistoryClient searches={formattedSearches} />
    </div>
  );
}
