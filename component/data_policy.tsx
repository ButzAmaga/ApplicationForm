"use client";

type DataPolicyProps = {
  show: boolean;
  companyName?: string;
  retentionPeriod?: string;
  dpoEmail?: string;
};

export function DataPolicy({
  show,
  companyName = "[Your Company Name]",
  retentionPeriod = "6 months",
  dpoEmail = "[Insert Email Address]",
}: DataPolicyProps) {
  return (
    <div className={`space-y-6 ${show ? "block" : "hidden"}`}>
      <div className="divider text-xs font-semibold tracking-widest text-base-content/50">
        PRIVACY POLICY & CONSENT
      </div>

      {/* Policy Card */}
      <div className="card bg-base-200 shadow-sm border border-base-300">
        <div className="card-body gap-6 p-6">

          {/* Header */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="text-lg font-bold">Privacy Policy for Job Applicants</h2>
            </div>
            <p className="text-xs text-base-content/50 ml-7">
              Effective Date: April 19, 2026 &nbsp;·&nbsp; Compliant with Philippine DPA &amp; GDPR
            </p>
          </div>

          {/* Intro */}
          <p className="text-sm text-base-content/70 leading-relaxed">
            We value your privacy and are committed to protecting
            your personal information. This policy explains how we collect, use, and safeguard
            the biodata you provide during your application process.
          </p>

          {/* Scrollable policy body */}
          <div className="overflow-y-auto max-h-96 pr-1 space-y-5 text-sm text-base-content/80 leading-relaxed scrollbar-thin">

            {/* Section 1 */}
            <section className="space-y-2">
              <h3 className="font-semibold text-base-content flex items-center gap-2">
                <span className="badge badge-primary badge-sm text-primary-content">1</span>
                Information We Collect
              </h3>
              <p>We collect personal information <em>("Biodata")</em> that you voluntarily provide through our application forms, including:</p>
              <ul className="space-y-1 ml-4">
                {[
                  { label: "Identity Details", desc: "" },
                  { label: "Contact Information", desc: "" },
                  { label: "Background Data", desc: "" },
                  { label: "Sensitive Data", desc: "" },
                ].map((item) => (
                  <li key={item.label} className="flex gap-2">
                    <span className="text-primary mt-1 shrink-0">•</span>
                    <span><span className="font-medium text-base-content">{item.label}</span> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="divider my-0" />

            {/* Section 2 */}
            <section className="space-y-2 mt-4">
              <h3 className="font-semibold text-base-content flex items-center gap-2">
                <span className="badge badge-primary badge-sm text-primary-content">2</span>
                Purpose of Collection
              </h3>
              <p>Your information is collected and processed for the sole purpose of evaluating your suitability for the position applied for. This includes:</p>
              <ul className="space-y-1 ml-4">
                {[
                  "Assessing your skills and qualifications.",
                  "Verifying the accuracy of your details and conducting reference checks.",
                  "Communicating with you regarding the recruitment process.",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-primary mt-1 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="divider my-0" />

            {/* Section 3 */}
            <section className="space-y-2 mt-4">
              <h3 className="font-semibold text-base-content flex items-center gap-2">
                <span className="badge badge-primary badge-sm text-primary-content">3</span>
                Data Retention and Security
              </h3>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-primary mt-1 shrink-0">•</span>
                  <span>
                    <span className="font-medium text-base-content">Retention:</span> We only keep your biodata for as long as necessary to fulfill the recruitment process.
                    If you are not hired, your data will be securely disposed of within{" "}
                    <span className="font-semibold text-base-content">{retentionPeriod}</span> unless you consent to us keeping it for future openings.
                  </span>
                </li>
              </ul>
            </section>

            <div className="divider my-0" />

            {/* Section 4 */}
            <section className="space-y-2 mt-4">
              <h3 className="font-semibold text-base-content flex items-center gap-2">
                <span className="badge badge-primary badge-sm text-primary-content">4</span>
                Disclosure to Third Parties
              </h3>
              <p>
                We do not sell or share your personal data with third parties for marketing purposes.
                Data may only be shared with authorized <span className="font-medium text-base-content">"Employer Representatives"</span> (such as
                background check agencies) solely to verify your application details.
              </p>
            </section>

            <div className="divider my-0" />

            {/* Section 5 */}
            <section className="space-y-2 mt-4">
              <h3 className="font-semibold text-base-content flex items-center gap-2">
                <span className="badge badge-primary badge-sm text-primary-content">5</span>
                Your Rights
              </h3>
              <p>Under data privacy laws, you have the right to:</p>
              <ul className="space-y-1 ml-4">
                {[
                  "Access and request a copy of the data we hold about you.",
                  "Rectify any inaccurate or incomplete information.",
                  "Object to the processing of your data or withdraw consent at any time.",
                  "Request erasure of your data if it is no longer needed for the application.",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-primary mt-1 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="divider my-0" />

            {/* Section 6 */}
            <section className="space-y-2 mt-4">
              <h3 className="font-semibold text-base-content flex items-center gap-2">
                <span className="badge badge-primary badge-sm text-primary-content">6</span>
                Contact Us
              </h3>
              <p>
                For any questions or to exercise your privacy rights, please contact our Data Protection Officer at{" "}
                <a href={`mailto:${dpoEmail}`} className="link link-primary font-medium">{dpoEmail}</a>.
              </p>
            </section>
          </div>

          {/* Consent Declaration */}
          <div className="alert bg-primary/10 border border-primary/30 shadow-none">
            <svg className="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-base-content/80">
              <span className="font-semibold text-base-content">Consent Declaration —</span>{" "}
              By submitting your application, you acknowledge that you have read this Privacy Policy
              and consent to the collection and processing of your biodata for application purposes only.
            </p>
          </div>

        </div>
      </div>

      {/* DPA Badge */}
      <div className="flex flex-wrap gap-2 justify-center">
        {["Philippine DPA Compliant", "GDPR Aligned", "Restricted Access"].map((badge) => (
          <span key={badge} className="badge badge-outline badge-sm gap-1 text-base-content/50">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}