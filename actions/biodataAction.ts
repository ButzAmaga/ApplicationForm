'use server'

import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import ImageModule from 'docxtemplater-image-module-free'

import { formatDate } from '@/lib/date';
import { ApplicantSchema } from '@/lib/zod/combinedZod';
import { extractEducationRecords, extractEmploymentRecords, extractFamilyMembers } from '@/lib/extractorFields';
import { success } from 'zod';
import sizeOf from 'image-size'


type ImagesFormData = {
    avatarBase64: string
    whole_body_picture_base64: string;
    passport_base64: string;
    certificate_of_employment_base64: string;
    additional_documents_base64: string[]
}

type PersonalFormData = {
    full_name: string;
    position: string;
    religion: string;
    agency: string;
    age: number;
    date_of_birth: string; // or Date if you parse it
    place_of_birth: string;
    height: number;
    weight: number;
    constellation: string;
    sex: string;
    civil_status: string;
    employment_record: string;
    avatar: File
};

type AddressFormData = {
    permanent_address: string
    present_address: string
}

type ContactFormData = {
    facebook: string
    email: string;
    phone_num: string;
    whatsapp: string;
}

type FamilyMemberFormData = {
    familyMembers?: {
        name: string;
        relationship: string;
        living_together: boolean;
    }[]
}

type EmploymentFormData = {
    employmentRecords: {
        from: string;
        to: string;
        position: string;
        reason_for_leaving: string;
        job_descriptions: string[];
        name_address: string

    }[]
}

type EducationRecord = {
    level: string;
    school: string;
    from: string;
    to: string;
    major_course?: string;
};

type EducationFormData = {
    educational_attainment: string;
    education_records?: EducationRecord[]; // optional
};

type PassportFormData = {
    passport_no: string;
    passport_valid_from: string;
    passport_valid_to: string;
};

type SkillLanguagesFormData = {
    skill?: string;

    english_speak: string;
    english_write: string;

    chinese_speak?: string | null;
    chinese_write?: string | null;

    other_speak?: string | null;
    other_write?: string | null;
};

type DeclarationFormData = {
    criminal_record: string;
    education_certification: string;
    proof_of_work_experience: string;
    date_of_application: string;
};

type DocumentsFormData = {

};

type combinedType = PersonalFormData & AddressFormData & ContactFormData & FamilyMemberFormData & ImagesFormData & EmploymentFormData & EducationFormData & PassportFormData & SkillLanguagesFormData & DeclarationFormData & DocumentsFormData & {

}

export async function generateWithForm(data: combinedType) {
    const templatePath = path.resolve(process.cwd(), 'public/template/biodata_template.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    const imageOptions = {
        centered: false,
        getImage(tagValue: string) {
            const base64Data = tagValue.split(',')[1] || tagValue;
            return Buffer.from(base64Data, 'base64');
        },
        // Use _ to tell TS "I know this is here, but I'm not using it"
        getSize(img:any, _tagValue: string, tagName: string, context?: any) {
            // 1. Handle the small 2x2 photo
            if (tagName === "avatar" || tagName === "pic2x2") {
                return [210, 210]; // 2x2 inches = 192px at 96 DPI
            }

            // 2. Use the image's intrinsic size for everything else
            const dimensions = sizeOf(img);
            if(dimensions) {
                // Return the original dimensions [width, height]
                return [dimensions.width, dimensions.height];
            }

            // 3. Fallback if metadata is missing (Standard A4 @ 96DPI)
            return [794, 1123];
        },
        getProps(_img: unknown, _tagValue: string, tagName: string) {
            if (tagName === "pic2x2") {
                return { wrap: "inline" as const };
            }

            return {
                wrap: "square" as const, // // Pushes text so they don't overlap
                offsetRelativeFrom: ["page", "page"] as [string, string],
                offset: { x: 0, y: 0 }
            };
        }
    };


    const doc = new Docxtemplater(zip, {
        modules: [new ImageModule(imageOptions)],
        paragraphLoop: true,
        linebreaks: true,
    });


    const civil_status_list = ['single 未婚', 'married 已婚', 'divorce 离异'].map(status => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        symbol: status.includes(data.civil_status) ? '■' : '□'
    }));

    console.log("Additional Images:", data.additional_documents_base64);

    doc.render({
        // Personal info
        name: data.full_name,
        position: data.position,
        religion: data.religion,
        agency: data.agency,
        age: data.age,
        date_birth: data.date_of_birth,
        place_birth: data.place_of_birth,
        height: data.height,
        weight: data.weight,
        constellation: data.constellation,


        // Address
        permanent_address: data.permanent_address,
        present_address: data.present_address,


        // Contact Info
        facebook: data.facebook,
        whatsapp: data.whatsapp,
        phone_num: data.phone_num,
        email: data.email,

        // Avatar
        avatar: data.avatarBase64,
        whole_body_picture_base64: data.whole_body_picture_base64,
        passport_base64: data.passport_base64,
        certificate_of_employment_base64: data.certificate_of_employment_base64,
        additional_documents_base64: data.additional_documents_base64,

        // Family members (table)
        members: data.familyMembers?.map((m) => ({
            ...m,

            isYes: m.living_together,
            isNo: !m.living_together,
        })) || [],

        // job experience
        experience: data.employmentRecords,

        // education
        education_attainment: data.educational_attainment,
        education_records: data.education_records || [],

        // Sex checkbox helpers (FIXED: use `sex`, not `gender`)
        isMale: data.sex === "male",
        isFemale: data.sex === "female",

        // Raw civil status (if needed)
        civil_status: civil_status_list,

        // Employment record
        employment_record: data.employment_record,

        // Passport
        passport_no: data.passport_no,
        passport_valid_from: data.passport_valid_from,
        passport_valid_to: data.passport_valid_to,

        // Skill Languages
        // Language proficiency helpers
        skill: data.skill,

        // English proficiency flags
        is_english_fluent: data.english_speak === "Fluent",
        is_english_ordinary: data.english_speak === "Ordinary",
        is_english_difference: data.english_speak === "Difference",

        is_english_write_fluent: data.english_write === "Fluent",
        is_english_write_ordinary: data.english_write === "Ordinary",
        is_english_write_difference: data.english_write === "Difference",

        // Chinese proficiency flags
        is_chinese_fluent: data.chinese_speak === "Fluent",
        is_chinese_ordinary: data.chinese_speak === "Ordinary",
        is_chinese_difference: data.chinese_speak === "Difference",

        is_chinese_write_fluent: data.chinese_write === "Fluent",
        is_chinese_write_ordinary: data.chinese_write === "Ordinary",
        is_chinese_write_difference: data.chinese_write === "Difference",

        // Other language proficiency flags
        is_other_fluent: data.other_speak === "Fluent",
        is_other_ordinary: data.other_speak === "Ordinary",
        is_other_difference: data.other_speak === "Difference",

        is_other_write_fluent: data.other_write === "Fluent",
        is_other_write_ordinary: data.other_write === "Ordinary",
        is_other_write_difference: data.other_write === "Difference",

        // declaration
        has_criminal_record: data.criminal_record === "yes",
        has_education_certification: data.education_certification === "yes",
        has_proof_of_work_experience: data.proof_of_work_experience === "yes",
        date_of_application: data.date_of_application,

        name_and_sig: data.full_name.toUpperCase()
    });

    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    return buf.toString('base64');
}


function extractFormData(formData: FormData) {


    const personalData = {
        full_name: formData.get("full_name"),
        position: formData.get("position"),
        religion: formData.get("religion"),
        agency: formData.get("agency"),
        age: formData.get("age"),
        date_of_birth: formData.get("date_of_birth"),
        place_of_birth: formData.get("place_of_birth"),
        height: formData.get("height"),
        weight: formData.get("weight"),
        constellation: formData.get("constellation"),
        sex: formData.get("sex"),
        civil_status: formData.get("civil_status"),
        employment_record: formData.get("employment_record"),
        avatar: formData.get("avatar")
    };

    const address = {
        permanent_address: formData.get("permanent_address"),
        present_address: formData.get("present_address"),
    }

    const contact = {
        facebook: formData.get("facebook"),
        email: formData.get("email"),
        phone_num: formData.get("phone_num"),
        whatsapp: formData.get("whatsapp"),
    }

    const imageDocs = {
        whole_body_picture: formData.get("whole_body_picture") as File | null,
        passport: formData.get("passport") as File | null,
        certificate_of_employment: formData.get("certificate_of_employment") as File | null,
        additional_documents: formData.getAll("additional_documents") as File[],
    };

    let family = extractFamilyMembers(formData);
    let employment = extractEmploymentRecords(formData)
    let education_records = extractEducationRecords(formData)

    const passport = {
        passport_no: formData.get("passport_no"),
        passport_valid_from: formData.get("passport_valid_from"),
        passport_valid_to: formData.get("passport_valid_to"),
    };

    const skillLanguages = {
        skill: formData.get("skill"),

        english_speak: formData.get("english_speak"),
        english_write: formData.get("english_write"),

        chinese_speak: formData.get("chinese_speak"),
        chinese_write: formData.get("chinese_write"),

        other_speak: formData.get("other_speak"),
        other_write: formData.get("other_write"),
    }

    const declaration = {
        criminal_record: formData.get("criminal_record"),
        education_certification: formData.get("education_certification"),
        proof_of_work_experience: formData.get("proof_of_work_experience"),
        date_of_application: formData.get("date_of_application"),
    };
    return {
        ...personalData,
        ...address,
        ...contact,
        family_members: family,
        employment_records: employment,
        // education fields
        educational_attainment: formData.get("educational_attainment"),
        education_records,
        ...passport,
        ...skillLanguages,
        ...declaration,
        ...imageDocs
    }
}

export async function saveDocumentAction(prev: any, formData: FormData) {

    const rawData = extractFormData(formData)


    console.log("raw", rawData)

    const parsed = await ApplicantSchema.safeParseAsync(rawData);

    console.log("parsed", parsed)


    let errorList: string[] = []
    if (!parsed.success)
        errorList = Object.keys(parsed.error?.flatten().fieldErrors)

    // console.log("Flatten errors:", parsed.error?.flatten().fieldErrors)
    /*return {
        success:false,
        message: `Error on ${errorList}`,
        errors: parsed.error?.flatten().fieldErrors
    }*/



    if (parsed.success) {

        const additional_documents_base64 = await Promise.all(parsed.data.additional_documents.map(
            async (file) => Buffer.from(await file.arrayBuffer()).toString('base64')
        ))
        parsed.data.additional_documents.map(item => console.log(item))
        

        const docBuffer = await generateWithForm({
            ...parsed.data,
            date_of_birth: formatDate(parsed.data.date_of_birth),
            permanent_address: parsed.data.permanent_address == "on" ? "same as the present address" : parsed.data.permanent_address,
            familyMembers: parsed.data.family_members?.map(m => ({
                ...m,
                living_together: m.living_together == "yes" ? true : false
            })) || [],
            avatarBase64: Buffer.from(await parsed.data.avatar.arrayBuffer()).toString('base64'),
            employmentRecords: parsed.data.employment_records?.map((record) => ({
                ...record,
            })) || [],

            // Step 9 Documents
            whole_body_picture_base64: Buffer.from(await parsed.data.whole_body_picture.arrayBuffer()).toString('base64'),
            passport_base64: Buffer.from(await parsed.data.passport.arrayBuffer()).toString('base64'),
            certificate_of_employment_base64: Buffer.from(await parsed.data.certificate_of_employment.arrayBuffer()).toString('base64'),
            additional_documents_base64: additional_documents_base64
        });

        // Save the document or do something with it
        return {
            success: true,
            message: "Created Biodata",
            file: docBuffer,
            filename: "application.docx",
        };
    }

    return {
        success: false,
        message: `Required information is missing from the form. Please check the fields ${errorList.join(", ")} and try again. Please resubmit all images again since it is already removed upon submission.`,
        errors: parsed.error.flatten().fieldErrors
    }
}
