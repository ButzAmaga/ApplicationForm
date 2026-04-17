import { useState } from "react";
import { TextInput, DateInput } from "./formFields";

type EmploymentRecord = {
  id: number;
};

type Step5Props = {
  errors?: {
    employment_records?: string[] | undefined;
  };
  show: boolean;
};

const emptyRecord = (): EmploymentRecord => ({
  id: Date.now(),
});

export function Step5Employment({ errors, show }: Step5Props) {
  const [records, setRecords] = useState<EmploymentRecord[]>([]);

  const addRecord = () => {
    setRecords((prev) => [...prev, emptyRecord()]);
  };

  const removeRecord = (id: number) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className={`space-y-6 ${show ? "block" : "hidden"}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base-content">Employment History</h3>
          <p className="text-xs text-base-content/50">
            Add previous or current work experience
          </p>
        </div>

        <button type="button" onClick={addRecord} className="btn btn-primary btn-sm">
          + Add Employment
        </button>
      </div>

      {/* Empty state */}
      {records.length === 0 && (
        <div className="border-2 border-dashed border-base-300 rounded-xl p-8 text-center">
          <p className="text-sm text-base-content/60">
            No employment records added yet.
          </p>
          <button
            type="button"
            onClick={addRecord}
            className="btn btn-outline btn-primary btn-sm mt-3"
          >
            Add First Employment
          </button>
        </div>
      )}

      {/* Dynamic list */}
      <div className="space-y-6">
        {records.map((record, idx) => (
          <EmploymentEntry
            key={record.id}
            idx={idx}
            onRemove={() => removeRecord(record.id)}
          />
        ))}
      </div>

      {/* Add more */}
      {records.length > 0 && (
        <button
          type="button"
          onClick={addRecord}
          className="btn btn-outline btn-primary w-full"
        >
          + Add Another Employment
        </button>
      )}
    </div>
  );
}

// ─── Single employment entry ────────────────────────────────────────────────

type EmploymentEntryProps = {
  idx: number;
  onRemove: () => void;
};

function EmploymentEntry({ idx, onRemove }: EmploymentEntryProps) {
  const [jobDescriptions, setJobDescriptions] = useState<{ id: number }[]>([]);

  const addDescription = () => {
    setJobDescriptions((prev) => [...prev, { id: Date.now() }]);
  };

  const removeDescription = (id: number) => {
    setJobDescriptions((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="card bg-base-200 border border-base-300">
      <div className="card-body p-4 space-y-4">

        {/* Header row */}
        <div className="flex justify-between items-center">
          <span className="badge badge-primary">
            Employment #{idx + 1}
          </span>

          <button
            type="button"
            onClick={onRemove}
            className="btn btn-ghost btn-xs text-error"
          >
            Remove
          </button>
        </div>

        {/* Date range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DateInput
            label="From"
            required
            name={`employment_records_${idx}_from`}
            errors={[]}
          />

          <DateInput
            label="To"
            required
            name={`employment_records_${idx}_to`}
            errors={[]}
          />
        </div>

        {/* Other fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Position"
            required
            name={`employment_records_${idx}_position`}
            errors={[]}
            placeholder="e.g. Software Engineer"
          />

          <TextInput
            label="Name and Address"
            required
            name={`employment_records_${idx}_name_address`}
            errors={[]}
            placeholder="Company name and address"
          />

          <TextInput
            label="Reason for Leaving"
            required
            name={`employment_records_${idx}_reason_for_leaving`}
            errors={[]}
            placeholder="e.g. Career growth"
          />
        </div>

        {/* Job Descriptions sub-list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-base-content">
                Job Descriptions
              </p>
              <p className="text-xs text-base-content/50">
                List your key responsibilities
              </p>
            </div>

            <button
              type="button"
              onClick={addDescription}
              className="btn btn-outline btn-secondary btn-xs"
            >
              + Add Description
            </button>
          </div>

          {/* Empty state for descriptions */}
          {jobDescriptions.length === 0 && (
            <div className="border border-dashed border-base-300 rounded-lg p-4 text-center">
              <p className="text-xs text-base-content/50">
                No job descriptions added yet.
              </p>
            </div>
          )}

          {/* Description rows */}
          {jobDescriptions.map((desc, descIdx) => (
            <div key={desc.id} className="flex items-start gap-2">
              <span className="text-xs text-base-content/40 mt-3 w-5 shrink-0 text-right">
                {descIdx + 1}.
              </span>

              <div className="flex-1">
                <TextInput
                  label=""
                  name={`employment_records_${idx}_job_descriptions_${descIdx}`}
                  errors={[]}
                  placeholder="Describe a responsibility or achievement"
                />
              </div>

              <button
                type="button"
                onClick={() => removeDescription(desc.id)}
                className="btn btn-ghost btn-xs text-error mt-2 shrink-0"
              >
                ✕
              </button>
            </div>
          ))}

          {jobDescriptions.length > 0 && (
            <button
              type="button"
              onClick={addDescription}
              className="btn btn-ghost btn-xs btn-block text-secondary"
            >
              + Add Another Description
            </button>
          )}
        </div>

      </div>
    </div>
  );
}