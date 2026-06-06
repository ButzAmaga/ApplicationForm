import { z } from "zod";

const YES_NO = ["yes", "no"] as const;
const BIO_DATA_TYPE = [
    "ZhouQuan",
    "ShangHai"
] as const;

export const DeclarationSchema = z.object({
  criminal_record: z
    .enum(YES_NO, { message: "Please select Yes or No" }),

  education_certification: z
    .enum(YES_NO, { message: "Please select Yes or No" }),

  proof_of_work_experience: z
    .enum(YES_NO, { message: "Please select Yes or No" }),

  date_of_application: z
    .coerce.date()
    .min(1, "Date of application is required"),

  biodata_type: z
    .enum(BIO_DATA_TYPE, { message: "Please select a correct biodata type" })

});