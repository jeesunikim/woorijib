// src/app/home/[id]/page.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PhaseSelector } from "@/components/phase-selector";
import { EvidenceUpload } from "@/components/evidence-upload";
import type { EvidenceItem } from "@/components/evidence-upload";
import { DiagnosisCard } from "@/components/diagnosis-card";
import type { IssueStatus } from "@/components/diagnosis-card";
import { ChatDrawer } from "@/components/chat-drawer";
import { createClient } from "@/lib/supabase/client";
import type { Diagnosis } from "@/types/diagnosis";

interface SavedSession {
  id: string;
  diagnoses: Diagnosis[];
  created_at: string;
}

export default function HomeDashboard() {
  const params = useParams();
  const homeId = params.id as string;
  const supabase = createClient();

  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [pastSessions, setPastSessions] = useState<SavedSession[]>([]);
  const [viewingSessionId, setViewingSessionId] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [issueStatuses, setIssueStatuses] = useState<Record<string, IssueStatus>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all saved diagnosis sessions on mount
  useEffect(() => {
    async function loadSessions() {
      const { data } = await supabase
        .from("diagnoses")
        .select("id, result, created_at")
        .eq("home_id", homeId)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        const sessions: SavedSession[] = data.map((row) => ({
          id: row.id,
          diagnoses: row.result?.diagnoses || [],
          created_at: row.created_at,
        }));
        setPastSessions(sessions);
        // Show most recent by default
        setDiagnoses(sessions[0].diagnoses);
        setViewingSessionId(sessions[0].id);
      }
    }
    loadSessions();
  }, [homeId]);

  function handleStatusChange(key: string, status: IssueStatus) {
    setIssueStatuses((prev) => ({ ...prev, [key]: status }));
  }

  const handleEvidenceChange = useCallback((items: EvidenceItem[]) => {
    setEvidence(items);
  }, []);

  function handleNewSession() {
    setDiagnoses([]);
    setViewingSessionId(null);
    setError(null);
    setResetKey((k) => k + 1);
  }

  async function handleDeleteSession(sessionId: string) {
    await supabase.from("diagnoses").delete().eq("id", sessionId);
    setPastSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (viewingSessionId === sessionId) {
      setDiagnoses([]);
      setViewingSessionId(null);
    }
  }

  function handleViewSession(session: SavedSession) {
    setDiagnoses(session.diagnoses);
    setViewingSessionId(session.id);
    setError(null);
  }

  async function handleDiagnose() {
    if (evidence.length === 0) return;
    setIsLoading(true);
    setError(null);
    setDiagnoses([]);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeId,
          evidenceIds: evidence.map((e) => e.id),
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(`Diagnosis failed: ${text}`);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      if (data.diagnoses) {
        setDiagnoses(data.diagnoses);
        // Persist to Supabase
        const { data: inserted } = await supabase
          .from("diagnoses")
          .insert({
            home_id: homeId,
            evidence_ids: evidence.map((e) => e.id),
            result: data,
          })
          .select("id, created_at")
          .single();

        if (inserted) {
          const newSession: SavedSession = {
            id: inserted.id,
            diagnoses: data.diagnoses,
            created_at: inserted.created_at,
          };
          setPastSessions((prev) => [newSession, ...prev]);
          setViewingSessionId(inserted.id);
        }
      }
    } catch (err) {
      setError(`Diagnosis error: ${err}`);
    }

    setIsLoading(false);
  }

  const chatContext = diagnoses.length > 0
    ? `Home ID: ${homeId}\n\nDiagnoses:\n${JSON.stringify(diagnoses, null, 2)}`
    : `Home ID: ${homeId}\n\nNo diagnoses yet.`;

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
          {/* Phase Selector in header */}
          <PhaseSelector current="inspection_complete" />
        </div>
      </header>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-8">

        {/* Past Sessions */}
        {pastSessions.length > 0 && (
          <section className="bg-card rounded-xl border border-border/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="font-serif text-lg text-foreground">Diagnosis History</h2>
                <p className="text-sm text-muted-foreground">View past analyses or start a new one</p>
              </div>
              <Button variant="default" size="sm" onClick={handleNewSession} className="gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                New Diagnosis
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {pastSessions.map((session) => (
                <div key={session.id} className="group inline-flex items-center gap-1.5 bg-muted/50 rounded-lg p-1 pr-2">
                  <button
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewingSessionId === session.id 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-background text-foreground hover:bg-accent"
                    }`}
                    onClick={() => handleViewSession(session)}
                  >
                    {new Date(session.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    <span className="ml-1.5 text-xs opacity-70">({session.diagnoses.length})</span>
                  </button>
                  <button
                    className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                    onClick={() => handleDeleteSession(session.id)}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Evidence Upload — show when no session is being viewed */}
        {!viewingSessionId && (
          <section className="bg-card rounded-xl border border-border/60 p-6 space-y-5">
            <div className="space-y-1">
              <h2 className="font-serif text-xl text-foreground">Upload Evidence</h2>
              <p className="text-sm text-muted-foreground">
                Add your inspection photos, contractor audio recordings, and documents for AI analysis.
              </p>
            </div>
            <EvidenceUpload key={resetKey} homeId={homeId} onEvidenceChange={handleEvidenceChange} keepTypes={["document"]} />
            
            {/* Diagnose Button */}
            {evidence.length > 0 && (
              <Button
                size="lg"
                onClick={handleDiagnose}
                disabled={isLoading}
                className="w-full h-12 text-base font-medium gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing evidence...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Analyze {evidence.length} file{evidence.length !== 1 ? "s" : ""}
                  </>
                )}
              </Button>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}
          </section>
        )}

        {/* Diagnosis Results */}
        {diagnoses.length > 0 && (() => {
          const severityOrder = { critical: 0, moderate: 1, minor: 2 };
          const sorted = [...diagnoses].sort(
            (a, b) => (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3)
          );
          const critical = sorted.filter((d) => d.severity === "critical");
          const moderate = sorted.filter((d) => d.severity === "moderate");
          const minor = sorted.filter((d) => d.severity === "minor");

          return (
            <section className="space-y-6">
              {/* Header with summary */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="font-serif text-2xl text-foreground">
                    Diagnosis Results
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {diagnoses.length} issue{diagnoses.length !== 1 ? "s" : ""} found in your home inspection
                  </p>
                </div>
                
                {/* Summary counts */}
                <div className="flex gap-2">
                  {critical.length > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm font-semibold text-red-700">{critical.length}</span>
                      <span className="text-sm text-red-600">Critical</span>
                    </div>
                  )}
                  {moderate.length > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-sm font-semibold text-amber-700">{moderate.length}</span>
                      <span className="text-sm text-amber-600">Moderate</span>
                    </div>
                  )}
                  {minor.length > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-semibold text-emerald-700">{minor.length}</span>
                      <span className="text-sm text-emerald-600">Minor</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cards grouped by severity */}
              {critical.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-5 rounded-full bg-red-500" />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Critical Issues</h3>
                  </div>
                  <div className="space-y-4">
                    {critical.map((d, i) => {
                      const key = `c-${i}`;
                      return <DiagnosisCard key={key} diagnosis={d} status={issueStatuses[key] || "to_do"} onStatusChange={(s) => handleStatusChange(key, s)} />;
                    })}
                  </div>
                </div>
              )}
              {moderate.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-5 rounded-full bg-amber-500" />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Moderate Issues</h3>
                  </div>
                  <div className="space-y-4">
                    {moderate.map((d, i) => {
                      const key = `m-${i}`;
                      return <DiagnosisCard key={key} diagnosis={d} status={issueStatuses[key] || "to_do"} onStatusChange={(s) => handleStatusChange(key, s)} />;
                    })}
                  </div>
                </div>
              )}
              {minor.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-5 rounded-full bg-emerald-500" />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Minor Issues</h3>
                  </div>
                  <div className="space-y-4">
                    {minor.map((d, i) => {
                      const key = `n-${i}`;
                      return <DiagnosisCard key={key} diagnosis={d} status={issueStatuses[key] || "to_do"} onStatusChange={(s) => handleStatusChange(key, s)} />;
                    })}
                  </div>
                </div>
              )}
            </section>
          );
        })()}
      </div>

      {/* Chat Drawer */}
      <ChatDrawer context={chatContext} />
    </main>
  );
}
