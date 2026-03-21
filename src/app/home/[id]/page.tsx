// src/app/home/[id]/page.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EvidenceUpload } from "@/components/evidence-upload";
import { DiagnosisCard } from "@/components/diagnosis-card";
import { ChatDrawer } from "@/components/chat-drawer";
import { diagnosisResultSchema } from "@/types/diagnosis";
import { createClient } from "@/lib/supabase/client";
import type { Diagnosis } from "@/types/diagnosis";

interface EvidenceItem {
  id: string;
  type: "photo" | "audio" | "document";
  label: string;
  file: File;
  storage_path: string;
}

export default function HomeDashboard() {
  const params = useParams();
  const homeId = params.id as string;
  const supabase = createClient();

  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [savedDiagnoses, setSavedDiagnoses] = useState<Diagnosis[]>([]);

  const { object, submit, isLoading } = useObject({
    api: "/api/diagnose",
    schema: diagnosisResultSchema,
  });

  // When streaming completes, save to Supabase
  const currentDiagnoses = object?.diagnoses as Diagnosis[] | undefined;
  useEffect(() => {
    if (!isLoading && currentDiagnoses && currentDiagnoses.length > 0) {
      setSavedDiagnoses(currentDiagnoses);
      // Persist to Supabase
      supabase
        .from("diagnoses")
        .insert({
          home_id: homeId,
          evidence_ids: evidence.map((e) => e.id),
          result: { diagnoses: currentDiagnoses },
        })
        .then(({ error }) => {
          if (error) console.error("Failed to save diagnosis:", error);
        });
    }
  }, [isLoading, currentDiagnoses]);

  const handleEvidenceChange = useCallback((items: EvidenceItem[]) => {
    setEvidence(items);
  }, []);

  function handleDiagnose() {
    if (evidence.length === 0) return;
    // useObject sends JSON body — the API route needs to accept this
    submit({
      homeId,
      evidenceIds: evidence.map((e) => e.id),
    });
  }

  const diagnoses = (currentDiagnoses || savedDiagnoses) as Diagnosis[];
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

        {/* Phase Indicator */}
        <div className="flex items-center gap-2">
          <Badge variant="outline">Phase</Badge>
          <Badge>Inspection Complete</Badge>
        </div>

        {/* Evidence Upload */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Evidence</h2>
          <p className="text-sm text-muted-foreground">
            Add your inspection photos, contractor audio, and documents.
          </p>
          <EvidenceUpload homeId={homeId} onEvidenceChange={handleEvidenceChange} />
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

        {/* Diagnosis Results */}
        {diagnoses.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              Diagnosis ({diagnoses.length} issue{diagnoses.length !== 1 ? "s" : ""} found)
            </h2>
            {diagnoses.map((d, i) => (
              <DiagnosisCard key={i} diagnosis={d} />
            ))}
          </section>
        )}
      </div>

      {/* Chat Drawer */}
      <ChatDrawer context={chatContext} />
    </main>
  );
}
