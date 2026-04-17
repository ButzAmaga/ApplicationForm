import { FormErrors } from "./types";


// ─── Helpers ──────────────────────────────────────────────────────────────────
const required = (v: string, label: string) =>
  !v.trim() ? `${label} is required.` : undefined;

const isEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const isPhone = (v: string) =>
  /^[+]?[\d\s\-().]{7,20}$/.test(v.trim());

// ─── Per-step validators ──────────────────────────────────────────────────────
export function validateStep1(data: Partial<FormData>): FormErrors {
  const e: FormErrors = {};



  return e;
}

export function validateStep2(data: Partial<FormData>): FormErrors {
  const e: FormErrors = {};


  return e;
}

export function validateStep3(data: Partial<FormData>): FormErrors {
  const e: FormErrors = {};


  return e;
}

export function validateStep4(data: Partial<FormData>): FormErrors {
  const e: FormErrors = {};

  return e;
}

export function validateAll(data: Partial<FormData>): FormErrors {
  return {
    ...validateStep1(data),
    ...validateStep2(data),
    ...validateStep3(data),
    ...validateStep4(data),
  };
}

export const stepValidators = [
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
];