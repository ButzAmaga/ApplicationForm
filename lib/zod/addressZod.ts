import { z } from "zod";

export const AddressSchema = z.object({
  permanent_address: z.string().min(2, "Min 2 chars"),
  present_address: z.string().min(2, "Min 2 chars"),
});