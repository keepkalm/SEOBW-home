"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Search, User, LogOut, History, Bookmark } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Search className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">
              SEO Search Box
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Search
            </Link>
            {session && (
              <>
                <Link
                  href="/dashboard"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/history"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  History
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-slate-700" />
            ) : session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <button
                onClick={() => signIn()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function UserMenu({ user }: { user?: { name?: string | null; email?: string | null; image?: string | null } | null }) {
  if (!user) return null;

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-800 transition-colors">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700">
            <User className="h-4 w-4 text-slate-300" />
          </div>
        )}
        <span className="text-sm text-slate-300 hidden md:block">
          {user.name || user.email}
        </span>
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-slate-800 border border-slate-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <User className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/history"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <History className="h-4 w-4" />
            Search History
          </Link>
          <Link
            href="/saved"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Bookmark className="h-4 w-4" />
            Saved Searches
          </Link>
          <hr className="my-2 border-slate-700" />
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
