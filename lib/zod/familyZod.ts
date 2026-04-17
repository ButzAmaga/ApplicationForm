import { z } from "zod";

const FamilyMemberSchema = z.object({
  id: z.number(),

  name: z.string().min(1, "Name is required"),

  relationship: z.string().min(1, "Relationship is required"),

  living_together: z.enum(["yes", "no"])

});

export const FamilySchema = z.object({
  family_members: z.array(FamilyMemberSchema)
});