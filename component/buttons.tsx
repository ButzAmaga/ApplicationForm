'use client';

import { generateDocumentAction } from '@/actions/biodataAction';
import { useState } from 'react';


export default function DownloadButton() {
  const [isPending, setIsPending] = useState(false);

  const handleDownload = async () => {
    setIsPending(true);
    try {
      // 1. Call Server Action
      const base64 = await generateDocumentAction({
        name: "John Doe",
        avatarPath: "public/avatar.png"
      });

      // 2. Convert Base64 to Blob
      const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const blob = new Blob([bytes], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });

      // 3. Create Link and Trigger Download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "document.docx";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button 
      onClick={handleDownload} 
      disabled={isPending}
      className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
    >
      {isPending ? "Generating..." : "Download DOCX"}
    </button>
  );
}
