import { z } from "zod";

const proficiencyOptions = ["fluent", "ordinary", "difference", ""] as const;

export const SkillLanguagesSchema = z.object({
  skill: z
    .string()
    .max(50, "Special Skill/Training must be 50 characters or less")
    .optional()
    .or(z.literal("")),

  english_speak: z.enum(proficiencyOptions),

  english_write: z.enum(proficiencyOptions),

  chinese_speak: z.enum(proficiencyOptions)
    .optional()
    .default(""),

  chinese_write: z.enum(proficiencyOptions)
    .optional()
    .default(""),

  other_speak: z.enum(proficiencyOptions)
    .optional()
    .default(""),

  other_write: z.enum(proficiencyOptions)
    .optional()
    .default("")
});

export type Step8SkillLanguagesFormData = z.infer<
  typeof Step8SkillLanguagesSchema
>;