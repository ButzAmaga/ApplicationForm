"use client";

import { FormErrors } from "@/lib/types";
import { EmailInput, TextInput } from "./formFields";



type Step3Props = {

  errors: {

    facebook?: string[] | undefined;
    email?: string[] | undefined;
    phone_num?: string[] | undefined;
    whatsapp?: string[] | undefined;

  } | null;
  show: boolean
}
export function Step3Contact({ errors, show }: Step3Props) {
  return (
    <div className={`space-y-6 ${show ? "block" : "hidden"}`}>
      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">
        PRIMARY CONTACTS
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          label="Phone Number"
          required
          name="phone_num"
          errors={errors?.phone_num}
          placeholder="+63 9XX XXX XXXX"
        />

        <EmailInput
          label="Email Address"
          required
          name="email"
          errors={errors?.email}
          placeholder="juan@example.com"
        />
      
      </div>

      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">
        SOCIAL / MESSAGING
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          label="Facebook"
          name="facebook"
          errors={errors?.facebook}
          placeholder="https://facebook.com/username"
        />

        <TextInput
          label="WhatsApp"
          name="whatsapp"
          errors={errors?.whatsapp}
          placeholder="+63 9XX XXX XXXX"
        />
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