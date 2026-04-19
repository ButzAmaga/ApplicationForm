"use client";

import { useRef, useState } from "react";

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
    delete_token: string; // short-lived token for unsigned deletion
}

interface AvatarUploadProps {
    name: string;           // name of the hidden input (read by the server action)
    errors?: string[];
    isPending: boolean;
    defaultPublicId?: string; // optional: pre-fill when editing
    defaultPreviewUrl?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Upload a file directly to Cloudinary using an unsigned preset. */
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

/**
 * Delete an image from Cloudinary using the short-lived delete_token that is
 * returned at upload time. This works without exposing the API secret.
 * Note: tokens expire after ~10 minutes, so this is best-effort cleanup.
 */
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

export function AvatarUpload({
    name,
    errors,
    isPending,
    defaultPublicId = "",
    defaultPreviewUrl = "",
}: AvatarUploadProps) {
    const fileRef = useRef<HTMLInputElement | null>(null);

    // Local preview URL (object URL or Cloudinary URL)
    const [preview, setPreview] = useState<string | null>(defaultPreviewUrl || null);

    // The public_id written to the hidden input — read by the server action
    const [publicId, setPublicId] = useState<string>(defaultPublicId);

    // Short-lived delete token for the *currently uploaded* image so we can
    // clean it up if the user swaps or removes it.
    const deleteTokenRef = useRef<string | null>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // ── Handle file selection ────────────────────────────────────────────────
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError(null);

        // If there is already an uploaded image, delete it first
        if (deleteTokenRef.current) {
            await deleteByToken(deleteTokenRef.current);
            deleteTokenRef.current = null;
        }

        // Optimistic local preview
        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);
        setPublicId(""); // clear until upload succeeds

        try {
            setIsUploading(true);
            const data = await uploadToCloudinary(file);

            // Revoke the temporary blob URL now that we have the real one
            URL.revokeObjectURL(localUrl);

            setPreview(data.secure_url);
            setPublicId(data.public_id);
            deleteTokenRef.current = data.delete_token;
        } catch (err) {
            URL.revokeObjectURL(localUrl);
            setPreview(null);
            setUploadError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setIsUploading(false);
            // Reset the file input so the same file can be re-selected
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    // ── Remove / clear ───────────────────────────────────────────────────────
    const handleRemove = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (deleteTokenRef.current) {
            await deleteByToken(deleteTokenRef.current);
            deleteTokenRef.current = null;
        }

        setPreview(null);
        setPublicId("");
        setUploadError(null);
        if (fileRef.current) fileRef.current.value = "";
    };

    // ── Derived state ────────────────────────────────────────────────────────
    const isDisabled = isUploading || isPending;

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Avatar ring */}
            <div
                className={`avatar cursor-pointer group ${isDisabled ? "pointer-events-none opacity-60" : ""}`}
                onClick={() => !isDisabled && fileRef.current?.click()}
            >
                <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-200 flex items-center justify-center relative">
                    {preview ? (
                        <img
                            src={preview}
                            alt="avatar preview"
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <span className="text-4xl">🧑</span>
                    )}

                    {/* Hover overlay */}
                    {!isUploading && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs rounded-full select-none">
                            {preview ? "Change" : "Upload"}
                        </div>
                    )}

                    {/* Upload spinner overlay */}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                            <span className="loading loading-spinner loading-sm text-white" />
                        </div>
                    )}
                </div>
            </div>

            <p className="text-xs text-gray-500">2x2 Head to Neck White Background Picture</p>

            {/* Hidden file input */}
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isDisabled}
            />

            {/*
             * Hidden text input — carries the Cloudinary public_id to the
             * Next.js server action via FormData.
             *
             * Usage in your server action:
             *   const publicId = formData.get("avatarPublicId") as string;
             */}
            <input
                type="hidden"
                name={name}
                value={publicId}
            />

            {/* Action buttons */}
            <div className="flex gap-2">
                <button
                    type="button"
                    className="btn btn-outline btn-primary btn-xs"
                    onClick={() => fileRef.current?.click()}
                    disabled={isDisabled}
                >
                    {isUploading
                        ? "Uploading…"
                        : preview
                        ? "Change Photo"
                        : "Upload Photo"}
                </button>

                {preview && !isUploading && (
                    <button
                        type="button"
                        className="btn btn-outline btn-error btn-xs"
                        onClick={handleRemove}
                        disabled={isDisabled}
                    >
                        Remove
                    </button>
                )}
            </div>

            {/* Upload error */}
            {uploadError && (
                <p className="text-error text-xs">{uploadError}</p>
            )}

            {/* Validation errors from the server action */}
            {errors?.map((error, index) => (
                <p key={index} className="text-error text-xs">{error}</p>
            ))}
        </div>
    );
}


