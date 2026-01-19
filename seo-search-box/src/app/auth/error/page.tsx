"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { Navbar } from "@/components/common/Navbar";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link has expired or has already been used.",
    Default: "An error occurred during authentication.",
  };

  const message = errorMessages[error || ""] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Authentication Error
        </h1>
        <p className="text-slate-400 mb-8">{message}</p>

        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="block w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
