import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { diagnosisResultSchema } from "@/types/diagnosis";
import { SYSTEM_PROMPT } from "@/lib/gemini";
import { createServerClient } from "@/lib/supabase/server";

export const maxDuration = 120;

export async function POST(req: Request) {
  const { homeId, evidenceIds } = await req.json();

  const supabase = createServerClient();

  // Fetch evidence records
  const { data: evidenceRecords } = await supabase
    .from("evidence")
    .select("*")
    .in("id", evidenceIds);

  if (!evidenceRecords || evidenceRecords.length === 0) {
    return new Response("No evidence found", { status: 400 });
  }

  // Build multimodal content parts for Gemini
  const parts: Array<{ type: "text"; text: string } | { type: "file"; data: Uint8Array; mediaType: string }> = [];

  // Add context about which evidence is which
  parts.push({
    type: "text" as const,
    text: "I'm providing you with evidence about a home. Each piece of evidence has an ID for citation purposes.\n\n",
  });

  for (const evidence of evidenceRecords) {
    // Download the file from Supabase Storage
    const { data: fileData } = await supabase.storage
      .from("evidence-files")
      .download(evidence.storage_path);

    if (!fileData) continue;

    const buffer = new Uint8Array(await fileData.arrayBuffer());
    const mimeType = getMimeType(evidence.type, evidence.storage_path);

    parts.push({
      type: "text" as const,
      text: `\n--- Evidence ID: ${evidence.id} | Type: ${evidence.type} | Label: ${evidence.label || "unlabeled"} ---\n`,
    });

    parts.push({
      type: "file" as const,
      data: buffer,
      mediaType: mimeType,
    });

    // If there's extracted text (e.g., prior transcription), include it
    if (evidence.extracted_text) {
      parts.push({
        type: "text" as const,
        text: `\nExtracted text for evidence ${evidence.id}:\n${evidence.extracted_text}\n`,
      });
    }
  }

  parts.push({
    type: "text" as const,
    text: "\n\nAnalyze all the evidence above. Identify every distinct issue and produce structured diagnoses. Use the evidence IDs when citing sources.",
  });

  const { object } = await generateObject({
    model: google("gemini-3.1-pro-preview"),
    schema: diagnosisResultSchema,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: parts,
      },
    ],
  });

  return Response.json(object);
}

function getMimeType(type: string, path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  const mimeMap: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    pdf: "application/pdf",
    mp3: "audio/mp3",
    wav: "audio/wav",
    m4a: "audio/mp4",
    mp4: "audio/mp4",
    ogg: "audio/ogg",
    webm: "audio/webm",
  };
  return mimeMap[ext || ""] || "application/octet-stream";
}
