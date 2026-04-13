// src/components/phase-selector.tsx
"use client";

const phases = [
  { value: "pre_inspection", label: "Preparing" },
  { value: "inspection_complete", label: "Inspection Complete" },
  { value: "post_close", label: "Post-Close" },
] as const;

interface PhaseSelectorProps {
  current: string;
}

export function PhaseSelector({ current }: PhaseSelectorProps) {
  return (
    <div className="flex items-center gap-1">
      {phases.map((phase, index) => {
        const isActive = phase.value === current;
        const isPast = phases.findIndex(p => p.value === current) > index;
        
        return (
          <div key={phase.value} className="flex items-center">
            <div
              className={`
                px-3 py-1.5 text-xs font-medium rounded-full transition-all
                ${isActive 
                  ? "bg-primary text-primary-foreground" 
                  : isPast
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted/50 text-muted-foreground"
                }
              `}
            >
              {phase.label}
            </div>
            {index < phases.length - 1 && (
              <div className={`w-4 h-px mx-1 ${isPast || isActive ? "bg-primary/40" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
