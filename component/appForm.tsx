"use client";

import { FormErrors, STEPS, ActionState } from "@/lib/types";
import { stepValidators } from "@/lib/validation";
import { useCallback, useReducer, useActionState, useTransition, useEffect, useState } from "react";
import { Step2Address } from "./address";
import { Step3Contact } from "./contact";
import { Step4Family } from "./famMember";
import { Step1Personal } from "./personalInfo";
import { StepIndicator } from "./stepIndicator";
import { saveDocumentAction } from "@/actions/biodataAction";
import { Step5Employment } from "./employment";
import { Step6Education } from "./education";
import { Step7Passport } from "./passport";


// ─── State ────────────────────────────────────────────────────────────────────
interface WizardState {
  currentStep: number;
  completedSteps: Set<number>;
  stepErrors: FormErrors;
}



type WizardAction =
  | { type: "SET_ERRORS"; errors: FormErrors }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; step: number }
  | { type: "MARK_COMPLETE"; step: number };

const initialState: WizardState = {
  currentStep: 1,
  completedSteps: new Set(),
  stepErrors: {},
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_ERRORS":
      return { ...state, stepErrors: action.errors };
    case "NEXT_STEP": {
      const next = Math.min(state.currentStep + 1, STEPS.length);
      return {
        ...state,
        currentStep: next,
        completedSteps: new Set([...state.completedSteps, state.currentStep]),
        stepErrors: {},
      };
    }
    case "PREV_STEP":
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1), stepErrors: {} };
    case "GO_TO_STEP":
      return { ...state, currentStep: action.step, stepErrors: {} };
    case "MARK_COMPLETE":
      return { ...state, completedSteps: new Set([...state.completedSteps, action.step]) };
    default:
      return state;
  }
}

// ─── Initial server action state ──────────────────────────────────────────────
const initialActionState = {
  success: false,
  message: "",
  file: "",
  filename: "",
  errors: undefined 
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ApplicationForm() {
  const [state, dispatch] = useReducer(wizardReducer, initialState);
  const [formState, action, isPending] = useActionState(saveDocumentAction, initialActionState);
  const [showSubmit, setShowSubmit] = useState(false);

  // for executing download of file
  useEffect(() => {
    if (formState.success) {
      const res = formState;

      if (res.file == null) return;

      const blob = new Blob(
        [Uint8Array.from(atob(res?.file), c => c.charCodeAt(0))],
        { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
      );

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename || "file.docx";
      a.click();

      URL.revokeObjectURL(url);
    }
  }, [formState]);

  // ── Navigate forward ────────────────────────────────────────────────────────
  const handleNext = () => {
    const isLastDataStep = state.currentStep === STEPS.length - 1;
    if (isLastDataStep || state.currentStep < STEPS.length - 1) {
      const validator = stepValidators[state.currentStep - 1];

    }
    dispatch({ type: "NEXT_STEP" });
  };



  //const isLastStep = state.currentStep === STEPS.length;
  const isLastStep = state.currentStep === 7;
  
  useEffect(() => {
    if (isLastStep) {
      // Wait for the animation/transition to finish
      const timer = setTimeout(() => setShowSubmit(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowSubmit(false);
    }
  }, [isLastStep]);

  // ── Success screen ──────────────────────────────────────────────────────────
  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 p-4">
        <div className="card bg-base-100 shadow-2xl max-w-md w-full text-center">
          <div className="card-body gap-4 py-12">
            <div className="text-6xl animate-bounce">🎉</div>
            <h2 className="text-2xl font-bold text-success">Application Submitted!</h2>
            <p className="text-base-content/60 text-sm">{formState.message}</p>
            <div className="badge badge-success badge-lg mx-auto">You're all set</div>
            <button
              className="btn btn-primary mt-4"
              onClick={() => window.location.reload()}
            >
              Start New Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-base-200 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-base-content">
            Application Form
          </h1>
          <p className="text-base-content/50 text-sm mt-1">Fill out all required fields to submit your application</p>
        </div>

        {/* Step Indicator */}
        <div className="card bg-base-100 shadow-sm border border-base-300 mb-4">
          <div className="card-body p-3 sm:p-4">
            <StepIndicator
              steps={STEPS}
              currentStep={state.currentStep}
              completedSteps={state.completedSteps}
            />
          </div>
        </div>

        {/* Form Card */}
        <form action={action} encType="multipart/form-data" className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body p-4 sm:p-6 gap-6">
            {/* Server action error banner */}
            {!formState.success && formState.message && (
              <div className="alert alert-error">
                <span className="text-sm">{formState.message}</span>
              </div>
            )}

            {/* Step content */}
            <div className="min-h-64">

              <Step1Personal errors={formState.errors ?? {}} show={state.currentStep == 1} />


              <Step2Address errors={formState.errors ?? {}} show={state.currentStep == 2} />


              <Step3Contact errors={formState.errors ?? {}} show={state.currentStep == 3} />


              <Step4Family errors={formState.errors ?? {}} show={state.currentStep == 4} />

              <Step5Employment errors={formState.errors ?? {}} show={state.currentStep == 5} />

              <Step6Education errors={formState.errors ?? {}} show={state.currentStep == 6} />

              <Step7Passport errors={formState.errors ?? {}} show={state.currentStep == 7} />
              {/*
              {state.currentStep === 5 && (
                <Step5Review data={state.formData} onEdit={(step) => dispatch({ type: "GO_TO_STEP", step })} />
              )}
               * 
               */}

            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-base-300 gap-3">
              <button
                type="button"
                onClick={() => dispatch({ type: "PREV_STEP" })}
                disabled={state.currentStep === 1}
                className="btn btn-ghost gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              {/* Step counter */}
              <span className="text-sm text-base-content/50 hidden sm:block">
                Step {state.currentStep} of {STEPS.length}
              </span>

              {isLastStep ? (
                <button
                  type="submit"
                  disabled={isPending}
                  className={`btn btn-success gap-2 ${showSubmit? 'inline-block':'hidden'})}`}
                >
                  {isPending ? (
                    <><span className="loading loading-spinner loading-sm" /> Submitting…</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg> Submit Application</>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary gap-2"
                >
                  Continue
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-base-content/30 mt-4">
          All information is kept confidential and used for application purposes only.
        </p>
      </div>
    </div>
  );
}