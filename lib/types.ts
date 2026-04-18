// ─── Form App Errors ───────────────────────────────────────────────────────────
export type FormAppErrors = {
    full_name?: string[] | undefined;
    position?: string[] | undefined;
    religion?: string[] | undefined;
    agency?: string[] | undefined;
    age?: string[] | undefined;
    date_of_birth?: string[] | undefined;
    place_of_birth?: string[] | undefined;
    height?: string[] | undefined;
    weight?: string[] | undefined;
    constellation?: string[] | undefined;
    sex?: string[] | undefined;
    civil_status?: string[] | undefined;
    employment_record?: string[] | undefined;
    avatar?: string[] | undefined;
} | null

// ─── Family Member ───────────────────────────────────────────────────────────
export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  liveTogether: boolean;
}

// ─── Full Form Data ───────────────────────────────────────────────────────────
export interface FormData {
  // Step 1 – Personal Info
  name: string;
  position: string;
  religion: string;
  agency: string;
  age: string;
  date_birth: string;
  place_birth: string;
  height: string;
  weight: string;
  constellation: string;
  employment_record: string;
  sex: "Male" | "Female" | "Other" | "";
  civil_status: "Single" | "Married" | "Widowed" | "Separated" | "Divorced" | "";
  avatar: string; // base64 data-url

  // Step 2 – Address
  present_address: string;
  permanent_address: string;
  same_as_present: boolean;

  // Step 3 – Contact Info
  facebook: string;
  whatsapp: string;
  phone_num: string;
  email: string;

  // Step 4 – Family Members
  family_members: FamilyMember[];
}

// ─── Field-level Errors ───────────────────────────────────────────────────────
export type FormErrors = Partial<Record<keyof FormData | string, string>>;

// ─── Server Action State ──────────────────────────────────────────────────────
export interface ActionState {
  success: boolean;
  errors: FormErrors;
  message?: string;
  data?: Partial<FormData>;
}

// ─── Step Metadata ────────────────────────────────────────────────────────────
export interface StepMeta {
  id: number;
  label: string;
  icon: string;
  description: string;
}

export const STEPS: StepMeta[] = [
  { id: 1, label: "Personal",  icon: "👤", description: "Basic personal details" },
  { id: 2, label: "Address",   icon: "🏠", description: "Where you live"         },
  { id: 3, label: "Contact",   icon: "📞", description: "How to reach you"       },
  { id: 4, label: "Family",    icon: "👨‍👩‍👧", description: "Household members"     },
  { id: 5, label: "Employment Record", icon: "👨‍👩‍👧", description: "Job Records" },
  { id: 6, label: "Education Record", icon: "🎓", description: "Academic Background" },
  { id: 7, label: "Passport",    icon: "🛂", description: "Passport Information"        },
  { id: 8, label: "Review",    icon: "✅", description: "Confirm & submit"        },
];