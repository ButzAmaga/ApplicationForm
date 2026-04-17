import { z } from "zod";

// ─── Single job description entry ───────────────────────────────────────────

const jobDescriptionSchema = z
  .string({ error: "Job description is required" })
  .min(1, "Job description cannot be empty")
  .max(500, "Job description must be 500 characters or less");

// ─── Single employment record ────────────────────────────────────────────────

const employmentRecordSchema = z
  .object({
    from: z
      .string({ error: "Start date is required" }).min(1, "Start date cannot be empty"),

    to: z
      .string({ error: "End date is required" }).min(1, "End date cannot be empty"),

    position: z
      .string({ error: "Position is required" })
      .min(1, "Position cannot be empty")
      .max(100, "Position must be 100 characters or less"),

    name_address: z
      .string({ error: "Name and address is required" })
      .min(1, "Name and address cannot be empty")
      .max(255, "Name and address must be 255 characters or less"),

    reason_for_leaving: z
      .string({ error: "Reason for leaving is required" })
      .min(1, "Reason for leaving cannot be empty")
      .max(255, "Reason for leaving must be 255 characters or less"),

    job_descriptions: z
      .array(jobDescriptionSchema)
      .min(1, "At least one job description is required"),
  })


// ─── Full step schema ────────────────────────────────────────────────────────

export const EmploymentSchema = z.object({
  employment_records: z
    .array(employmentRecordSchema)
    .min(1, "At least one employment record is required"),
});

