"use client";

import { FormErrors } from "@/lib/types";
import { TextInput } from "./formFields";



interface Step3Props {
  data: Partial<FormData>;
  errors: FormErrors;
  onChange: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

export function Step3Contact({ data, errors, onChange }: Step3Props) {
  return (
    <div className="space-y-6">
      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">PRIMARY CONTACTS</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          label="Phone Number" required type="tel"
          value={data.phone_num ?? ""}
          onChange={(e) => onChange("phone_num", e.target.value)}
          error={errors.phone_num}
          placeholder="+63 9XX XXX XXXX"
        />
        <TextInput
          label="Email Address" required type="email"
          value={data.email ?? ""}
          onChange={(e) => onChange("email", e.target.value)}
          error={errors.email}
          placeholder="juan@example.com"
        />
      </div>

      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">SOCIAL / MESSAGING</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-control w-full">
          <label className="label pb-1">
            <span className="label-text font-medium flex items-center gap-2">
              <span className="text-blue-500">📘</span> Facebook
            </span>
            <span className="label-text-alt text-base-content/50">Optional</span>
          </label>
          <input
            type="url"
            value={data.facebook ?? ""}
            onChange={(e) => onChange("facebook", e.target.value)}
            className="input input-bordered w-full focus:input-primary"
            placeholder="https://facebook.com/username"
          />
        </div>

        <div className="form-control w-full">
          <label className="label pb-1">
            <span className="label-text font-medium flex items-center gap-2">
              <span className="text-green-500">💬</span> WhatsApp
            </span>
            <span className="label-text-alt text-base-content/50">Optional</span>
          </label>
          <input
            type="tel"
            value={data.whatsapp ?? ""}
            onChange={(e) => onChange("whatsapp", e.target.value)}
            className="input input-bordered w-full focus:input-primary"
            placeholder="+63 9XX XXX XXXX"
          />
        </div>
      </div>

      {/* Contact tips */}
      <div className="alert shadow-sm bg-base-200">
        <svg className="w-5 h-5 text-info shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm">
          <p className="font-medium">Contact Information</p>
          <p className="text-base-content/60">Phone and email are required. We'll use these to contact you about your application.</p>
        </div>
      </div>
    </div>
  );
}