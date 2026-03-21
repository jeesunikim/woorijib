// src/app/api/chat/route.ts
import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";
import { SYSTEM_PROMPT } from "@/lib/gemini";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, context } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-pro"),
    system: `${SYSTEM_PROMPT}

The homeowner has already received diagnoses for their home. Here is the context of their home and prior diagnoses:

${context}

Answer their follow-up questions using this context. Cite specific evidence and diagnoses when relevant.`,
    messages: await convertToModelMessages(messages),
  });

  return result.toTextStreamResponse();
}
