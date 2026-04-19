'use server';

import * as nodemailer from 'nodemailer';

/**
 * Sends a base64 encoded .docx file as a Gmail attachment.
 * @param {string} base64Data - The base64 string (with or without Data URI prefix).
 * @param {string} filename - The name the file will have in the email (e.g., 'document.docx').
 */
export async function sendDocxWithGmail(base64Data:string, filename:string) {
    // 1. Create a transporter using Gmail SMTP
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD // Use App Password, not regular password
        }
    });

    // 2. Clean the base64 string if it contains a Data URI prefix (e.g., "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,")
    const cleanBase64 = base64Data.includes('base64,') 
        ? base64Data.split('base64,')[1] 
        : base64Data;

    // 3. Define email options
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_RECIPIENT,
        subject: 'BIODATA Application',
        text: 'Please find the attached document.',
        attachments: [
            {
                filename: filename,
                content: cleanBase64,
                encoding: 'base64',
                contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            }
        ]
    };

    // 4. Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}