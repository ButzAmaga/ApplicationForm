import { z } from "zod";

const SexEnum = z.enum(["male", "female"], { error: "Invalid sex" });
const CivilStatusEnum = z.enum(["single", "married", "divorce"], { error: "Invalid civil status" });
const ConstellationEnum = z.enum([
  "aries","taurus","gemini","cancer",
  "leo","virgo","libra","scorpio",
  "sagittarius","capricorn","aquarius","pisces"
], { error: "Invalid constellation" });

export const PersonalSchema = z.object({
  full_name: z.string().min(2, "Min 2 chars"),
  position: z.string().min(2, "Min 2 chars"),
  religion: z.string().min(2, "Min 2 chars"),
  agency: z.string().min(2, "Min 2 chars"),

  age: z.coerce.number().int().min(0, "Invalid age").max(120, "Invalid age"),

  date_of_birth: z.coerce.date().max(new Date(), "Past date only"),

  place_of_birth: z.string().min(2, "Required"),

  height: z.coerce.number().positive("Must be > 0"),
  weight: z.coerce.number().positive("Must be > 0"),

  constellation: ConstellationEnum,
  sex: SexEnum,
  civil_status: CivilStatusEnum,

  employment_record: z.string().min(5, "Min 5 chars"),

  
});

