import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

const sections = [
  {
    title: "Information We Collect",
    body:
      "When you use the Environomics website, we may collect the information you submit through contact and inquiry forms, including your name, company, email address, phone number, project requirements, and any related details you choose to share.",
  },
  {
    title: "How We Use Information",
    body:
      "We use submitted information to respond to project inquiries, prepare technical discussions, improve our services, manage business communication, and follow up on lead requests made through the website.",
  },
  {
    title: "Data Sharing",
    body:
      "We do not sell personal information. Submitted information may only be shared internally with relevant Environomics team members or trusted service providers involved in website hosting, infrastructure support, or project communication, only where required for normal business operations.",
  },
  {
    title: "Data Security",
    body:
      "We take reasonable administrative and technical measures to protect website data from unauthorized access, misuse, or disclosure. No online system can guarantee absolute security, but we actively work to keep the website and backend access controlled and maintained.",
  },
  {
    title: "External Links",
    body:
      "This website may include links to external platforms such as LinkedIn, Google Maps, or other third-party resources. Their privacy practices are governed by their own policies, and Environomics is not responsible for the content or handling practices of third-party sites.",
  },
  {
    title: "Contact",
    body:
      "For privacy-related questions or data requests, please contact Environomics Projects LLP through the contact page or by email at info@environomics.in.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white text-on-surface selection:bg-primary/20">
      <SiteHeader />

      <main className="pt-20">
        <section className="bg-surface-container-low px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10">
              <p className="helixa-bold text-[11px] uppercase tracking-[0.2em] text-primary">
                Legal
              </p>
              <h1 className="optika-bold mt-4 text-4xl leading-[1.05] text-deep-navy sm:text-5xl md:text-6xl">
                Privacy Policy
              </h1>
              <p className="helixa-regular mt-5 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
                This policy explains how Environomics Projects LLP handles information submitted
                through the website. Last updated on April 1, 2026.
              </p>
            </div>

            <div className="space-y-6">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-8"
                >
                  <h2 className="optika-bold text-2xl text-deep-navy sm:text-3xl">
                    {section.title}
                  </h2>
                  <p className="helixa-regular mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
