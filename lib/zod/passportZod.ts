import { z } from "zod";

export const PassportSchema = z
  .object({
    passport_no: z
      .string()
      .trim()
      .min(1, "Passport number is required")
      .max(20, "Passport number must be 20 characters or less"),

    passport_valid_from: z
      .string()
      .min(1, "Passport valid from date is required"),

    passport_valid_to: z
      .string()
      .min(1, "Passport valid to date is required"),
  })
  .refine(
    (data) =>
      new Date(data.passport_valid_to) >= new Date(data.passport_valid_from),
    {
      message: "Valid To date must be later than or equal to Valid From date",
      path: ["passport_valid_to"],
    }
  );

