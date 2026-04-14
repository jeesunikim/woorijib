"use client";

import { useState } from "react";
import { ZipCodeLookup } from "@/components/zip-code-lookup";
import { HomeSetupForm } from "@/components/home-setup-form";

export default function Home() {
  const [showHomeSetup, setShowHomeSetup] = useState(false);
  const [zipCode, setZipCode] = useState("");

  function handleZipComplete(zip: string) {
    setZipCode(zip);
    setShowHomeSetup(true);
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="font-serif text-xl text-foreground">WooriJib</span>
          </div>
          {showHomeSetup && (
            <button
              onClick={() => setShowHomeSetup(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {!showHomeSetup ? (
            /* Zip Code Lookup View */
            <div className="space-y-10">
              {/* Hero */}
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <p className="text-sm font-medium text-primary uppercase tracking-wider">
                  Your AI Home Diagnosis Agent
                </p>
                <h1 className="font-serif text-4xl sm:text-5xl text-foreground leading-tight text-balance">
                  What&apos;s really wrong with your home?
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                  That scary inspection report might just list issues that are completely normal for homes in your area. Enter your zip code to find out.
                </p>
              </div>

              {/* Zip Code Component */}
              <ZipCodeLookup onComplete={handleZipComplete} />
            </div>
          ) : (
            /* Home Setup View */
            <div className="max-w-xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {zipCode}
                </div>
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
              <div className="flex items-center justify-center gap-8 pt-4">
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
