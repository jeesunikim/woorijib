// src/components/diagnosis-card.tsx
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Diagnosis } from "@/types/diagnosis";

const severityColors = {
  critical: "bg-red-100 text-red-800 border-red-200",
  moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  minor: "bg-green-100 text-green-800 border-green-200",
} as const;

const urgencyLabels = {
  before_close: "Before Close",
  year_1: "Year 1",
  year_2_plus: "Year 2+",
} as const;

export function DiagnosisCard({ diagnosis }: { diagnosis: Diagnosis }) {
  return (
    <Card className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">{diagnosis.issue}</h3>
        <div className="flex gap-2 shrink-0">
          <Badge className={severityColors[diagnosis.severity]}>
            {diagnosis.severity}
          </Badge>
          <Badge variant="outline">{urgencyLabels[diagnosis.urgency]}</Badge>
        </div>
      </div>

      <p className="text-muted-foreground">{diagnosis.summary}</p>

      <Separator />

      {/* Evidence Citations */}
      {diagnosis.evidence && diagnosis.evidence.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Evidence</h4>
          {diagnosis.evidence.map((citation, i) => (
            <div key={i} className="text-sm pl-3 border-l-2 border-muted space-y-1">
              <p className="font-medium">
                <span className="capitalize text-xs font-mono bg-muted px-1 py-0.5 rounded mr-1">
                  {citation.source_type}
                </span>
                {citation.reference}
              </p>
              <p className="text-muted-foreground italic">&ldquo;{citation.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      )}

      <Separator />

      {/* Recommendation */}
      {diagnosis.recommendation && (
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Recommendation</h4>
          <div className="flex items-center gap-2">
            <Badge variant={diagnosis.recommendation.type === "professional" ? "default" : "secondary"}>
              {diagnosis.recommendation.type === "professional" ? "Hire a Pro" : "DIY"}
            </Badge>
            {diagnosis.recommendation.cost_range && (
              <span className="text-sm font-mono">
                ${diagnosis.recommendation.cost_range.low?.toLocaleString()} &ndash; $
                {diagnosis.recommendation.cost_range.high?.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{diagnosis.recommendation.reasoning}</p>
        </div>
      )}

      {/* Contractor Questions */}
      {diagnosis.contractor_questions && diagnosis.contractor_questions.length > 0 && (
        <>
          <Separator />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Questions to Ask Your Contractor</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {diagnosis.contractor_questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Steps */}
      {diagnosis.steps && diagnosis.steps.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Next Steps</h4>
            {diagnosis.steps.map((step) => (
              <div key={step.order} className="flex gap-3 text-sm">
                <span className="font-mono text-muted-foreground shrink-0">
                  {step.order}.
                </span>
                <div>
                  <p className="font-medium">{step.action}</p>
                  <p className="text-muted-foreground">{step.detail}</p>
                  {step.estimated_cost && (
                    <p className="text-xs font-mono mt-0.5">{step.estimated_cost}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
