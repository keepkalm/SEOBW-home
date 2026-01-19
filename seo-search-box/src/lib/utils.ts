import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format large numbers with abbreviations
 */
export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "N/A";

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toLocaleString();
}

/**
 * Format currency values
 */
export function formatCurrency(
  value: number | null | undefined,
  currency: string = "USD"
): string {
  if (value === null || value === undefined) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";

  return (value * 100).toFixed(1) + "%";
}

/**
 * Get color class for score values (0-100)
 */
export function getScoreColor(score: number | null | undefined): string {
  if (score === null || score === undefined) return "text-slate-400";

  if (score >= 90) return "text-green-400";
  if (score >= 70) return "text-lime-400";
  if (score >= 50) return "text-yellow-400";
  if (score >= 30) return "text-orange-400";
  return "text-red-400";
}

/**
 * Get background color class for score values
 */
export function getScoreBgColor(score: number | null | undefined): string {
  if (score === null || score === undefined) return "bg-slate-700";

  if (score >= 90) return "bg-green-500/20";
  if (score >= 70) return "bg-lime-500/20";
  if (score >= 50) return "bg-yellow-500/20";
  if (score >= 30) return "bg-orange-500/20";
  return "bg-red-500/20";
}

/**
 * Get label for competition level
 */
export function getCompetitionLabel(value: number | null | undefined): string {
  if (value === null || value === undefined) return "Unknown";

  if (value >= 0.7) return "High";
  if (value >= 0.4) return "Medium";
  return "Low";
}

/**
 * Get label for search intent
 */
export function getIntentLabel(intent: string | null | undefined): string {
  const labels: Record<string, string> = {
    informational: "Informational",
    commercial: "Commercial",
    transactional: "Transactional",
    navigational: "Navigational",
  };
  return labels[intent || ""] || "Unknown";
}

/**
 * Get color for search intent
 */
export function getIntentColor(intent: string | null | undefined): string {
  const colors: Record<string, string> = {
    informational: "bg-blue-500/20 text-blue-400",
    commercial: "bg-purple-500/20 text-purple-400",
    transactional: "bg-green-500/20 text-green-400",
    navigational: "bg-orange-500/20 text-orange-400",
  };
  return colors[intent || ""] || "bg-slate-500/20 text-slate-400";
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Format date relative to now
 */
export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
