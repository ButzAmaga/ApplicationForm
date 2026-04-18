import { z } from "zod";

const A4_WIDTH = 210;
const A4_HEIGHT = 297;
const A4_RATIO = A4_WIDTH / A4_HEIGHT;
const RATIO_TOLERANCE = 0.02;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/* ─── Helpers ───────────────────────────────────────────────── */

const isA4Ratio = (width: number, height: number): boolean => {
  const ratio = width / height;
  return Math.abs(ratio - A4_RATIO) <= RATIO_TOLERANCE;
};

const getImageDimensions = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
};

/* ─── Single A4 File Schema ─────────────────────────────────── */

const singleA4ImageSchema = (options?: { required?: boolean }) =>
  z
    .instanceof(File, { message: "Please upload a file." })
    .refine(
      (file) => ACCEPTED_TYPES.includes(file.type),
      "Only JPG, PNG, and WEBP files are accepted."
    )
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must not exceed 5MB."
    )

    /*
    .superRefine(async (file, ctx) => {
      try {
        const { width, height } = await getImageDimensions(file);
        if (!isA4Ratio(width, height)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Image ratio must match A4 (210×297). Uploaded image is ${width}×${height}.`,
          });
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Could not read image dimensions.",
        });
      }
    });

/* ─── Optional vs Required wrappers ────────────────────────── */

const requiredA4 = singleA4ImageSchema({ required: true });

const optionalA4 = z.union([
  z.instanceof(File).superRefine(async (file, ctx) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only JPG, PNG, and WEBP files are accepted.",
      });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File size must not exceed 5MB.",
      });
      return;
    }
    try {
      const { width, height } = await getImageDimensions(file);
      if (!isA4Ratio(width, height)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Image ratio must match A4 (210×297). Uploaded image is ${width}×${height}.`,
        });
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Could not read image dimensions.",
      });
    }
  }),
  z.undefined(),
  z.null(),
]);

/* ─── Multi A4 File Schema ──────────────────────────────────── */

const multiA4ImageSchema = z
  .array(z.instanceof(File, { message: "Each entry must be a file." }))
  .min(1, "Please upload at least one additional document.")
  .max(10, "You may upload a maximum of 10 additional documents.")
  .superRefine(async (files, ctx) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      /*
      if (!ACCEPTED_TYPES.includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Document ${i + 1}: Only JPG, PNG, and WEBP files are accepted.`,
          path: [i],
        });
        continue;
      } */

      if (file.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Document ${i + 1}: File size must not exceed 5MB.`,
          path: [i],
        });
        continue;
      }

      /*
      try {
        const { width, height } = await getImageDimensions(file);
        if (!isA4Ratio(width, height)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Document ${i + 1}: Image ratio must match A4 (210×297). Uploaded image is ${width}×${height}.`,
            path: [i],
          });
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Document ${i + 1}: Could not read image dimensions.`,
          path: [i],
        });
      }
      */
    }
  });

/* ─── Step 9 Documents Schema ───────────────────────────────── */

export const DocumentsSchema = z.object({
  whole_body_picture: requiredA4,
  passport: requiredA4,
  certificate_of_employment: requiredA4,
  additional_documents: multiA4ImageSchema,
});

