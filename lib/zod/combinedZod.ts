import { AddressSchema } from "./addressZod";
import { contactSchema } from "./contact";
import { DeclarationSchema } from "./declaration";
import { educationStepSchema } from "./educationZod";
import { EmploymentSchema } from "./employmentZod";
import { FamilySchema } from "./familyZod";
import { ImageSchema } from "./imageZod";
import { PassportSchema } from "./passportZod";
import { PersonalSchema } from "./personalZod";
import { SkillLanguagesSchema } from "./skillLanguagesZod";

export const ApplicantSchema =
  PersonalSchema
    .merge(AddressSchema)
    .merge(contactSchema)
    .merge(FamilySchema)
    .merge(ImageSchema)
    .merge(EmploymentSchema)
    .merge(educationStepSchema)
    .merge(PassportSchema)
    .merge(SkillLanguagesSchema)
    .merge(DeclarationSchema);