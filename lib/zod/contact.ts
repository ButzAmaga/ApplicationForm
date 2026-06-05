import { z } from "zod";

// Allows standard local 09xx numbers OR international configurations
export const globalPhoneRegex = /^(?:09\d{9}|(?:\+|00)?[1-9]\d{0,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})$/;

// Allows the local/international numbers above OR clickable WhatsApp link formats
const whatsappRegex = /^(?:(?:https?:\/\/)?(?:www\.)?(?:wa\.me\/|api\.whatsapp\.com\/send\?phone=)\d+|(?:09\d{9}|(?:\+|00)?[1-9]\d{0,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}))$/;


export const contactSchema = z.object({
  phone_num: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(
      globalPhoneRegex,
      "Invalid phone number format"
    ),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),

  facebook: z
    .string()
    .trim()
    .min(1, "Facebook profile  username is required"),

  whatsapp: z
    .string()
    .trim()
    .min(1, "WhatsApp information is required")
    .regex(
      whatsappRegex,
      "Invalid WhatsApp format (Must be a valid number)"
    ),
});
