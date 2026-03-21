// src/components/phase-selector.tsx
"use client";

import { Badge } from "@/components/ui/badge";

const phases = [
  { value: "pre_inspection", label: "Preparing for Inspection" },
  { value: "inspection_complete", label: "Inspection Complete" },
  { value: "post_close", label: "Post-Close Renovation" },
] as const;

interface PhaseSelectorProps {
  current: string;
}

export function PhaseSelector({ current }: PhaseSelectorProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {phases.map((phase) => (
        <Badge
          key={phase.value}
          variant={phase.value === current ? "default" : "outline"}
          className={
            phase.value === current
              ? ""
              : "opacity-50 cursor-not-allowed"
          }
        >
          {phase.label}
        </Badge>
      ))}
    </div>
  );
}
