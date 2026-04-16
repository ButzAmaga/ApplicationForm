"use client";

import { FormErrors } from "@/lib/types";
import { useRef } from "react";
import { TextInput, Select, CheckboxGroup, TextArea } from "./formFields";


interface Step1Props {
  data: Partial<FormData>;
  errors: FormErrors;
  onChange: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const SEX_OPTIONS    = ["Male", "Female", "Other"] as const;
const STATUS_OPTIONS = ["Single", "Married", "Widowed", "Separated", "Divorced"] as const;

const CONSTELLATION_OPTIONS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
].map((c) => ({ value: c, label: c }));

export function Step1Personal({ data, errors, onChange }: Step1Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange("avatar", reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* ── Avatar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="avatar cursor-pointer group"
          onClick={() => fileRef.current?.click()}
        >
          <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-200 flex items-center justify-center relative">
            {data.avatar ? (
              <img src={data.avatar} alt="avatar" className="object-cover w-full h-full" />
            ) : (
              <span className="text-4xl">🧑</span>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs rounded-full">
              Upload
            </div>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
        <button
          type="button"
          className="btn btn-outline btn-primary btn-xs"
          onClick={() => fileRef.current?.click()}
        >
          {data.avatar ? "Change Photo" : "Upload Photo"}
        </button>
        {errors.avatar && <p className="text-error text-xs">{errors.avatar}</p>}
      </div>

      {/* ── Identity ───────────────────────────────────────────────────── */}
      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">IDENTITY</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          label="Full Name" required
          value={data.name ?? ""}
          onChange={(e) => onChange("name", e.target.value)}
          error={errors.name} placeholder="Juan dela Cruz"
        />
        <TextInput
          label="Position" required
          value={data.position ?? ""}
          onChange={(e) => onChange("position", e.target.value)}
          error={errors.position} placeholder="e.g. Nurse"
        />
        <TextInput
          label="Religion" required
          value={data.religion ?? ""}
          onChange={(e) => onChange("religion", e.target.value)}
          error={errors.religion} placeholder="e.g. Catholic"
        />
        <TextInput
          label="Agency" required
          value={data.agency ?? ""}
          onChange={(e) => onChange("agency", e.target.value)}
          error={errors.agency} placeholder="e.g. POEA"
        />
      </div>

      {/* ── Demographics ───────────────────────────────────────────────── */}
      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">DEMOGRAPHICS</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <TextInput
          label="Age" required type="number" min={16} max={100}
          value={data.age ?? ""}
          onChange={(e) => onChange("age", e.target.value)}
          error={errors.age} placeholder="25"
        />
        <TextInput
          label="Date of Birth" required type="date"
          value={data.date_birth ?? ""}
          onChange={(e) => onChange("date_birth", e.target.value)}
          error={errors.date_birth}
        />
        <TextInput
          label="Place of Birth" required
          value={data.place_birth ?? ""}
          onChange={(e) => onChange("place_birth", e.target.value)}
          error={errors.place_birth} placeholder="Manila"
          className="col-span-2 sm:col-span-1"
        />
        <TextInput
          label="Height (cm)" required type="number"
          value={data.height ?? ""}
          onChange={(e) => onChange("height", e.target.value)}
          error={errors.height} placeholder="165"
        />
        <TextInput
          label="Weight (kg)" required type="number"
          value={data.weight ?? ""}
          onChange={(e) => onChange("weight", e.target.value)}
          error={errors.weight} placeholder="60"
        />
        <Select
          label="Constellation" required
          value={data.constellation ?? ""}
          onChange={(v) => onChange("constellation", v)}
          options={CONSTELLATION_OPTIONS}
          error={errors.constellation}
          placeholder="Select sign"
        />
      </div>

      {/* ── Status ─────────────────────────────────────────────────────── */}
      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">STATUS</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CheckboxGroup
          label="Sex" required
          options={SEX_OPTIONS as unknown as string[]}
          value={data.sex ?? ""}
          onChange={(v) => onChange("sex", v as FormData["sex"])}
          error={errors.sex}
        />
        <CheckboxGroup
          label="Civil Status" required
          options={STATUS_OPTIONS as unknown as string[]}
          value={data.civil_status ?? ""}
          onChange={(v) => onChange("civil_status", v as FormData["civil_status"])}
          error={errors.civil_status}
        />
      </div>

      {/* ── Employment ─────────────────────────────────────────────────── */}
      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">EMPLOYMENT</div>
      <TextArea
        label="Employment Record" required
        hint="Same job experience in the same industry as the position applied for"
        value={data.employment_record ?? ""}
        onChange={(e) => onChange("employment_record", e.target.value)}
        error={errors.employment_record}
        placeholder="List your relevant work experience..."
        rows={4}
      />
    </div>
  );
}