import { z } from "zod";

export const contactSchema = z.object({
  phone_num: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^09\d{9}$/,
      "Invalid Philippine phone number format"
    ),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  facebook: z
    .string()
    .or(z.literal("")),

  whatsapp: z
    .string()
    .regex(
      /^09\d{9}$/,
      "Invalid WhatsApp number format"
    )
    .or(z.literal("")),
});