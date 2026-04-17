'use server'

import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import ImageModule from 'docxtemplater-image-module-free'

import { formatDate } from '@/lib/date';
import { ApplicantSchema } from '@/lib/zod/combinedZod';
import { extractEmploymentRecords, extractFamilyMembers } from '@/lib/extractorFields';


type ImagesFormData= {
    avatarBase64:string
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
    avatar:File
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
    familyMembers: {
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
        name_address:string
        
    }[]
}

type combinedType = PersonalFormData & AddressFormData & ContactFormData & FamilyMemberFormData & ImagesFormData & EmploymentFormData & {
    //avatarBase64: string;
    /*familyMembers: Array<{
        name: string;
        relationship: string;
        phone: string;
        liveTogether: boolean;
    }>,*/
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
        getSize() { return [250, 250]; }
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

        // Family members (table)
        members: data.familyMembers?.map((m) => ({
            ...m,
            
            isYes: m.living_together,
            isNo: !m.living_together,
        })),

        // job experience
        experience: data.employmentRecords,

        // Sex checkbox helpers (FIXED: use `sex`, not `gender`)
        isMale: data.sex === "male",
        isFemale: data.sex === "female",

        // Raw civil status (if needed)
        civil_status: civil_status_list,

        // Employment record
        employment_record: data.employment_record,
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

    let family = extractFamilyMembers(formData);
    let employment = extractEmploymentRecords(formData)

    console.log("Employment", employment)

    return {
        ...personalData,
        ...address,
        ...contact,
        family_members: family,
        employment_records: employment
    }
}

export async function saveDocumentAction(prev: any, formData: FormData) {

    const rawData = extractFormData(formData)

    
    console.log("raw", rawData)

    const parsed = ApplicantSchema.safeParse(rawData);
    console.log("parsed", parsed)


    let errorList:string[] = []
    if(!parsed.success)
        errorList = Object.keys(parsed.error?.flatten().fieldErrors)


    if (parsed.success) {
        const docBuffer = await generateWithForm({
            ...parsed.data,
            date_of_birth: formatDate(parsed.data.date_of_birth),
            permanent_address: parsed.data.permanent_address == "on" ? "same as the present address" : parsed.data.present_address,
            familyMembers: parsed.data.family_members.map(m => ({
                ...m,
                living_together: m.living_together == "yes" ? true : false
            })),
            avatarBase64: Buffer.from(await parsed.data.avatar.arrayBuffer()).toString('base64'),
            employmentRecords: parsed.data.employment_records.map((record) => ({
                ...record,
            })),
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
        message: `Required information is missing from the form. Please check the fields ${errorList.join(", ")}`,
        errors: parsed.error.flatten().fieldErrors
    }
}
