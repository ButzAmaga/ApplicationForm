"use client";

import { useState, useRef, useEffect } from "react";

type ImageUploadA4Props = {
  label?: string;
  name: string;
  required?: boolean;
  errors?: string[];
  hint?: string;
  isPending:boolean
};

export function ImageUploadA4({
  label = "Upload Document",
  name,
  required = false,
  errors,
  hint,
  isPending
}: ImageUploadA4Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // reset the preview upon submit
    useEffect(() => {
        if(isPending)
            setPreview(null)
    }, [isPending])

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="form-control w-full gap-1">
      {/* Label */}
      {label && (
        <label className="label pb-1">
          <span className="label-text font-medium">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
          {hint && <span className="label-text-alt text-base-content/50">{hint}</span>}
        </label>
      )}

      {/* A4 Preview Area — aspect ratio 1:√2 ≈ 210:297 */}
      <div
        className={`relative w-full mx-auto border-2 rounded-lg overflow-hidden transition-colors
          ${isDragging ? "border-primary bg-primary/5" : errors?.length ? "border-error" : "border-base-300"}
        `}
        style={{ aspectRatio: "210 / 297", maxWidth: "360px" }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          /* Uploaded image preview */
          <>
            <img
              src={preview}
              alt="Document preview"
              className="w-full h-full object-cover"
            />
            {/* Clear button overlay */}
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 btn btn-xs btn-error btn-circle shadow"
              aria-label="Remove image"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          /* Placeholder */
          <div className="w-full h-full bg-base-200 flex flex-col items-center justify-center gap-3 p-6 select-none">
            {/* Fake document illustration */}
            <div className="w-24 opacity-30">
              <svg viewBox="0 0 96 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-base-content">
                <rect x="4" y="4" width="88" height="120" rx="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="3"/>
                <path d="M20 30h56M20 44h56M20 58h56M20 72h40" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                {/* Photo placeholder box */}
                <rect x="20" y="84" width="28" height="28" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="28" cy="93" r="4" fill="currentColor" fillOpacity="0.4"/>
                <path d="M20 112l10-10 6 6 4-4 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-base-content/60">A4 Document Preview</p>
              <p className="text-xs text-base-content/40 mt-1">Drag & drop or click to upload</p>
            </div>

            {/* Upload icon */}
            <svg className="w-6 h-6 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>

            {/* Invisible full-area click target */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Click to upload"
            />
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex gap-2 mt-2 max-w-90 mx-auto w-full">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn btn-primary btn-sm flex-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {preview ? "Change File" : "Upload File"}
        </button>

        {preview && (
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-outline btn-error btn-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        required={required}
      />

      {/* File type hint */}
      <label className="label pt-1 max-w-90 mx-auto w-full">
        <span className="label-text-alt text-base-content/40">Accepted: JPG, PNG, WEBP</span>
        {preview && <span className="label-text-alt text-success">✓ File selected</span>}
      </label>

      {/* Errors */}
      {errors?.map((error, i) => (
        <p key={i} className="text-error text-xs mt-1">{error}</p>
      ))}
    </div>
  );
}