"use client";

import { FormErrors } from "@/lib/types";
import { useEffect, useState } from "react";
import { CheckboxGroup, TextArea } from "./formFields";


interface Step2Props {

  errors: {
    present_address?: string[] | undefined;
    permanent_address?: string[] | undefined;

  } | null;
  show:boolean
}


function CombinedPermanentAddressComponent({ errors }: { errors?: string[] | undefined }) {
  const [same, setSame] = useState(false);

  return (
    <>
      {/* Toggle */}


      {/* Info message */}
      {same && (
        <div className="alert alert-info">
          <span className="text-sm">
            Permanent address will be the same as present address.
          </span>
        </div>
      )}

      {/* Permanent Address */}
      {!same && (
        <TextArea
          label="Permanent Address"
          required
          name="permanent_address"
          errors={errors}
          placeholder="House No., Street, Barangay, City/Municipality, Province, ZIP"
          rows={3}
        />
      )}
      <label className="flex items-center gap-3 cursor-pointer w-fit">
        <input
          type="checkbox"
          name="permanent_address"
          checked={same}
          onChange={(e) => setSame(e.target.checked)}
          className="checkbox checkbox-primary"
        />
        <span className="text-sm font-medium">
          Same as present address
        </span>
      </label>

    </>
  );
}

export function Step2Address({ errors,show }: Step2Props) {


  return (
    <div className={`space-y-6 ${show ? "block" : "hidden"}`}>
      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">PRESENT ADDRESS</div>
      <TextArea
        label="Present Address"
        required
        name="present_address"
        errors={errors?.present_address}
        placeholder="House No., Street, Barangay, City/Municipality, Province, ZIP"
        rows={3}
      />

      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">
        PERMANENT ADDRESS
      </div>
      <CombinedPermanentAddressComponent errors={errors?.permanent_address} />

    </div>
  );
}