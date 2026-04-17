import { useState } from "react";
import { Select, TextInput } from "./formFields";

type EducationRecord = {
  id: number;
};

type StepEducationProps = {
  errors?: {
    education_records?: string[] | undefined;
  };
  show: boolean;
};

const emptyRecord = (): EducationRecord => ({
  id: Date.now(),
});

const EDUCATIONAL_ATTAINMENT_OPTIONS = [
  { value: "No Formal Education", label: "No Formal Education" },
  { value: "Elementary Graduate", label: "Elementary Graduate" },
  { value: "High School Graduate", label: "High School Graduate" },
  { value: "Vocational / Technical", label: "Vocational / Technical" },
  { value: "Some College", label: "Some College" },
  { value: "College Graduate", label: "College Graduate" },
  { value: "Post Graduate (Master's)", label: "Post Graduate (Master's)" },
  { value: "Post Graduate (Doctorate)", label: "Post Graduate (Doctorate)" },
];

export function Step6Education({ errors, show }: StepEducationProps) {
  const [records, setRecords] = useState<EducationRecord[]>([]);

  const addRecord = () => {
    setRecords((prev) => [...prev, emptyRecord()]);
  };

  const removeRecord = (id: number) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className={`space-y-6 ${show ? "block" : "hidden"}`}>

      {/* Educational Attainment — outside the member list */}
      <div>
        <h3 className="font-semibold text-base-content">Educational Background</h3>
        <p className="text-xs text-base-content/50 mb-3">
          Your highest level of education and school history
        </p>

        <Select
          label="Educational Attainment"
          required
          name="educational_attainment"
          options={EDUCATIONAL_ATTAINMENT_OPTIONS}
          errors={errors?.education_records ?? []}
        />
      </div>

      <div className="divider" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base-content">Education Records</h3>
          <p className="text-xs text-base-content/50">
            Add your schools and courses
          </p>
        </div>

        <button type="button" onClick={addRecord} className="btn btn-primary btn-sm">
          + Add Record
        </button>
      </div>

      {/* Empty state */}
      {records.length === 0 && (
        <div className="border-2 border-dashed border-base-300 rounded-xl p-8 text-center">
          <p className="text-sm text-base-content/60">
            No education records added yet.
          </p>
          <button
            type="button"
            onClick={addRecord}
            className="btn btn-outline btn-primary btn-sm mt-3"
          >
            Add First Record
          </button>
        </div>
      )}

      {/* Dynamic list */}
      <div className="space-y-6">
        {records.map((record, idx) => (
          <div key={record.id} className="card bg-base-200 border border-base-300">
            <div className="card-body p-4 space-y-4">

              {/* Header row */}
              <div className="flex justify-between items-center">
                <span className="badge badge-primary">
                  Record #{idx + 1}
                </span>

                <button
                  type="button"
                  onClick={() => removeRecord(record.id)}
                  className="btn btn-ghost btn-xs text-error"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <TextInput
                  label="Level"
                  required
                  name={`education_records_${idx}_level`}
                  errors={[]}
                  placeholder="e.g. College, High School"
                />

                <TextInput
                  label="School"
                  required
                  name={`education_records_${idx}_school`}
                  errors={[]}
                  placeholder="School or university name"
                />

                <TextInput
                  label="From"
                  required
                  name={`education_records_${idx}_from`}
                  errors={[]}
                  placeholder="e.g. 2018"
                />

                <TextInput
                  label="To"
                  required
                  name={`education_records_${idx}_to`}
                  errors={[]}
                  placeholder="e.g. 2022 or Present"
                />

                <div className="sm:col-span-2">
                  <TextInput
                    label="Major / Course"
                    required
                    name={`education_records_${idx}_major_course`}
                    errors={[]}
                    placeholder="e.g. BS Computer Science"
                  />
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add more */}
      {records.length > 0 && (
        <button
          type="button"
          onClick={addRecord}
          className="btn btn-outline btn-primary w-full"
        >
          + Add Another Record
        </button>
      )}
    </div>
  );
}