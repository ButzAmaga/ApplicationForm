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

  const textFields: [keyof FormData, string][] = [
    ["name", "Full name"],
    ["position", "Position"],
    ["religion", "Religion"],
    ["agency", "Agency"],
    ["age", "Age"],
    ["date_birth", "Date of birth"],
    ["place_birth", "Place of birth"],
    ["height", "Height"],
    ["weight", "Weight"],
    ["constellation", "Constellation"],
    ["employment_record", "Employment record"],
  ];

  for (const [field, label] of textFields) {
    const msg = required(String(data[field] ?? ""), label);
    if (msg) e[field] = msg;
  }

  if (data.age && (isNaN(Number(data.age)) || Number(data.age) < 16 || Number(data.age) > 100))
    e.age = "Age must be between 16 and 100.";

  if (!data.sex)          e.sex          = "Please select a sex.";
  if (!data.civil_status) e.civil_status = "Please select civil status.";

  return e;
}

export function validateStep2(data: Partial<FormData>): FormErrors {
  const e: FormErrors = {};
  const msg = required(data.present_address ?? "", "Present address");
  if (msg) e.present_address = msg;
  if (!data.same_as_present) {
    const msg2 = required(data.permanent_address ?? "", "Permanent address");
    if (msg2) e.permanent_address = msg2;
  }
  return e;
}

export function validateStep3(data: Partial<FormData>): FormErrors {
  const e: FormErrors = {};

  const msg = required(data.phone_num ?? "", "Phone number");
  if (msg) e.phone_num = msg;
  else if (!isPhone(data.phone_num ?? "")) e.phone_num = "Enter a valid phone number.";

  const msgEmail = required(data.email ?? "", "Email");
  if (msgEmail) e.email = msgEmail;
  else if (!isEmail(data.email ?? "")) e.email = "Enter a valid email address.";

  return e;
}

export function validateStep4(data: Partial<FormData>): FormErrors {
  const e: FormErrors = {};
  const members: FamilyMember[] = data.family_members ?? [];

  members.forEach((m, i) => {
    if (!m.name.trim())         e[`family_${i}_name`]         = "Name is required.";
    if (!m.relationship.trim()) e[`family_${i}_relationship`] = "Relationship is required.";
    if (m.phone && !isPhone(m.phone)) e[`family_${i}_phone`] = "Invalid phone.";
  });

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