import { z } from "zod";

const proficiencyOptions = ["Fluent", "Ordinary", "Difference"] ;

export const SkillLanguagesSchema = z.object({
  skill: z
    .string()
    .max(50, "Special Skill/Training must be 50 characters or less")
    .optional()
    .or(z.literal("")),

  english_speak: z.enum(proficiencyOptions, {error:"Required"}),

  english_write: z.enum(proficiencyOptions, {error:"Required"}),

  chinese_speak: z.enum(proficiencyOptions).nullish(),
    

  chinese_write: z.enum(proficiencyOptions).nullish(),


  other_speak: z.enum(proficiencyOptions).nullish(),


  other_write: z.enum(proficiencyOptions).nullish(),

});

