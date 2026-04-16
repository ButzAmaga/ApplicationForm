"use client";

import { FormErrors } from "@/lib/types";
import { useRef } from "react";
import { TextInput, Select, CheckboxGroup, TextArea, NumberInput, DateInput, AvatarUpload } from "./formFields";

const SEX_OPTIONS = ["male", "female"];
const STATUS_OPTIONS = ["single", "married", "divorced"];

const CONSTELLATION_OPTIONS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
].map((c) => ({ value: c, label: c }));

type StepPersonalType = {
  errors: {
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
  } | null;
}

export function Step1Personal({ errors } : StepPersonalType) {


  return (
    <div className="space-y-6">
      {/* ── Avatar ─────────────────────────────────────────────────────── */}
    <AvatarUpload name={"avatar"}/>

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
        hint="Same job experience in the same industry as the position applied for"
        errors={errors?.employment_record}
        placeholder="List your relevant work experience..."
        rows={4}
        name="employment_record"
      />
    </div>
  );
}