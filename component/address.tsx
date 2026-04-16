"use client";

import { FormErrors } from "@/lib/types";
import { useEffect } from "react";
import { TextArea } from "./formFields";


interface Step2Props {
  data: Partial<FormData>;
  errors: FormErrors;
  onChange: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

export function Step2Address({ data, errors, onChange }: Step2Props) {
  // Sync permanent if checkbox is checked
  useEffect(() => {
    if (data.same_as_present) {
      onChange("permanent_address", data.present_address ?? "");
    }
  }, [data.present_address, data.same_as_present]);

  return (
    <div className="space-y-6">
      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">PRESENT ADDRESS</div>

      <TextArea
        label="Present Address" required
        value={data.present_address ?? ""}
        onChange={(e) => onChange("present_address", e.target.value)}
        error={errors.present_address}
        placeholder="House No., Street, Barangay, City/Municipality, Province, ZIP"
        rows={3}
      />

      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">PERMANENT ADDRESS</div>

      {/* Same as present toggle */}
      <label className="flex items-center gap-3 cursor-pointer w-fit">
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          checked={data.same_as_present ?? false}
          onChange={(e) => onChange("same_as_present", e.target.checked)}
        />
        <span className="text-sm font-medium">Same as present address</span>
      </label>

      {data.same_as_present ? (
        <div className="alert alert-info">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">Permanent address is the same as your present address.</span>
        </div>
      ) : (
        <TextArea
          label="Permanent Address" required
          value={data.permanent_address ?? ""}
          onChange={(e) => onChange("permanent_address", e.target.value)}
          error={errors.permanent_address}
          placeholder="House No., Street, Barangay, City/Municipality, Province, ZIP"
          rows={3}
        />
      )}
    </div>
  );
}