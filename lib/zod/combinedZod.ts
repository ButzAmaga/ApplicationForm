import { AddressSchema } from "./addressZod";
import { contactSchema } from "./contact";
import { FamilySchema } from "./familyZod";
import { PersonalSchema } from "./personalZod";

export const ApplicantSchema =
  PersonalSchema
    .merge(AddressSchema)
    .merge(contactSchema)
    .merge(FamilySchema)