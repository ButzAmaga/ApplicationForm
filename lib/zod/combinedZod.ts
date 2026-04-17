import { AddressSchema } from "./addressZod";
import { PersonalSchema } from "./personalZod";

export const CombinedSchema = PersonalSchema.merge(AddressSchema);