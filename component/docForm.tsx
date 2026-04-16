'use client'

import { generateDocumentAction,generateWithForm } from '@/actions/biodataAction';
import { useState } from 'react';


export default function DocForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const file = formData.get('avatar') as File;

    try {
      // 1. Convert File to Base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const avatarBase64 = await base64Promise;

      // 2. Call Server Action
      const resultBase64 = await generateWithForm({ name, avatarBase64, familyMembers: [
        {
          name: "John Doe",
          relationship: "Brother",
          phone: "123-456-7890",
          liveTogether: true
        },
        {
          name: "John May",
          relationship: "Sister",
          phone: "123-456-7899",
          liveTogether: false
        }
      ],
      gender: "female",
      civil_status: "divorce"
    });

      // 3. Download Result
      const blob = new Blob(
        [Uint8Array.from(atob(resultBase64), c => c.charCodeAt(0))], 
        { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}_Profile.docx`;
      a.click();
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm p-6 border rounded-lg shadow-sm">
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input name="name" required className="w-full border p-2 rounded" placeholder="Enter name..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Avatar Image</label>
        <input name="avatar" type="file" accept="image/*" required className="w-full text-sm" />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-black text-white p-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Generate DOCX"}
      </button>
    </form>
  );
}
