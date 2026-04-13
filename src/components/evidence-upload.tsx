// src/components/evidence-upload.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  keepTypes?: ("photo" | "audio" | "document")[];
}

function detectType(file: File): "photo" | "audio" | "document" {
  if (file.type.startsWith("image/")) return "photo";
  if (file.type.startsWith("audio/") || file.type.startsWith("video/")) return "audio";
  return "document";
}

export function EvidenceUpload({ homeId, onEvidenceChange, keepTypes }: EvidenceUploadProps) {
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
        let filtered = data;
        if (keepTypes) {
          filtered = data.filter((row) => keepTypes.includes(row.type as "photo" | "audio" | "document"));
        }
        const items: EvidenceItem[] = filtered.map((row) => ({
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

  async function handleDelete(item: EvidenceItem) {
    // Delete from storage
    await supabase.storage.from("evidence-files").remove([item.storage_path]);
    // Delete from database
    await supabase.from("evidence").delete().eq("id", item.id);
    // Update local state
    const updated = evidence.filter((e) => e.id !== item.id);
    setEvidence(updated);
    onEvidenceChange(updated);
  }

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

  const typeIcons = {
    photo: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    audio: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    document: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-border/80 rounded-xl p-10 text-center cursor-pointer hover:border-primary hover:bg-accent/30 transition-all duration-200 bg-card"
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
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-xl bg-accent/50 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-medium text-foreground">
              {uploading ? "Uploading..." : "Drop your evidence here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Photos, audio recordings, inspection PDFs
            </p>
          </div>
        </div>
      </div>

      {evidence.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{evidence.length} file{evidence.length !== 1 ? "s" : ""} loaded</p>
          <div className="grid gap-2">
            {evidence.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 text-sm p-3 rounded-lg bg-card border border-border/60 group"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/50 flex items-center justify-center text-primary shrink-0">
                  {typeIcons[item.type]}
                </div>
                <span className="truncate flex-1 font-medium text-foreground">{item.label}</span>
                <span className="text-xs text-muted-foreground capitalize px-2 py-0.5 rounded-full bg-muted">
                  {item.type}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(item)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
