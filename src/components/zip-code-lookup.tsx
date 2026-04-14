"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RegionalData, RegionalIssue } from "@/lib/regional-issues";

interface ZipCodeLookupProps {
  onComplete: (zipCode: string) => void;
}

export function ZipCodeLookup({ onComplete }: ZipCodeLookupProps) {
  const [zipCode, setZipCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<{
    data: RegionalData;
    source: string;
    zipCode: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{5}$/.test(zipCode)) {
      setError("Please enter a valid 5-digit zip code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/regional-issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zipCode }),
      });

      if (!res.ok) throw new Error("Failed to fetch regional data");

      const data = await res.json();
      setResults(data);
    } catch {
      setError("Failed to load regional data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const prevalenceConfig = {
    very_common: {
      label: "Very Common",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    common: {
      label: "Common",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    occasional: {
      label: "Occasional",
      bg: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-200",
      dot: "bg-slate-400",
    },
  };

  if (results) {
    return (
      <div className="space-y-8">
        {/* Results Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {results.zipCode}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-foreground">
            Common issues in {results.data.region}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {results.data.housingContext}
          </p>
          <p className="text-sm text-muted-foreground">
            Median home age: <span className="font-semibold">{results.data.medianHomeAge}</span>
          </p>
        </div>

        {/* Issues Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {results.data.commonIssues.map((issue: RegionalIssue, i: number) => {
            const config = prevalenceConfig[issue.prevalence];
            return (
              <div
                key={i}
                className="bg-card rounded-xl border border-border/60 p-5 space-y-3 hover:border-border transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-foreground leading-tight">{issue.issue}</h3>
                  <span className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border} border`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                    {config.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {issue.description}
                </p>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-border/40">
                  <span className="text-muted-foreground">Typical cost</span>
                  <span className="font-semibold text-foreground">{issue.typicalCost}</span>
                </div>
                {issue.yearsBuiltAffected && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Homes affected</span>
                    <span className="text-muted-foreground font-medium">{issue.yearsBuiltAffected}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-card rounded-2xl border border-border/60 p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/50 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl text-foreground">
              These issues are common—not catastrophic
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Upload your inspection report and we&apos;ll help you understand what&apos;s actually urgent versus what&apos;s just normal wear for homes in your area.
            </p>
          </div>
          <Button size="lg" className="h-12 px-8 text-base" onClick={() => onComplete(results.zipCode)}>
            Analyze My Inspection
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>

        {/* Try another zip */}
        <div className="text-center">
          <button
            onClick={() => setResults(null)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            Try a different zip code
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Zip Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3 max-w-sm mx-auto">
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={5}
            placeholder="Enter zip code"
            value={zipCode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 5);
              setZipCode(val);
              setError("");
            }}
            className="h-12 text-center text-lg tracking-widest bg-card border-border/80 focus:border-primary"
          />
          <Button type="submit" disabled={loading || zipCode.length !== 5} className="h-12 px-6">
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              "Explore"
            )}
          </Button>
        </div>
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
      </form>

      {/* Example zip codes */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">Try an example:</p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {[
            { zip: "94103", label: "San Francisco" },
            { zip: "60614", label: "Chicago" },
            { zip: "02115", label: "Boston" },
            { zip: "33139", label: "Miami" },
          ].map(({ zip, label }) => (
            <button
              key={zip}
              onClick={() => setZipCode(zip)}
              className="px-3 py-1.5 rounded-full text-sm bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
