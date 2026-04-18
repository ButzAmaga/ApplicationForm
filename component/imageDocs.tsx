"use client";

import { ImageUploadA4 } from "./A4preview";
import { MultiA4Uploader } from "./MultipleA4Preview";



type Step10Props = {
  errors: {
    whole_body_picture?: string[] | undefined;
    passport?: string[] | undefined;
    certificate_of_employment?: string[] | undefined;
    additional_documents?: string[] | undefined;
  } | null;
  show: boolean;
  isPending:boolean
};

export function Step9Documents({ errors, show, isPending }: Step10Props) {
  return (
    <div className={`space-y-6 ${show ? "block" : "hidden"}`}>
      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">
        DOCUMENT UPLOADS
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <ImageUploadA4
          label="Whole Body Picture"
          name="whole_body_picture"
          required
          errors={errors?.whole_body_picture}
          hint="file size < 800kb"
          isPending={isPending}
        />

        <ImageUploadA4
          label="Passport"
          name="passport"
          required
          errors={errors?.passport}
          hint="file size < 800kb"
          isPending={isPending}
        />

        <ImageUploadA4
          label="Certificate of Employment"
          name="certificate_of_employment"
          required
          errors={errors?.certificate_of_employment}
          hint="file size < 800kb"
          isPending={isPending}
        />
      </div>


      <MultiA4Uploader
        name="additional_documents"
        label="Additional Documents"
        required
        errors={errors?.additional_documents}
        hint="file size < 800kb"
        isPending={isPending}
      />

      {/* Upload tips */}
      <div className="alert shadow-sm bg-base-200">
        <svg className="w-5 h-5 text-info shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm">
          <p className="font-medium">Document Upload</p>
          <p className="text-base-content/60">Please upload clear, legible scans or photos of your documents. Accepted formats: JPG, PNG, WEBP. Make sure the <b className="text-red-500">the size of documents is under A4 size to prevent overflow on documents. Make sure images are under 794x1123 pixels.</b>.</p>
        </div>
      </div>
    </div>
  );
}
