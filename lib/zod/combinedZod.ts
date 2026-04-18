import { AddressSchema } from "./addressZod";
import { contactSchema } from "./contact";
import { educationStepSchema } from "./educationZod";
import { EmploymentSchema } from "./employmentZod";
import { FamilySchema } from "./familyZod";
import { ImageSchema } from "./imageZod";
import { PersonalSchema } from "./personalZod";

export const ApplicantSchema =
  PersonalSchema
    .merge(AddressSchema)
    .merge(contactSchema)
    .merge(FamilySchema)
    .merge(ImageSchema)
    .merge(EmploymentSchema)
    .merge(educationStepSchema)