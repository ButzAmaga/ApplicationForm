import { z } from "zod";

// ─── Single education record ─────────────────────────────────────────────────

const educationRecordSchema = z.object({
    level: z
        .string({ error: "Level is required" })
        .min(1, "Level cannot be empty")
        .max(100, "Level must be 100 characters or less"),

    school: z
        .string({ error: "School is required" })
        .min(1, "School cannot be empty")
        .max(255, "School must be 255 characters or less"),

    from: z
        .string({ error: "From is required" })
        .min(1, "From cannot be empty")
        .max(50, "From must be 50 characters or less"),

    to: z
        .string({ error: "To is required" })
        .min(1, "To cannot be empty")
        .max(50, "To must be 50 characters or less"),

    major_course: z
        .string()
        .max(255, "Major / Course must be 255 characters or less")
        .optional(),
});

// ─── Full step schema ────────────────────────────────────────────────────────

export const educationStepSchema = z.object({
    educational_attainment: z
        .string({ error: "Educational attainment is required" })
        .min(1, "Please select an educational attainment"),

    education_records: z
        .array(educationRecordSchema)
        .optional(),
});

export type EducationStepInput = z.infer<typeof educationStepSchema>;
export type EducationRecord = z.infer<typeof educationRecordSchema>;