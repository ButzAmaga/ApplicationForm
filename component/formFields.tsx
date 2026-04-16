"use client";

import { type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode, useState } from "react";

// ─── Field Wrapper ─────────────────────────────────────────────────────────────
interface FieldProps {
    label: string;
    error?: string;
    required?: boolean;
    children: ReactNode;
    hint?: string;
}


export function Field({ label, error, required, children, hint }: FieldProps) {
    return (
        <div className="form-control w-full">
            <label className="label pb-1">
                <span className="label-text font-medium text-base-content/90 flex items-center gap-1">
                    {label}
                    {required && <span className="text-error text-xs">*</span>}
                </span>
                {hint && <span className="label-text-alt text-base-content/50 text-xs">{hint}</span>}
            </label>
            {children}
            {error && (
                <label className="label pt-1">
                    <span className="label-text-alt text-error flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </span>
                </label>
            )}
        </div>
    );
}

// ─── Text Input ────────────────────────────────────────────────────────────────
interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    hint?: string;
}

export function TextInput({ label, error, hint, required, ...props }: TextInputProps) {
    const [val, setValue] = useState<string>("")
    return (
        <Field label={label} error={error} required={required} hint={hint}>
            <input
                {...props}
                required={required}
                className={`input input-bordered w-full transition-all duration-200 focus:input-primary ${error ? "input-error" : ""
                    } ${props.className ?? ""}`}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setValue(ev.target.value)}
                value={val}
            />
        </Field>
    );
}

// ─── Textarea ──────────────────────────────────────────────────────────────────
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    hint?: string;
}

export function TextArea({ label, error, hint, required, ...props }: TextAreaProps) {
    return (
        <Field label={label} error={error} required={required} hint={hint}>
            <textarea
                {...props}
                required={required}
                className={`textarea textarea-bordered w-full min-h-20 resize-none transition-all duration-200 focus:textarea-primary ${error ? "textarea-error" : ""
                    } ${props.className ?? ""}`}
            />
        </Field>
    );
}

// ─── Select ────────────────────────────────────────────────────────────────────
interface SelectProps {
    label: string;
    error?: string;
    hint?: string;
    required?: boolean;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
}

export function Select({ label, error, hint, required, value, onChange, options, placeholder }: SelectProps) {
    return (
        <Field label={label} error={error} required={required} hint={hint}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`select select-bordered w-full transition-all duration-200 focus:select-primary ${error ? "select-error" : ""
                    }`}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </Field>
    );
}

// ─── Checkbox Group ────────────────────────────────────────────────────────────
interface CheckboxGroupProps<T extends string> {
    label: string;
    error?: string;
    required?: boolean;
    options: T[];
    value: T | "";
    onChange: (v: T) => void;
}

export function CheckboxGroup<T extends string>({
    label, error, required, options, value, onChange,
}: CheckboxGroupProps<T>) {
    return (
        <Field label={label} error={error} required={required}>
            <div className="flex flex-wrap gap-3 pt-1">
                {options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="radio"
                            className="radio radio-primary"
                            checked={value === opt}
                            onChange={() => onChange(opt)}
                        />
                        <span className="text-sm group-hover:text-primary transition-colors">{opt}</span>
                    </label>
                ))}
            </div>
        </Field>
    );
}