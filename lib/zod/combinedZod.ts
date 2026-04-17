import { AddressSchema } from "./addressZod";
import { contactSchema } from "./contact";
import { PersonalSchema } from "./personalZod";

export const ApplicantSchema =
  PersonalSchema
    .merge(AddressSchema)
    .merge(contactSchema);