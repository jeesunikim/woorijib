import { generateText, Output } from "ai";
import { z } from "zod";
import { getRegionalData, isKnownRegion, type RegionalIssue, type RegionalData } from "@/lib/regional-issues";

export const maxDuration = 60;

const regionalIssueSchema = z.object({
  issue: z.string(),
  description: z.string(),
  prevalence: z.enum(["very_common", "common", "occasional"]),
  typicalCost: z.string(),
  yearsBuiltAffected: z.string().nullable(),
});

const aiRegionalDataSchema = z.object({
  region: z.string(),
  housingContext: z.string(),
  medianHomeAge: z.number(),
  commonIssues: z.array(regionalIssueSchema),
});

export async function POST(req: Request) {
  const { zipCode } = await req.json();

  if (!zipCode || !/^\d{5}$/.test(zipCode)) {
    return Response.json({ error: "Invalid zip code" }, { status: 400 });
  }

  // Check if we have curated data for this region
  if (isKnownRegion(zipCode)) {
    const data = getRegionalData(zipCode);
    return Response.json({ 
      data, 
      source: "curated",
      zipCode 
    });
  }

  // Fall back to AI-generated data for unknown regions
  try {
    const result = await generateText({
      model: "openai/gpt-4o-mini",
      system: `You are an expert on US residential real estate and home inspection issues. 
Given a zip code, provide accurate information about common home issues in that area based on:
- Typical housing stock age and style
- Regional climate and weather patterns
- Local geology and soil conditions
- Common building materials and methods for the era
- Regional-specific issues (termites in the south, radon in certain areas, etc.)

Be specific and practical. Focus on issues that home inspectors commonly find.`,
      prompt: `For zip code ${zipCode}, provide information about common home issues in this area.

Research what you know about this region's:
1. Typical home ages and architectural styles
2. Climate challenges (humidity, temperature extremes, precipitation)
3. Soil and geological conditions
4. Regional-specific issues

Provide 4-6 of the most common issues that home inspectors find in this area.`,
      experimental_output: Output.object({
        schema: aiRegionalDataSchema,
      }),
    });

    const aiData = result.experimental_output;
    
    if (!aiData) {
      // If AI fails, return generic data
      const fallbackData = getRegionalData("00000"); // Gets default data
      return Response.json({ 
        data: fallbackData, 
        source: "fallback",
        zipCode 
      });
    }

    // Transform AI response to match our RegionalData type
    const data: RegionalData = {
      region: aiData.region,
      housingContext: aiData.housingContext,
      medianHomeAge: aiData.medianHomeAge,
      commonIssues: aiData.commonIssues.map((issue): RegionalIssue => ({
        issue: issue.issue,
        description: issue.description,
        prevalence: issue.prevalence,
        typicalCost: issue.typicalCost,
        yearsBuiltAffected: issue.yearsBuiltAffected || undefined,
      })),
    };

    return Response.json({ 
      data, 
      source: "ai_generated",
      zipCode 
    });
  } catch (error) {
    console.error("AI generation error:", error);
    // If AI fails, return generic data
    const fallbackData = getRegionalData("00000");
    return Response.json({ 
      data: fallbackData, 
      source: "fallback",
      zipCode 
    });
  }
}
