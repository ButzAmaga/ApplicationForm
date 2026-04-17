"use client";

import { FormAppErrors, FormErrors } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { TextInput, Select, CheckboxGroup, TextArea, NumberInput, DateInput, AvatarUpload } from "./formFields";

const SEX_OPTIONS = ["male", "female"];
const STATUS_OPTIONS = ["single", "married", "divorce"];

const CONSTELLATION_OPTIONS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
].map((c) => ({ value: c, label: c }));

type StepPersonalType = {
  errors: FormAppErrors
  show:boolean;
}

export function Step1Personal({ errors, show } : StepPersonalType) {

  const [toggleReset, setToggleReset] = useState<number>(0);

  useEffect(() => {
    setToggleReset((prev) => prev + 1);
  }, [errors]);

  return (
    
    <div className={`space-y-6 ${show ? "opacity-100 h-auto visible" 
    : "opacity-0 h-0 overflow-hidden invisible"}`}>
      {/* ── Avatar ─────────────────────────────────────────────────────── */}
      <AvatarUpload name={"avatar"} errors={errors?.avatar} toggleReset={toggleReset}/>

      {/* ── Identity ───────────────────────────────────────────────────── */}
      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">IDENTITY</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          label="Full Name" required
          errors={errors?.full_name} placeholder="Juan dela Cruz"
          name="full_name"
        />
        <TextInput
          label="Position"
          required
          name="position"
          errors={errors?.position}
          placeholder="e.g. Nurse"
        />

        <TextInput
          label="Religion"
          required
          name="religion"
          errors={errors?.religion}
          placeholder="e.g. Catholic"
        />

        <TextInput
          label="Agency"
          required
          name="agency"
          errors={errors?.agency}
          placeholder="e.g. POEA"
        />
      </div>

      {/* ── Demographics ───────────────────────────────────────────────── */}
      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">DEMOGRAPHICS</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <NumberInput
          label="Age"
          required
          name="age"
          errors={errors?.age}
          hint="between 16 and 100"
        />

        <DateInput
          label="Date of Birth"
          required
          name="date_of_birth"
          errors={errors?.date_of_birth}
        />

        <TextInput
          label="Place of Birth"
          required
          name="place_of_birth"
          errors={errors?.place_of_birth}
          placeholder="Manila"
          className="col-span-2 sm:col-span-1"
        />

        <NumberInput
          label="Height (cm)"
          required
          name="height"
          errors={errors?.height}
          hint="cm"
        />

        <NumberInput
          label="Weight (kg)"
          required
          name="weight"
          errors={errors?.weight}
          hint="kg"
        />
        <Select
          label="Constellation" required
          options={CONSTELLATION_OPTIONS}
          errors={errors?.constellation}
          placeholder="Select sign"
          name="constellation"

        />
      </div>

      {/* ── Status ─────────────────────────────────────────────────────── */}
      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">STATUS</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CheckboxGroup
          label="Sex"
          name="sex"
          required
          options={SEX_OPTIONS}
          errors={errors?.sex}
        />

        <CheckboxGroup
          label="Civil Status"
          name="civil_status"
          required
          options={STATUS_OPTIONS}
          errors={errors?.civil_status}
        />
      </div>

      {/* ── Employment ─────────────────────────────────────────────────── */}
      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">EMPLOYMENT</div>
      <TextArea
        label="Employment Record" required
        hint=""
        errors={errors?.employment_record}
        placeholder="List your relevant work experience, make it short... (ex:Same job experience in the same industry as the position applied for or Waiter, Cook, Cleaner)"
        rows={4}
        name="employment_record"
      />
    </div>
  );
}