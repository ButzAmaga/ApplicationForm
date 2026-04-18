"use client";

import { CheckboxGroup, DateInput, TextInput } from "./formFields";

const YES_NO_OPTIONS = [
    "yes", "no"
];

type Step9Props = {
    errors: {
        criminal_record?: string[] | undefined;
        education_certification?: string[] | undefined;
        proof_of_work_experience?: string[] | undefined;
        date_of_application?: string[] | undefined;
    } | null;
    show: boolean;

    // lifted state from parent
    isReadConfirm: boolean;
    setIsReadConfirm: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Step10Declaration({ errors, show, isReadConfirm, setIsReadConfirm }: Step9Props) {
    return (
        <div className={`space-y-6 ${show ? "block" : "hidden"}`}>
            <div className="divider text-xs font-semibold tracking-widest text-base-content/50">
                EXTRA
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CheckboxGroup
                    label="Criminal Record"
                    name="criminal_record"
                    required
                    options={YES_NO_OPTIONS}
                    errors={errors?.criminal_record}
                />

                <CheckboxGroup
                    label="Education Certification"
                    name="education_certification"
                    required
                    options={YES_NO_OPTIONS}
                    errors={errors?.education_certification}
                />

                <CheckboxGroup
                    label="Proof of Work Experience"
                    name="proof_of_work_experience"
                    required
                    options={YES_NO_OPTIONS}
                    errors={errors?.proof_of_work_experience}
                />
            </div>

            <div className="divider text-xs font-semibold tracking-widest text-base-content/50">
                APPLICATION CONFIRMATION
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DateInput
                    label="Date of Application"
                    required
                    name="date_of_application"
                    errors={errors?.date_of_application}
                />



            </div>

            {/* Declaration tips */}

            <div className="form-control max-w-2xl bg-base-200 p-4 rounded-lg shadow-sm border border-base-300 text-wrap">
                <label className="label cursor-pointer items-start gap-4">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-primary mt-1"
                        onChange={() => setIsReadConfirm(prev => !prev)}
                        checked={isReadConfirm}
                    />
                    <span className="label-text text-sm leading-relaxed text-base-content/80 text-wrap">
                        I hereby confirm that I have carefully reviewed all the information provided
                        and that it is true, complete, and correct to the best of my knowledge.
                        I understand that any false or misleading information may result in
                        disqualification from the application process.
                    </span>
                </label>
            </div>
            {/* Submition tips */}
            <div className="alert shadow-sm bg-base-200">
                <svg className="w-5 h-5 text-info shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm">
                    <p className="font-medium">Important</p>
                    <p className="text-base-content/60">If picture submission fails, please reupload the images, as this may be caused by the browser’s default security protection. If the Submit button does not respond, please check all required fields first.</p>
                </div>
            </div>
        </div>
    );
}