// src/types/diagnosis.ts
import { z } from "zod";

export const citationSchema = z.object({
  evidence_id: z.string().describe("ID of the evidence record this cites"),
  source_type: z.enum(["photo", "audio", "document"]),
  reference: z
    .string()
    .describe('Specific location — "Finding #57", "Audio at 2:14", "Visible in upper-left of photo"'),
  quote: z.string().describe("Exact text or description of what was found at this reference"),
});

export const stepSchema = z.object({
  order: z.number(),
  action: z.string(),
  detail: z.string(),
  estimated_cost: z.string().optional().describe('e.g. "$500-1,000"'),
});

export const diagnosisSchema = z.object({
  issue: z.string().describe("Short title of the identified issue"),
  summary: z.string().describe("2-3 sentence plain English explanation"),
  severity: z.enum(["critical", "moderate", "minor"]),
  urgency: z.enum(["before_close", "year_1", "year_2_plus"]),
  evidence: z.array(citationSchema),
  recommendation: z.object({
    type: z.enum(["diy", "professional"]),
    cost_range: z.object({
      low: z.number(),
      high: z.number(),
    }),
    reasoning: z.string(),
  }),
  contractor_questions: z.array(z.string()),
  steps: z.array(stepSchema),
});

export const diagnosisResultSchema = z.object({
  diagnoses: z.array(diagnosisSchema),
});

export type Citation = z.infer<typeof citationSchema>;
export type Step = z.infer<typeof stepSchema>;
export type Diagnosis = z.infer<typeof diagnosisSchema>;
export type DiagnosisResult = z.infer<typeof diagnosisResultSchema>;
