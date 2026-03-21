// src/components/evidence-upload.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export interface EvidenceItem {
  id: string;
  type: "photo" | "audio" | "document";
  label: string;
  storage_path: string;
}

interface EvidenceUploadProps {
  homeId: string;
  onEvidenceChange: (evidence: EvidenceItem[]) => void;
}

function detectType(file: File): "photo" | "audio" | "document" {
  if (file.type.startsWith("image/")) return "photo";
  if (file.type.startsWith("audio/") || file.type.startsWith("video/")) return "audio";
  return "document";
}

export function EvidenceUpload({ homeId, onEvidenceChange }: EvidenceUploadProps) {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const supabase = createClient();

  // Load existing evidence for this home on mount
  useEffect(() => {
    if (loaded) return;
    async function loadExisting() {
      const { data, error } = await supabase
        .from("evidence")
        .select("id, type, label, storage_path")
        .eq("home_id", homeId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to load evidence:", error);
        setLoaded(true);
        return;
      }

      if (data && data.length > 0) {
        const items: EvidenceItem[] = data.map((row) => ({
          id: row.id,
          type: row.type as "photo" | "audio" | "document",
          label: row.label || "Untitled",
          storage_path: row.storage_path,
        }));
        setEvidence(items);
        onEvidenceChange(items);
      }
      setLoaded(true);
    }
    loadExisting();
  }, [homeId, loaded]);

  const handleFiles = useCallback(
    async (files: FileList) => {
      setUploading(true);
      const newEvidence: EvidenceItem[] = [];

      for (const file of Array.from(files)) {
        const type = detectType(file);
        const storagePath = `${homeId}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("evidence-files")
          .upload(storagePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        const { data, error } = await supabase
          .from("evidence")
          .insert({
            home_id: homeId,
            type,
            label: file.name,
            storage_path: storagePath,
          })
          .select()
          .single();

        if (error) {
          console.error("DB error:", error);
          continue;
        }

        newEvidence.push({
          id: data.id,
          type,
          label: file.name,
          storage_path: storagePath,
        });
      }

      const updated = [...evidence, ...newEvidence];
      setEvidence(updated);
      onEvidenceChange(updated);
      setUploading(false);
    },
    [evidence, homeId, onEvidenceChange, supabase]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }

  return (
    <div className="space-y-4">
      <Card
        className="border-2 border-dashed p-8 text-center cursor-pointer hover:border-primary transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*,audio/*,video/*,.pdf"
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="space-y-2">
          <p className="text-lg font-medium">
            {uploading ? "Uploading..." : "Drop your evidence here"}
          </p>
          <p className="text-sm text-muted-foreground">
            Photos, audio recordings, inspection PDFs
          </p>
        </div>
      </Card>

      {evidence.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">{evidence.length} file(s) loaded</p>
          {evidence.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 text-sm p-2 rounded bg-muted"
            >
              <span className="capitalize text-xs font-mono bg-background px-1.5 py-0.5 rounded">
                {item.type}
              </span>
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
