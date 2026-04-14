import { generateText } from "ai";
import { z } from "zod";

const draftEmailSchema = z.object({
  diagnosis: z.object({
    issue: z.string(),
    summary: z.string(),
    severity: z.enum(["critical", "moderate", "minor"]),
    recommendation: z.object({
      type: z.enum(["professional", "diy"]).optional(),
      cost_range: z.object({
        low: z.number().optional(),
        high: z.number().optional(),
      }).optional(),
    }).optional(),
    contractor_questions: z.array(z.string()).optional(),
  }),
  recipientType: z.enum(["contractor", "realtor", "seller", "inspector"]),
  userEmail: z.string().email(),
  homeAddress: z.string(),
});

type DraftEmailRequest = z.infer<typeof draftEmailSchema>;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { diagnosis, recipientType, userEmail, homeAddress } = draftEmailSchema.parse(body);

    const prompts = {
      contractor: `You are drafting an email from a homeowner to a contractor requesting a quote for a home repair. 
        
Home Address: ${homeAddress}
Issue: ${diagnosis.issue}
Description: ${diagnosis.summary}
Severity: ${diagnosis.severity}
${diagnosis.recommendation?.cost_range ? `Estimated Cost Range: $${diagnosis.recommendation.cost_range.low} - $${diagnosis.recommendation.cost_range.high}` : ""}

Questions to ask:
${diagnosis.contractor_questions?.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Draft a professional, friendly email from the homeowner asking for a quote. Include the issue details, estimated cost range if available, and ask the contractor the specific questions. Sign with the homeowner's email. Keep it concise and actionable.`,

      realtor: `You are drafting an email from a homeowner to their real estate agent about a discovered home inspection issue that needs negotiation or resolution.

Home Address: ${homeAddress}
Issue: ${diagnosis.issue}
Description: ${diagnosis.summary}
Severity: ${diagnosis.severity}
${diagnosis.recommendation?.cost_range ? `Estimated Repair Cost: $${diagnosis.recommendation.cost_range.low} - $${diagnosis.recommendation.cost_range.high}` : ""}

Draft a professional email requesting the realtor's advice on negotiating repairs or credits with the seller. Be direct about the issue, include cost estimates, and ask for recommended next steps. Sign with the homeowner's email.`,

      seller: `You are drafting an email from a homeowner (or their agent) to the seller/seller's agent requesting repairs or credits for a discovered home inspection issue.

Home Address: ${homeAddress}
Issue: ${diagnosis.issue}
Description: ${diagnosis.summary}
Severity: ${diagnosis.severity}
${diagnosis.recommendation?.cost_range ? `Estimated Repair Cost: $${diagnosis.recommendation.cost_range.low} - $${diagnosis.recommendation.cost_range.high}` : ""}

Draft a professional, firm email requesting the seller either repair the issue before closing or provide a credit. Be respectful but clear about the issue and its impact. Include cost estimates and timeline. Sign with the homeowner's email.`,

      inspector: `You are drafting an email from a homeowner to the home inspector asking follow-up questions about a finding in their inspection report.

Home Address: ${homeAddress}
Issue: ${diagnosis.issue}
Description: ${diagnosis.summary}

Questions: 
${diagnosis.contractor_questions?.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Draft a professional, curious email asking the inspector to clarify their findings and answer specific technical questions. Be respectful and show you want to understand the issue better. Sign with the homeowner's email.`,
    };

    const { text } = await generateText({
      model: "google/gemini-2.5-pro",
      prompt: prompts[recipientType],
      temperature: 0.7,
      maxTokens: 500,
    });

    return Response.json({
      subject: generateSubject(diagnosis, recipientType),
      body: text,
      recipientType,
    });
  } catch (error) {
    console.error("Error drafting email:", error);
    return Response.json(
      { error: "Failed to draft email" },
      { status: 500 }
    );
  }
}

function generateSubject(diagnosis: any, recipientType: string): string {
  const issueShort = diagnosis.issue.substring(0, 40);
  
  switch (recipientType) {
    case "contractor":
      return `Quote Request: ${issueShort}`;
    case "realtor":
      return `Inspection Finding - Need Your Advice: ${issueShort}`;
    case "seller":
      return `Inspection Issue Requiring Resolution: ${issueShort}`;
    case "inspector":
      return `Follow-up Questions on Inspection Finding`;
    default:
      return `Home Inspection Matter`;
  }
}
