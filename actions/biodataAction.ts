'use server'

import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import ImageModule from 'docxtemplater-image-module-free'

export async function generateDocumentAction(data: { name: string; avatarPath: string }) {
    // 1. Load the docx template from the public folder
    const templatePath = path.resolve(process.cwd(), 'public/template/biodata_template.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    // 2. Configure the Image Module
    const imageOptions = {
        centered: false,
        getImage(tagValue: string) {
            // tagValue is the path passed in your data object
            return fs.readFileSync(path.resolve(process.cwd(), tagValue));
        },
        getSize() {
            // Defines [width, height] in pixels. You can use 'image-size' for dynamic sizing.
            return [250, 250];
        }
    };

    const doc = new Docxtemplater(zip, {
        modules: [new ImageModule(imageOptions)],
        paragraphLoop: true,
        linebreaks: true,
    });

    // 3. Render data (use {%avatar} in your Word template for images)
    doc.render({
        name: data.name,
        avatar: data.avatarPath
    });

    // 4. Generate buffer and convert to Base64 for the client
    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    return buf.toString('base64');
}


export async function generateWithForm(data: {
    name: string;
    avatarBase64: string;
    familyMembers: Array<{
        name: string;
        relationship: string;
        phone: string;
        liveTogether: boolean;
    }>,
    gender: "male" | "female"
    civil_status: "single" | "married" | "divorce"
}) {
    const templatePath = path.resolve(process.cwd(), 'public/template/biodata_template.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    const imageOptions = {
        centered: false,
        getImage(tagValue: string) {
            const base64Data = tagValue.split(',')[1] || tagValue;
            return Buffer.from(base64Data, 'base64');
        },
        getSize() { return [150, 150]; }
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
        name: data.name,
        avatar: data.avatarBase64,
        // Add the array for the table
        members: data.familyMembers.map(m => ({
            ...m,
            // Boolean helpers for the YES/NO checkboxes
            isYes: m.liveTogether,
            isNo: !m.liveTogether
        })),
        isMale: data.gender === "male",
        isFemale: data.gender === "female",
        civil_status: civil_status_list
    });

    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    return buf.toString('base64');
}

