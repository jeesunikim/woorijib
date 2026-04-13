// src/components/diagnosis-card.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import type { Diagnosis } from "@/types/diagnosis";

export type IssueStatus = "to_do" | "in_work" | "complete";

const severityConfig = {
  critical: { 
    bg: "bg-red-50", 
    border: "border-red-200",
    badge: "bg-red-100 text-red-700 border-red-200",
    icon: "text-red-500"
  },
  moderate: { 
    bg: "bg-amber-50/50", 
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    icon: "text-amber-500"
  },
  minor: { 
    bg: "bg-emerald-50/50", 
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: "text-emerald-500"
  },
} as const;

const urgencyLabels = {
  before_close: "Before Close",
  year_1: "Year 1",
  year_2_plus: "Year 2+",
} as const;

const statusConfig = {
  to_do: { label: "To Do", className: "bg-muted text-muted-foreground border-border hover:bg-accent" },
  in_work: { label: "In Work", className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
  complete: { label: "Complete", className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
} as const;

const statusOrder: IssueStatus[] = ["to_do", "in_work", "complete"];

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
  status?: IssueStatus;
  onStatusChange?: (status: IssueStatus) => void;
}

export function DiagnosisCard({ diagnosis, status = "to_do", onStatusChange }: DiagnosisCardProps) {
  function cycleStatus() {
    if (!onStatusChange) return;
    const currentIndex = statusOrder.indexOf(status);
    const next = statusOrder[(currentIndex + 1) % statusOrder.length];
    onStatusChange(next);
  }

  const severity = severityConfig[diagnosis.severity];

  return (
    <div className={`rounded-xl border ${severity.border} ${severity.bg} ${status === "complete" ? "opacity-60" : ""} overflow-hidden`}>
      {/* Header */}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <h3 className="text-lg font-semibold text-foreground leading-tight">{diagnosis.issue}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{diagnosis.summary}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge
              className={`${statusConfig[status].className} cursor-pointer transition-colors text-xs`}
              onClick={cycleStatus}
            >
              {statusConfig[status].label}
            </Badge>
            <div className="flex gap-1.5">
              <Badge className={`${severity.badge} text-xs font-medium capitalize`}>
                {diagnosis.severity}
              </Badge>
              <Badge variant="outline" className="text-xs bg-background/50">{urgencyLabels[diagnosis.urgency]}</Badge>
            </div>
          </div>
        </div>

        {/* Evidence Citations */}
        {diagnosis.evidence && diagnosis.evidence.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Evidence</h4>
            <div className="space-y-2">
              {diagnosis.evidence.map((citation, i) => (
                <div key={i} className="text-sm pl-3 border-l-2 border-border/60 space-y-0.5">
                  <p className="font-medium text-foreground flex items-center gap-2">
                    <span className="capitalize text-xs font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                      {citation.source_type}
                    </span>
                    <span className="text-muted-foreground">{citation.reference}</span>
                  </p>
                  <p className="text-muted-foreground italic text-sm">&ldquo;{citation.quote}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommendation */}
      {diagnosis.recommendation && (
        <div className="px-5 py-4 bg-background/40 border-t border-border/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant={diagnosis.recommendation.type === "professional" ? "default" : "secondary"} className="text-xs">
                {diagnosis.recommendation.type === "professional" ? "Hire a Pro" : "DIY"}
              </Badge>
              {diagnosis.recommendation.cost_range && (
                <span className="text-sm font-semibold text-foreground">
                  ${diagnosis.recommendation.cost_range.low?.toLocaleString()} &ndash; ${diagnosis.recommendation.cost_range.high?.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{diagnosis.recommendation.reasoning}</p>
        </div>
      )}

      {/* Contractor Questions */}
      {diagnosis.contractor_questions && diagnosis.contractor_questions.length > 0 && (
        <div className="px-5 py-4 bg-background/60 border-t border-border/40 space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            Ask Your Contractor
          </h4>
          <ul className="space-y-1.5">
            {diagnosis.contractor_questions.map((q, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-primary mt-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Steps */}
      {diagnosis.steps && diagnosis.steps.length > 0 && (
        <div className="px-5 py-4 bg-background/80 border-t border-border/40 space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Next Steps</h4>
          <div className="space-y-3">
            {diagnosis.steps.map((step) => (
              <div key={step.order} className="flex gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center shrink-0">
                  {step.order}
                </span>
                <div className="flex-1 pt-0.5">
                  <p className="font-medium text-foreground">{step.action}</p>
                  <p className="text-muted-foreground text-sm mt-0.5">{step.detail}</p>
                  {step.estimated_cost && (
                    <p className="text-xs font-medium text-primary mt-1">{step.estimated_cost}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
