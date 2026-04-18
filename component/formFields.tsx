"use client";

import { type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode, useState, useRef, useEffect } from "react";

// ─── Field Wrapper ─────────────────────────────────────────────────────────────
interface FieldProps {
    label: string;
    errors?: string[];
    required?: boolean;
    children: ReactNode;
    hint?: string;
}


export function Field({ label, errors, required, children, hint }: FieldProps) {
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
            {errors && (

                errors.map((error: string, idx: number) => (
                    <label className="label pt-1" key={idx}>
                        <span className="label-text-alt text-error flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </span>
                    </label>
                )))}
        </div>
    );
}

// ─── Text Input ────────────────────────────────────────────────────────────────
interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    errors?: string[];
    hint?: string;
}

export function TextInput({ label, name, errors, hint, required = true }: TextInputProps) {
    const [val, setValue] = useState<string>("")
    return (
        <Field label={label} errors={errors} required={required} hint={hint}>
            <input
                required={required}
                className={`input input-bordered w-full transition-all duration-200 focus:input-primary ${errors ? "input-error" : ""
                    }`}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setValue(ev.target.value)}
                value={val}
                name={name}
            />
        </Field>
    );
}

// ─── Email Input ────────────────────────────────────────────────────────────────

export function EmailInput({ label, name, errors, hint, required = true }: TextInputProps) {
    const [val, setValue] = useState<string>("")
    return (
        <Field label={label} errors={errors} required={required} hint={hint}>
            <input
                required={required}
                type="email"
                className={`input input-bordered w-full transition-all duration-200 focus:input-primary ${errors ? "input-error" : ""
                    }`}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setValue(ev.target.value)}
                value={val}
                name={name}
            />
        </Field>
    );
}

// ─── Number Input ────────────────────────────────────────────────────────────────

export function NumberInput({ label, name, errors, hint, required = true }: TextInputProps) {
    const [val, setValue] = useState<string>("")
    return (
        <Field label={label} errors={errors} required={required} hint={hint}>
            <input
                required={required}
                type="number"
                className={`input input-bordered w-full transition-all duration-200 focus:input-primary ${errors ? "input-error" : ""
                    }`}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setValue(ev.target.value)}
                value={val}
                name={name}
            />
        </Field>
    );
}

// ─── Date Input ────────────────────────────────────────────────────────────────
export function DateInput({
    label,
    name,
    errors,
    hint,
    required = true,
    defaultValue = "",
}: TextInputProps & { defaultValue?: string }) {
    const [val, setValue] = useState<string>(defaultValue);

    return (
        <Field label={label} errors={errors} required={required} hint={hint}>
            <input
                required={required}
                type="date"
                className={`input input-bordered w-full ${errors ? "input-error" : ""
                    }`}
                onChange={(e) => setValue(e.target.value)}
                value={val}
                name={name}
            />
        </Field>
    );
}

// ─── Textarea ──────────────────────────────────────────────────────────────────
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    name: string;
    errors?: string[];
    hint?: string;
}

export function TextArea({
    label,
    name,
    errors,
    hint,
    required = true,
    ...props
}: TextAreaProps) {
    const [val, setValue] = useState<string>("");

    return (
        <Field label={label} errors={errors} required={required} hint={hint}>
            <textarea
                {...props}
                name={name} // 🔥 required for FormData
                required={required}
                value={val}
                onChange={(e) => setValue(e.target.value)}
                className={`textarea textarea-bordered w-full min-h-20 resize-none transition-all duration-200 focus:textarea-primary ${errors? "textarea-error" : ""
                    } ${props.className ?? ""}`}
            />
        </Field>
    );
}

// ─── Select ────────────────────────────────────────────────────────────────────
interface SelectProps {
    label: string;
    name: string
    errors?: string[];
    hint?: string;
    required?: boolean;
    options: { value: string; label: string }[];
    placeholder?: string;
}


export function Select({
    label,
    name,
    errors,
    hint,
    required = true,
    options,
    placeholder,
}: SelectProps) {
    const [val, setValue] = useState<string>("");
    console.log("value:", val)
    return (
        <Field label={label} errors={errors} required={required} hint={hint}>
            <select
                key={val} // force reset the select
                defaultValue={val} // only works with force reset, not value property
                name={name}
                required={required}
                onChange={(e) => setValue(e.target.value)}
                className={`select select-bordered w-full transition-all duration-200 focus:select-primary ${errors ? "select-error" : ""
                    }`}

            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}

                {options.map((o, id) =>

                    <option key={o.value} value={o.value} >
                        {o.label}
                    </option>
                )}




            </select>
            {errors && (
                <div className="mt-1">
                    {errors.map((error) => (
                        <p key={error} className="text-error">
                            {error}
                        </p>
                    ))}
                </div>
            )}
        </Field>
    );
}

// ─── Checkbox Group ────────────────────────────────────────────────────────────

interface CheckboxGroupProps {
    label: string;
    name: string;
    errors?: string[];
    required?: boolean;
    options: string[];
}


export function CheckboxGroup({
    label,
    name,
    errors,
    required = true,
    options,
}: CheckboxGroupProps) {
    const [val, setValue] = useState<string | "">("");

    return (
        <Field label={label} errors={errors} required={required}>
            <div className="flex flex-wrap gap-3 pt-1">
                {options.map((opt) => (
                    <label
                        key={opt}
                        className="flex items-center gap-2 cursor-pointer group"
                    >
                        <input
                            type="radio"
                            name={name} // 🔥 important for FormData
                            defaultValue={opt}
                            checked={val === opt}
                            onChange={() => setValue(opt)}
                            required={required}
                            className={`radio radio-primary ${errors ? "radio-error" : ""
                                }`}
                        />
                        <span className="text-sm group-hover:text-primary transition-colors">
                            {opt}
                        </span>
                    </label>
                ))}
            </div>
        </Field>
    );
}

// ─── Avatar Upload ─────────────────────────────────────────────────────────────


interface AvatarUploadProps {
    name: string;
    errors?: string[];
    isPending:boolean
}

export function AvatarUpload({ name, errors, isPending }: AvatarUploadProps) {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // reset the preview upon submit
    useEffect(()=>{

        if(isPending)
            setPreview(null)

    },[isPending])

    const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create preview
        const url = URL.createObjectURL(file);
        setPreview(url);
    }; 

    return (
        <div className="flex flex-col items-center gap-3">
            <div
                className="avatar cursor-pointer group"
                onClick={() => fileRef.current?.click()}
            >
                <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-200 flex items-center justify-center relative">
                    {preview ? (
                        <img
                            src={preview}
                            alt="avatar"
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <span className="text-4xl">🧑</span>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs rounded-full">
                        Upload
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-500">2x2 Head to Neck White Background Picture</p>

            <input
                ref={fileRef}
                type="file"
                name={name} // 🔥 important for FormData
                accept="image/*"
                className="hidden"
                onChange={handleAvatar}
                required={true}
            />

            <button
                type="button"
                className="btn btn-outline btn-primary btn-xs"
                onClick={() => fileRef.current?.click()}
            >
                {preview ? "Change Photo" : "Upload Photo"}
            </button>

            {errors && errors.map((error, index) => (
                <p key={index} className="text-error text-xs">{error}</p>
            ))}
        </div>
    );
}