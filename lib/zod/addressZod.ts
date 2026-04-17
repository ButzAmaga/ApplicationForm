import { z } from "zod";

export const AddressSchema = z.object({
  permanent_address: z.string().min(3, "Min 3 chars"),
  present_address: z.string().min(3, "Min 3 chars"),
});