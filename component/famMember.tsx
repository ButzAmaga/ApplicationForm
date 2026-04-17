import { useState, useCallback } from "react";
import { TextInput, DateInput, NumberInput, CheckboxGroup } from "./formFields";
import { error } from "console";

type FamilyMember = {
  id: number;
};

type Step4Props = {
  errors?: {
    family_members?: string[] | undefined;
  };
  show: boolean;
};

const emptyMember = (): FamilyMember => ({
  id: Date.now(),
});

export function Step4Family({ errors, show }: Step4Props) {
  const [members, setMembers] = useState<FamilyMember[]>([]);


  const addMember = () => {
    setMembers((prev) => [...prev, emptyMember()]);
  };

  const removeMember = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };


  return (
    <div className={`space-y-6 ${show? "block" : "hidden"}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base-content">Family Members</h3>
          <p className="text-xs text-base-content/50">
            Add household members or relatives
          </p>
        </div>

        <button type="button" onClick={addMember} className="btn btn-primary btn-sm">
          + Add Member
        </button>
      </div>

      {/* Empty state */}
      {members.length === 0 && (
        <div className="border-2 border-dashed border-base-300 rounded-xl p-8 text-center">
          <p className="text-sm text-base-content/60">
            No family members added yet.
          </p>
          <button
            type="button"
            onClick={addMember}
            className="btn btn-outline btn-primary btn-sm mt-3"
          >
            Add First Member
          </button>
        </div>
      )}

      {/* Dynamic list */}
      <div className="space-y-6">
        {members?.map((member, idx) => (
          <div key={member.id} className="card bg-base-200 border border-base-300">
            <div className="card-body p-4 space-y-4">

              {/* Header row */}
              <div className="flex justify-between items-center">
                <span className="badge badge-primary">
                  Member #{idx + 1}
                </span>

                <button
                  type="button"
                  onClick={() => removeMember(member.id)}
                  className="btn btn-ghost btn-xs text-error"
                >
                  Remove
                </button>
              </div>

              {/* GRID FIELDS (your requested format) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <TextInput
                  label="Name"
                  required
                  name={`family_members_${idx}_name`}
                  errors={[]}
                  placeholder="Full name"
                />

                <TextInput
                  label="Relationship"
                  required
                  name={`family_members_${idx}_relationship`}
                  errors={[]}
                  placeholder="e.g. Spouse, Child"
                />

                <TextInput
                  label="Phone"
                  required
                  name={`family_members_${idx}_phone`}
                  errors={[]}
                />

                <CheckboxGroup
                  label="Living Together"
                  name={`family_members_${idx}_living_together`}
                  options={["yes", "no"]}
                  errors={[]}
                />




              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add more */}
      {members.length > 0 && (
        <button
          type="button"
          onClick={addMember}
          className="btn btn-outline btn-primary w-full"
        >
          + Add Another Member
        </button>
      )}
    </div>
  );
}