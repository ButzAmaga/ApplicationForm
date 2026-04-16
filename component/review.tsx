"use client";


interface Step5Props {
  data: Partial<FormData>;
  onEdit: (step: number) => void;
}

function ReviewSection({ title, icon, onEdit, step, children }: {
  title: string; icon: string; onEdit: (s: number) => void; step: number; children: React.ReactNode;
}) {
  return (
    <div className="card bg-base-200 shadow-sm border border-base-300">
      <div className="card-body p-4 gap-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <span>{icon}</span> {title}
          </h4>
          <button
            type="button"
            onClick={() => onEdit(step)}
            className="btn btn-ghost btn-xs text-primary"
          >
            ✏️ Edit
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <span className="text-base-content/50 text-xs block">{label}</span>
      <span className="font-medium break-words">{value || <span className="text-base-content/30 italic">—</span>}</span>
    </div>
  );
}

export function Step5Review({ data, onEdit }: Step5Props) {
  return (
    <div className="space-y-4">
      <div className="alert alert-info shadow-sm">
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm">Please review your information before submitting.</span>
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl border border-base-300">
        <div className="avatar">
          <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1 overflow-hidden bg-base-300 flex items-center justify-center">
            {data.avatar ? (
              <img src={data.avatar} alt="avatar" className="object-cover w-full h-full" />
            ) : <span className="text-2xl">🧑</span>}
          </div>
        </div>
        <div>
          <p className="font-bold text-lg">{data.name || "—"}</p>
          <p className="text-sm text-base-content/60">{data.position} • {data.agency}</p>
        </div>
      </div>

      <ReviewSection title="Personal Information" icon="👤" onEdit={onEdit} step={1}>
        <Row label="Religion"       value={data.religion} />
        <Row label="Sex"            value={data.sex} />
        <Row label="Civil Status"   value={data.civil_status} />
        <Row label="Age"            value={data.age} />
        <Row label="Date of Birth"  value={data.date_birth} />
        <Row label="Place of Birth" value={data.place_birth} />
        <Row label="Height"         value={data.height ? `${data.height} cm` : ""} />
        <Row label="Weight"         value={data.weight ? `${data.weight} kg` : ""} />
        <Row label="Constellation"  value={data.constellation} />
        <div className="col-span-2">
          <Row label="Employment Record" value={data.employment_record} />
        </div>
      </ReviewSection>

      <ReviewSection title="Address" icon="🏠" onEdit={onEdit} step={2}>
        <div className="col-span-2">
          <Row label="Present Address"   value={data.present_address} />
        </div>
        <div className="col-span-2">
          <Row label="Permanent Address" value={data.same_as_present ? "(Same as present)" : data.permanent_address} />
        </div>
      </ReviewSection>

      <ReviewSection title="Contact Information" icon="📞" onEdit={onEdit} step={3}>
        <Row label="Phone Number" value={data.phone_num} />
        <Row label="Email"        value={data.email} />
        <Row label="Facebook"     value={data.facebook} />
        <Row label="WhatsApp"     value={data.whatsapp} />
      </ReviewSection>

      {/* Family Members */}
      <div className="card bg-base-200 shadow-sm border border-base-300">
        <div className="card-body p-4 gap-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              👨‍👩‍👧 Family Members
              <span className="badge badge-sm">{data.family_members?.length ?? 0}</span>
            </h4>
            <button type="button" onClick={() => onEdit(4)} className="btn btn-ghost btn-xs text-primary">
              ✏️ Edit
            </button>
          </div>
          {!data.family_members?.length ? (
            <p className="text-sm text-base-content/40 italic">No family members added.</p>
          ) : (
            <div className="space-y-2">
              {data.family_members.map((m, i) => (
                <div key={m.id} className="flex items-center gap-3 bg-base-100 rounded-lg px-3 py-2 text-sm">
                  <span className="badge badge-primary badge-outline badge-xs">#{i + 1}</span>
                  <span className="font-medium">{m.name}</span>
                  <span className="text-base-content/50">• {m.relationship}</span>
                  {m.phone && <span className="text-base-content/50">• {m.phone}</span>}
                  {m.liveTogether && (
                    <span className="badge badge-success badge-xs ml-auto">Lives Together</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}