// src/app/home/[id]/page.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

  function getIssueKey(d: Diagnosis, i: number) {
    return `${viewingSessionId || "new"}-${i}`;
  }

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
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">WooriJib</h1>
          <p className="text-muted-foreground mt-1">
            Inspection Complete — Upload evidence and get your diagnosis
          </p>
        </div>

        {/* Phase Selector */}
        <PhaseSelector current="inspection_complete" />

        {/* Past Sessions */}
        {pastSessions.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Diagnosis History</h2>
              <Button variant="outline" size="sm" onClick={handleNewSession}>
                + New Diagnosis
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {pastSessions.map((session) => (
                <span key={session.id} className="inline-flex items-center gap-1">
                  <Badge
                    variant={viewingSessionId === session.id ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleViewSession(session)}
                  >
                    {new Date(session.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    {" "}({session.diagnoses.length} issues)
                  </Badge>
                  <button
                    className="text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteSession(session.id)}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </section>
        )}

        <Separator />

        {/* Evidence Upload — show when no session is being viewed */}
        {!viewingSessionId && (
          <>
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Evidence</h2>
              <p className="text-sm text-muted-foreground">
                Add your inspection photos, contractor audio, and documents.
              </p>
              <EvidenceUpload key={resetKey} homeId={homeId} onEvidenceChange={handleEvidenceChange} keepTypes={["document"]} />
            </section>

            {/* Diagnose Button */}
            {evidence.length > 0 && (
              <Button
                size="lg"
                onClick={handleDiagnose}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Analyzing evidence..." : `Diagnose (${evidence.length} files)`}
              </Button>
            )}
          </>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
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
              <h2 className="text-xl font-semibold">
                Diagnosis ({diagnoses.length} issue{diagnoses.length !== 1 ? "s" : ""} found)
              </h2>

              {/* Summary counts */}
              <div className="flex gap-3">
                {critical.length > 0 && (
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    {critical.length} Critical
                  </Badge>
                )}
                {moderate.length > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    {moderate.length} Moderate
                  </Badge>
                )}
                {minor.length > 0 && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {minor.length} Minor
                  </Badge>
                )}
              </div>

              {/* Cards grouped by severity */}
              {critical.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide">Critical</h3>
                  {critical.map((d, i) => {
                    const key = `c-${i}`;
                    return <DiagnosisCard key={key} diagnosis={d} status={issueStatuses[key] || "to_do"} onStatusChange={(s) => handleStatusChange(key, s)} />;
                  })}
                </div>
              )}
              {moderate.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">Moderate</h3>
                  {moderate.map((d, i) => {
                    const key = `m-${i}`;
                    return <DiagnosisCard key={key} diagnosis={d} status={issueStatuses[key] || "to_do"} onStatusChange={(s) => handleStatusChange(key, s)} />;
                  })}
                </div>
              )}
              {minor.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide">Minor</h3>
                  {minor.map((d, i) => {
                    const key = `n-${i}`;
                    return <DiagnosisCard key={key} diagnosis={d} status={issueStatuses[key] || "to_do"} onStatusChange={(s) => handleStatusChange(key, s)} />;
                  })}
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
