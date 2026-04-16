import { Packer, Document, Paragraph, Table, TableRow, TableCell, ImageRun, WidthType, BorderStyle } from "docx";

export async function POST(req) {

    // 1. Fetch the image
    const response = await fetch('https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/15788040/20150428-cloud-computing.0.1489222360.jpg?quality=90&strip=all&crop=12.5,0,75,100');
    const arrayBuffer = await response.arrayBuffer();

        // 2. Convert ArrayBuffer to Buffer (for Node.js/Next.js backend)
    // Or use new Uint8Array(arrayBuffer) if you are in a pure browser environment
    const imageBuffer = Buffer.from(arrayBuffer); 

    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({ text: "Document with Tables & Images", heading: "Heading1" }),

                // 2. MIMIC FLEX/GRID: Use a table with no borders for side-by-side layout
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
                        insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph("This acts like a Left Column (Flex Item 1)")],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new ImageRun({
                                                    data: imageBuffer,
                                                    transformation: { width: 200, height: 200 },
                                                    type: "png", 
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),

                // 3. ACTUAL TABLE: With visible borders
                new Paragraph({ text: "Data Table", spacing: { before: 400 } }),
                new Table({
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph("Header 1")] }),
                                new TableCell({ children: [new Paragraph("Header 2")] }),
                            ],
                        }),
                    ],
                }),

                // 4. BULLETS
                new Paragraph({ text: "Bullet Point 1", bullet: { level: 0 } }),
                new Paragraph({ text: "Bullet Point 2", bullet: { level: 0 } }),
            ],
        }],
    });

    // 5. Export and send as response
    const buffer = await Packer.toBuffer(doc);
    return new Response(buffer, {
        headers: {
            "Content-Disposition": "attachment; filename=report.docx",
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
    });
}
