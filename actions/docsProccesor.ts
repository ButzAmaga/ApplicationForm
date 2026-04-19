// app/actions/doc-processor.ts
"use server";
import cloudinary from "@/lib/cloudinary";

export async function getImageBufferBase64(publicId: string) {
  try {
    // 1. Generate the URL (no network request made yet)
    const url = cloudinary.url(publicId, {
      secure: true,
      // You can add transformations here to ensure the image fits your docx
      width: 500, 
      crop: "scale"
    });

    // 2. Fetch the actual image data
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    
    // 3. Return as a Buffer for docxtemplater base 64
    return Buffer.from(arrayBuffer).toString("base64");
  } catch (error) {
    console.error("Failed to fetch image buffer:", error);
    return null;
  }
}
