import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const FileValidator = z
  .instanceof(File, { message: "File is required" })
  .refine((file) => file.size > 0, "File is required")
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "File must be 5MB or less"
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only JPG, PNG, or WEBP files are allowed"
  );

export const ImageSchema = z.object({
  avatar: FileValidator,

});

