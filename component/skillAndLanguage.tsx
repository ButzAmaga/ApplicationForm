"use client";

import { CheckboxGroup, TextInput } from "./formFields";

const SPEAK_OPTIONS = [
  "Fluent",
  "Ordinary",
  "Difference",
];

const WRITE_OPTIONS = [
  "Fluent",
  "Ordinary",
  "Difference",
];

const LANGUAGE_OPTIONS = [
  "Chinese",
  "Other",
];

type Step8Props = {
  errors: {
    english_speak?: string[] | undefined;
    english_write?: string[] | undefined;
    optional_languages?: string[] | undefined;
    chinese_speak?: string[] | undefined;
    chinese_write?: string[] | undefined;
    other_language?: string[] | undefined;
    other_speak?: string[] | undefined;
    other_write?: string[] | undefined;
    skill?: string[] | undefined;
  } | null;
  show: boolean;
  optionalLanguages?: string[];
};

export function Step8SkillLanguages({ errors, show, optionalLanguages = [] }: Step8Props) {
  const showChinese = optionalLanguages.includes("chinese");
  const showOther = optionalLanguages.includes("other");

  return (
    <div className={`space-y-6 ${show ? "block" : "hidden"}`}>
      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">
        SKILL
      </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput 
          label="Special Skill/Training" 
          name="skill" errors={errors?.skill} 
          hint="e.g. Graphic Design"
          required={false}
        />
    </div>


      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">
        LANGUAGE PROFICIENCY
      </div>

      {/* English - always shown */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body gap-4 p-4">
          <h3 className="font-semibold text-sm tracking-wide">
            English <span className="text-error">*</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CheckboxGroup
              label="Speaking"
              name="english_speak"
              required
              options={SPEAK_OPTIONS}
              errors={errors?.english_speak}
            />
            <CheckboxGroup
              label="Writing"
              name="english_write"
              required
              options={WRITE_OPTIONS}
              errors={errors?.english_write}
            />
          </div>
        </div>
      </div>


        <div className="card bg-base-200 shadow-sm">
          <div className="card-body gap-4 p-4">
            <h3 className="font-semibold text-sm tracking-wide">Chinese</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CheckboxGroup
                label="Speaking"
                name="chinese_speak"
                options={SPEAK_OPTIONS}
                errors={errors?.chinese_speak}
                required={false}
              />
              <CheckboxGroup
                label="Writing"
                name="chinese_write"
                options={WRITE_OPTIONS}
                errors={errors?.chinese_write}
                required={false}
              />
            </div>
          </div>
        </div>


        <div className="card bg-base-200 shadow-sm">
          <div className="card-body gap-4 p-4">
            <h3 className="font-semibold text-sm tracking-wide">Other Language</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CheckboxGroup
                label="Speaking"
                name="other_speak"
                options={SPEAK_OPTIONS}
                errors={errors?.other_speak}
                required={false}
              />
              <CheckboxGroup
                label="Writing"
                name="other_write"
                options={WRITE_OPTIONS}
                errors={errors?.other_write}
                required={false}
              />
            </div>
          </div>
        </div>


      {/* Language tips */}
      <div className="alert shadow-sm bg-base-200">
        <svg className="w-5 h-5 text-info shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm">
          <p className="font-medium">Language Proficiency</p>
          <p className="text-base-content/60">English is required. You may optionally declare proficiency in Chinese or other languages.</p>
        </div>
      </div>
    </div>
  );
}