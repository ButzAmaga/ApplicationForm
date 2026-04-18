import { useState, useRef } from "react";

type A4Image = {
  id: string;
  file: File;
  preview: string;
  label: string;
};

type MultiA4UploaderProps = {
  name: string;
  label?: string;
  required?: boolean;
  errors?: string[];
  maxFiles?: number;
  hint?: string;
};

export function MultiA4Uploader({
  name,
  label = "Documents",
  required = false,
  errors,
  maxFiles = 10,
  hint,
}: MultiA4UploaderProps) {
  const [images, setImages] = useState<A4Image[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const counter = useRef(0);

  const createEntry = (file: File, preview: string): A4Image => {
    counter.current += 1;
    return {
      id: `doc-${Date.now()}-${counter.current}`,
      file,
      preview,
      label: `Document ${counter.current}`,
    };
  };

  const readFile = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = (e) => res(e.target?.result as string);
      reader.onerror = () => rej();
      reader.readAsDataURL(file);
    });

  /* ─── Keep the real <input> FileList in sync with state ──────── */
  const syncInputFiles = (updatedImages: A4Image[]) => {
    if (!inputRef.current) return;
    const dt = new DataTransfer();
    updatedImages.forEach((img) => dt.items.add(img.file));
    inputRef.current.files = dt.files;
  };

  const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = maxFiles - images.length;
    const toProcess = files.slice(0, remaining);

    const newEntries = await Promise.all(
      toProcess.map(async (file) => {
        const preview = await readFile(file);
        return createEntry(file, preview);
      })
    );

    const updated = [...images, ...newEntries];
    setImages(updated);
    syncInputFiles(updated);
  };

  const handleRemove = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    setImages(updated);
    syncInputFiles(updated);
    if (editingId === id) setEditingId(null);
  };

  const handleRename = (id: string, label: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, label } : img))
    );
    setEditingId(null);
  };

  const handleReplace = async (id: string, file: File) => {
    const preview = await readFile(file);
    const updated = images.map((img) =>
      img.id === id ? { ...img, file, preview } : img
    );
    setImages(updated);
    syncInputFiles(updated);
  };

  const canAdd = images.length < maxFiles;

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

      {/* Grid of uploaded documents */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <DocumentCard
              key={img.id}
              img={img}
              isEditing={editingId === img.id}
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
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Document
          {images.length > 0 && ` (${maxFiles - images.length} remaining)`}
        </button>
      )}

      {!canAdd && (
        <p className="text-xs text-warning text-center mt-1">
          Maximum of {maxFiles} documents reached.
        </p>
      )}

      {/* Hidden multi-file input — stays in sync via DataTransfer */}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleAdd}
      />

      {/* Errors */}
      {errors?.map((error, i) => (
        <p key={i} className="text-error text-xs mt-1">{error}</p>
      ))}
    </div>
  );
}


/* ─── Document Card ─────────────────────────────────────────── */

type DocumentCardProps = {
  img: A4Image;
  isEditing: boolean;
  onEdit: () => void;
  onRename: (label: string) => void;
  onRemove: () => void;
  onReplace: (file: File) => void;
};

function DocumentCard({ img, isEditing, onEdit, onRename, onRemove, onReplace }: DocumentCardProps) {
  const replaceRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(img.label);

  const handleReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onReplace(file);
    if (replaceRef.current) replaceRef.current.value = "";
  };

  return (
    <div className="card bg-base-200 shadow-sm border border-base-300 overflow-hidden">
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

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors group flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
          <button
            type="button"
            onClick={() => replaceRef.current?.click()}
            className="btn btn-xs btn-primary shadow"
            title="Replace"
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
            title="Remove"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Remove
          </button>
        </div>
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
            <button
              type="button"
              className="btn btn-xs btn-success"
              onClick={() => onRename(draft)}
            >
              ✓
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-medium truncate">{img.label}</span>
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
          </div>
        )}
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