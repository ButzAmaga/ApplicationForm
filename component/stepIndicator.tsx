"use client";

import { StepMeta } from "@/lib/types";



interface StepIndicatorProps {
  steps: StepMeta[];
  currentStep: number;
  completedSteps: Set<number>;
}

export function StepIndicator({ steps, currentStep, completedSteps }: StepIndicatorProps) {
  return (
    <div className="w-full px-2 py-4 overflow-x-auto">
      <ul className="steps steps-horizontal w-full min-w-max">
        {steps.map((step) => {
          const isCompleted = completedSteps.has(step.id);
          const isCurrent   = step.id === currentStep;
          const isPast      = step.id < currentStep;

          return (
            <li
              key={step.id}
              data-content={isCompleted || isPast ? "✓" : step.icon}
              className={`step text-xs sm:text-sm transition-all duration-300 ${
                isCurrent   ? "step-primary font-bold"  :
                isCompleted || isPast ? "step-primary opacity-80" :
                "opacity-40"
              }`}
            >
              <span className="hidden sm:inline">{step.label}</span>
            </li>
          );
        })}
      </ul>

      {/* Current step description */}
      <div className="text-center mt-3">
        <span className="text-lg mr-1">{steps[currentStep - 1]?.icon}</span>
        <span className="font-semibold text-primary">{steps[currentStep - 1]?.label}</span>
        <span className="text-base-content/60 text-sm ml-2">— {steps[currentStep - 1]?.description}</span>
      </div>
    </div>
  );
}