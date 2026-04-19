"use client";

import { useState, useRef } from "react";

// ─── Cloudinary config ────────────────────────────────────────────────────────
// Add these to your .env.local:
//   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
//   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const DELETE_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/delete_by_token`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  delete_token: string;
}

type A4Image = {
  id: string;
  label: string;
  // Set immediately for optimistic preview; replaced with Cloudinary URL after upload
  preview: string;
  // Empty while uploading; populated after Cloudinary responds
  publicId: string;
  // Short-lived token used to delete from Cloudinary on remove/replace
  deleteToken: string | null;
  uploading: boolean;
  error: string | null;
};

type MultiA4UploaderProps = {
  name: string;        // name prefix for hidden inputs — read by the server action
  label?: string;
  required?: boolean;
  errors?: string[];
  maxFiles?: number;
  hint?: string;
  isPending?: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResponse> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(UPLOAD_URL, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message ?? "Upload failed");
  }
  return res.json();
}

async function deleteByToken(deleteToken: string): Promise<void> {
  await fetch(DELETE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: deleteToken }),
  }).catch(() => {
    // Silent — token may have expired; not a fatal error.
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MultiA4Uploader({
  name,
  label = "Documents",
  required = false,
  errors,
  maxFiles = 10,
  hint,
  isPending = false,
}: MultiA4UploaderProps) {
  const [images, setImages] = useState<A4Image[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const counter = useRef(0);

  const canAdd = images.length < maxFiles && !isPending;

  // ── Add files ──────────────────────────────────────────────────────────────
  const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, maxFiles - images.length);
    if (!files.length) return;
    if (inputRef.current) inputRef.current.value = "";

    // Create optimistic entries immediately so the user sees previews
    const optimistic: A4Image[] = files.map((file) => {
      counter.current += 1;
      return {
        id: `doc-${Date.now()}-${counter.current}`,
        label: `Document ${counter.current}`,
        preview: URL.createObjectURL(file),
        publicId: "",
        deleteToken: null,
        uploading: true,
        error: null,
      };
    });

    setImages((prev) => [...prev, ...optimistic]);

    // Upload each file and patch its entry when done
    await Promise.all(
      files.map(async (file, i) => {
        const entry = optimistic[i];
        try {
          const data = await uploadToCloudinary(file);
          URL.revokeObjectURL(entry.preview);
          setImages((prev) =>
            prev.map((img) =>
              img.id === entry.id
                ? { ...img, preview: data.secure_url, publicId: data.public_id, deleteToken: data.delete_token, uploading: false }
                : img
            )
          );
        } catch (err) {
          URL.revokeObjectURL(entry.preview);
          setImages((prev) =>
            prev.map((img) =>
              img.id === entry.id
                ? { ...img, uploading: false, error: err instanceof Error ? err.message : "Upload failed" }
                : img
            )
          );
        }
      })
    );
  };

  // ── Remove ─────────────────────────────────────────────────────────────────
  const handleRemove = async (id: string) => {
    const target = images.find((img) => img.id === id);
    if (!target) return;

    if (target.deleteToken) await deleteByToken(target.deleteToken);
    if (target.uploading) URL.revokeObjectURL(target.preview);

    setImages((prev) => prev.filter((img) => img.id !== id));
    if (editingId === id) setEditingId(null);
  };

  // ── Replace ────────────────────────────────────────────────────────────────
  const handleReplace = async (id: string, file: File) => {
    const target = images.find((img) => img.id === id);
    if (!target) return;

    // Delete the old image from Cloudinary
    if (target.deleteToken) await deleteByToken(target.deleteToken);

    // Optimistic preview
    const localUrl = URL.createObjectURL(file);
    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? { ...img, preview: localUrl, publicId: "", deleteToken: null, uploading: true, error: null }
          : img
      )
    );

    try {
      const data = await uploadToCloudinary(file);
      URL.revokeObjectURL(localUrl);
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? { ...img, preview: data.secure_url, publicId: data.public_id, deleteToken: data.delete_token, uploading: false }
            : img
        )
      );
    } catch (err) {
      URL.revokeObjectURL(localUrl);
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? { ...img, uploading: false, error: err instanceof Error ? err.message : "Upload failed" }
            : img
        )
      );
    }
  };

  // ── Rename ─────────────────────────────────────────────────────────────────
  const handleRename = (id: string, label: string) => {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, label } : img)));
    setEditingId(null);
  };

  return (
    <div className="form-control w-full gap-2">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label className="label-text font-medium">
          {label}
          {required && <span className="text-error ml-1">*</span>}
          <span className="ml-2 badge badge-ghost badge-sm">
            {images.length}/{maxFiles}
          </span>
        </label>
        {hint && <span className="label-text-alt text-base-content/50">{hint}</span>}
      </div>

      {/* Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <DocumentCard
              key={img.id}
              img={img}
              isEditing={editingId === img.id}
              isPending={isPending}
              onEdit={() => setEditingId(img.id)}
              onRename={(label) => handleRename(img.id, label)}
              onRemove={() => handleRemove(img.id)}
              onReplace={(file) => handleReplace(img.id, file)}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && (
        <div className="border-2 border-dashed border-base-300 rounded-lg p-10 flex flex-col items-center justify-center gap-3 text-base-content/40">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-medium">No documents uploaded yet</p>
          <p className="text-xs">Click the button below to add your first document</p>
        </div>
      )}

      {/* Add button */}
      {canAdd && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn btn-primary btn-sm w-full mt-1"
          disabled={isPending}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Document
          {images.length > 0 && ` (${maxFiles - images.length} remaining)`}
        </button>
      )}

      {!canAdd && !isPending && (
        <p className="text-xs text-warning text-center mt-1">
          Maximum of {maxFiles} documents reached.
        </p>
      )}

      {/* Hidden file picker — no name; values go via hidden text inputs below */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleAdd}
        disabled={isPending}
      />

      {/*
       * One hidden input per successfully uploaded image, carrying its public_id.
       *
       * Usage in your server action:
       *   const publicIds = formData.getAll("documentPublicIds") as string[];
       *
       * Only images that finished uploading (publicId non-empty) are included,
       * so errored or still-uploading entries are automatically excluded.
       */}
      {images
        .filter((img) => img.publicId)
        .map((img) => (
          <input key={img.id} type="hidden" name={name} value={img.publicId} />
        ))}

      {/* Errors */}
      {errors?.map((error, i) => (
        <p key={i} className="text-error text-xs mt-1">{error}</p>
      ))}
    </div>
  );
}

// ─── Document Card ────────────────────────────────────────────────────────────

type DocumentCardProps = {
  img: A4Image;
  isEditing: boolean;
  isPending: boolean;
  onEdit: () => void;
  onRename: (label: string) => void;
  onRemove: () => void;
  onReplace: (file: File) => void;
};

function DocumentCard({ img, isEditing, isPending, onEdit, onRename, onRemove, onReplace }: DocumentCardProps) {
  const replaceRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(img.label);

  const handleReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onReplace(file);
    if (replaceRef.current) replaceRef.current.value = "";
  };

  const isDisabled = img.uploading || isPending;

  return (
    <div className={`card bg-base-200 shadow-sm border overflow-hidden transition-colors ${img.error ? "border-error" : "border-base-300"}`}>
      {/* A4 Preview */}
      <div
        className="relative w-full overflow-hidden bg-base-300"
        style={{ aspectRatio: "210 / 297" }}
      >
        <img
          src={img.preview}
          alt={img.label}
          className="w-full h-full object-cover"
        />

        {/* Uploading spinner overlay */}
        {img.uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="loading loading-spinner loading-md text-white" />
          </div>
        )}

        {/* Error overlay */}
        {img.error && !img.uploading && (
          <div className="absolute inset-0 bg-error/80 flex flex-col items-center justify-center gap-1 p-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-white text-xs text-center">{img.error}</p>
          </div>
        )}

        {/* Hover actions — only when idle and no error */}
        {!isDisabled && !img.error && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
            <button
              type="button"
              onClick={() => replaceRef.current?.click()}
              className="btn btn-xs btn-primary shadow"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Replace
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="btn btn-xs btn-error shadow"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Remove
            </button>
          </div>
        )}

        {/* Always-visible remove for errored entries */}
        {img.error && !img.uploading && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 btn btn-xs btn-error btn-circle shadow"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Label / Rename */}
      <div className="p-2">
        {isEditing ? (
          <div className="flex gap-1">
            <input
              type="text"
              className="input input-xs input-bordered flex-1 min-w-0"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onRename(draft);
                if (e.key === "Escape") onRename(img.label);
              }}
              autoFocus
            />
            <button type="button" className="btn btn-xs btn-success" onClick={() => onRename(draft)}>✓</button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-medium truncate">{img.label}</span>
            {!isDisabled && (
              <button
                type="button"
                onClick={onEdit}
                className="btn btn-ghost btn-xs text-base-content/40 hover:text-base-content shrink-0"
                title="Rename"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Per-card upload status */}
        <p className="text-xs mt-1">
          {img.uploading && <span className="text-base-content/40">Uploading…</span>}
          {!img.uploading && !img.error && img.publicId && <span className="text-success">✓ Uploaded</span>}
        </p>
      </div>

      {/* Hidden replace input */}
      <input
        ref={replaceRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReplace}
      />
    </div>
  );
}