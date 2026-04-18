import { z } from "zod";

const FamilyMemberSchema = z.object({
    id: z.number(),

    name: z.string().min(1, "Name is required"),

    relationship: z.string().min(1, "Relationship is required"),

    living_together: z.enum(["yes", "no"]),

    phone: z
        .string()
        .min(1, "Phone number is required")
        .regex(
            /^09\d{9}$/,
            "Invalid Philippine phone number format"
        ),

});

export const FamilySchema = z.object({
    family_members: z.array(FamilyMemberSchema).optional()
});