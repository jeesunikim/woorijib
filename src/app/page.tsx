"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ZipCodeLookup } from "@/components/zip-code-lookup";
import { HomeSetupForm } from "@/components/home-setup-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type View = "zip" | "setup";

export default function Home() {
  const [view, setView] = useState<View>("zip");
  const [zipCode, setZipCode] = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [address, setAddress] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Detect returning visitor via localStorage (only runs client-side)
  useEffect(() => {
    setMounted(true);
    const visited = localStorage.getItem("woorijib_visited");
    if (visited) setHasVisited(true);
  }, []);

  async function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;
    setAddressLoading(true);
    localStorage.setItem("woorijib_visited", "1");

    const { data, error } = await supabase
      .from("homes")
      .insert({ address: address.trim(), phase: "inspection_complete" })
      .select()
      .single();

    if (error) {
      console.error("Error creating home:", error);
      setAddressLoading(false);
      return;
    }

    router.push(`/home/${data.id}`);
  }

  function handleZipComplete(zip: string) {
    setZipCode(zip);
    localStorage.setItem("woorijib_visited", "1");
    setHasVisited(true);
    setView("setup");
  }

  function handleSkipToSetup() {
    setView("setup");
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <button
              onClick={() => { setView("zip"); setZipCode(""); }}
              className="font-serif text-xl text-foreground hover:text-primary transition-colors"
            >
              WooriJib
            </button>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            {/* Back button when in setup view */}
            {view === "setup" && (
              <button
                onClick={() => setView("zip")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mr-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}

            {/* "Analyze my inspection" shortcut for returning users */}
            {mounted && hasVisited && view === "zip" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSkipToSetup}
                className="gap-1.5 text-sm h-9"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2 2 0 002-2V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                Analyze my inspection
              </Button>
            )}

            {/* Login */}
            <Button variant="ghost" size="sm" className="text-sm h-9 text-muted-foreground hover:text-foreground">
              Log in
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {view === "zip" ? (
            /* Zip Code Lookup View */
            <div className="space-y-10">
              {/* Hero */}
              <div className="text-center space-y-6 max-w-2xl mx-auto">
                <p className="text-sm font-medium text-primary uppercase tracking-wider">
                  Your AI Home Diagnosis Agent
                </p>
                <h1 className="font-serif text-4xl sm:text-5xl text-foreground leading-tight text-balance">
                  What&apos;s really wrong with your home?
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                  That scary inspection report might just list issues that are completely normal for homes in your area.
                </p>

                {/* Address input — primary free trial CTA */}
                <form onSubmit={handleAddressSubmit} className="flex gap-2 max-w-lg mx-auto pt-2">
                  <div className="relative flex-1">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <Input
                      placeholder="Enter your home address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="pl-10 h-12 bg-card border-border/80 text-base"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={addressLoading || !address.trim()}
                    className="h-12 px-5 text-base font-medium shrink-0"
                  >
                    {addressLoading ? "Starting..." : "Try free"}
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground">No account needed &mdash; start in seconds</p>

                {/* Returning user skip prompt */}
                {mounted && hasVisited && (
                  <p className="text-sm text-muted-foreground">
                    Been here before?{" "}
                    <button
                      onClick={handleSkipToSetup}
                      className="text-primary font-medium hover:underline underline-offset-4 transition-colors"
                    >
                      Skip straight to your diagnosis
                    </button>
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 max-w-2xl mx-auto">
                <div className="flex-1 h-px bg-border/60" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">or explore your area first</span>
                <div className="flex-1 h-px bg-border/60" />
              </div>

              {/* Zip Code Component */}
              <ZipCodeLookup onComplete={handleZipComplete} />
            </div>
          ) : (
            /* Home Setup View */
            <div className="max-w-xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                {zipCode && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {zipCode}
                  </div>
                )}
                <h2 className="font-serif text-3xl text-foreground">
                  Create your home profile
                </h2>
                <p className="text-muted-foreground">
                  Add your property details to get a personalized diagnosis of your inspection report.
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border/60 p-8 shadow-sm">
                <HomeSetupForm defaultZip={zipCode} />
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>AI-Powered Analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span>Actionable Reports</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>WooriJib helps homeowners understand their property inspections with AI-powered analysis.</p>
        </div>
      </footer>
    </main>
  );
}
