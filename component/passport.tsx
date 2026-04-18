"use client";

import { TextInput, DateInput } from "./formFields";

type Step7Props = {
  errors: {
    passport_no?: string[] | undefined;
    passport_valid_from?: string[] | undefined;
    passport_valid_to?: string[] | undefined;
  } | null;
  show: boolean;
};

export function Step7Passport({ errors, show }: Step7Props) {
  return (
    <div className={`space-y-6 ${show ? "block" : "hidden"}`}>
      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">
        PASSPORT DETAILS
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          label="Passport No"
          required
          name="passport_no"
          errors={errors?.passport_no}
        />
      </div>

      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">
        PASSPORT VALIDITY PERIOD
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateInput
          label="Valid From"
          required
          name="passport_valid_from"
          errors={errors?.passport_valid_from}
        />

        <DateInput
          label="Valid To"
          required
          name="passport_valid_to"
          errors={errors?.passport_valid_to}
        />
      </div>

      {/* Passport tips */}
      <div className="alert shadow-sm bg-base-200">
        <svg className="w-5 h-5 text-info shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm">
          <p className="font-medium">Passport Information</p>
          <p className="text-base-content/60">"Ensure your passport is valid and accurate. Additionally, your passport number will not be shared outside the application's intended purpose</p>
        </div>
      </div>
    </div>
  );
}