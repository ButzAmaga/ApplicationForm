"use client";

import { useCallback } from "react";
import { nanoid } from "nanoid";
import { FormErrors } from "@/lib/types";


interface Step4Props {
  data: Partial<FormData>;
  errors: FormErrors;
  onChange: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const emptyMember = (): FamilyMember => ({
  id: nanoid(8),
  name: "",
  relationship: "",
  phone: "",
  liveTogether: false,
});

export function Step4Family({ data, errors, onChange }: Step4Props) {
  const members: FamilyMember[] = data.family_members ?? [];

  const updateMember = useCallback(
    (id: string, patch: Partial<FamilyMember>) => {
      onChange(
        "family_members",
        members.map((m) => (m.id === id ? { ...m, ...patch } : m))
      );
    },
    [members, onChange]
  );

  const removeMember = (id: string) =>
    onChange("family_members", members.filter((m) => m.id !== id));

  const addMember = () =>
    onChange("family_members", [...members, emptyMember()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base-content">Family Members</h3>
          <p className="text-xs text-base-content/50 mt-0.5">Add household members or relatives</p>
        </div>
        <button
          type="button"
          onClick={addMember}
          className="btn btn-primary btn-sm gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Member
        </button>
      </div>

      {members.length === 0 && (
        <div className="border-2 border-dashed border-base-300 rounded-xl p-8 text-center">
          <div className="text-4xl mb-2">👨‍👩‍👧</div>
          <p className="text-base-content/60 text-sm">No family members added yet.</p>
          <button type="button" onClick={addMember} className="btn btn-outline btn-primary btn-sm mt-3">
            + Add First Member
          </button>
        </div>
      )}

      <div className="space-y-4">
        {members.map((member, idx) => (
          <div
            key={member.id}
            className="card bg-base-200 shadow-sm border border-base-300"
          >
            <div className="card-body p-4 gap-3">
              {/* Card header */}
              <div className="flex items-center justify-between">
                <span className="badge badge-primary badge-outline font-semibold">
                  Member #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeMember(member.id)}
                  className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Remove
                </button>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm font-medium">
                      Name <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateMember(member.id, { name: e.target.value })}
                    className={`input input-bordered input-sm w-full ${
                      errors[`family_${idx}_name`] ? "input-error" : ""
                    }`}
                    placeholder="Full name"
                  />
                  {errors[`family_${idx}_name`] && (
                    <label className="label py-0.5">
                      <span className="label-text-alt text-error text-xs">{errors[`family_${idx}_name`]}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm font-medium">
                      Relationship <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={member.relationship}
                    onChange={(e) => updateMember(member.id, { relationship: e.target.value })}
                    className={`input input-bordered input-sm w-full ${
                      errors[`family_${idx}_relationship`] ? "input-error" : ""
                    }`}
                    placeholder="e.g. Spouse, Child"
                  />
                  {errors[`family_${idx}_relationship`] && (
                    <label className="label py-0.5">
                      <span className="label-text-alt text-error text-xs">{errors[`family_${idx}_relationship`]}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm font-medium">Phone</span>
                    <span className="label-text-alt text-xs text-base-content/50">Optional</span>
                  </label>
                  <input
                    type="tel"
                    value={member.phone}
                    onChange={(e) => updateMember(member.id, { phone: e.target.value })}
                    className={`input input-bordered input-sm w-full ${
                      errors[`family_${idx}_phone`] ? "input-error" : ""
                    }`}
                    placeholder="+63 9XX XXX XXXX"
                  />
                  {errors[`family_${idx}_phone`] && (
                    <label className="label py-0.5">
                      <span className="label-text-alt text-error text-xs">{errors[`family_${idx}_phone`]}</span>
                    </label>
                  )}
                </div>

                <div className="form-control justify-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer pt-6">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm"
                      checked={member.liveTogether}
                      onChange={(e) => updateMember(member.id, { liveTogether: e.target.checked })}
                    />
                    <span className="text-sm">Lives together with you</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {members.length > 0 && (
        <button
          type="button"
          onClick={addMember}
          className="btn btn-outline btn-primary btn-sm w-full gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Another Member
        </button>
      )}
    </div>
  );
}