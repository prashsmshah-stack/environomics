import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useEffect, useMemo, useState } from "react";
import { usePublicContent } from "../context/PublicContentContext";
import {
  normalizeDisplayLines,
  normalizeSingleLineText,
  singleLineClampStyle,
} from "../lib/contentLayout";
import {
  CATALOGUE_PDF_PATH,
  CONTACT_EMAILS_DISPLAY,
  CONTACT_PHONE,
  formatContactEmails,
  getPrimaryContactEmail,
  normalizeContactPhone,
  parseContactEmails,
} from "../lib/siteContent";

const serviceOptions = ["Solar Rooftop", "Ground Mount", "O&M", "HVAC", "Automation", "Energy Audit", "Other"];
const inquiryFieldDefinitions = [
  { key: "name", label: "Your Name (required)", placeholder: "e.g. John Doe", type: "text", required: true },
  {
    key: "company",
    label: "Company / Organisation (required)",
    placeholder: "e.g. Environomics Ind.",
    type: "text",
    required: true,
  },
  { key: "designation", label: "Designation", placeholder: "e.g. Plant Manager", type: "text" },
  {
    key: "email",
    label: "Email Address (required)",
    placeholder: "name@company.com",
    type: "email",
    required: true,
  },
  {
    key: "phone",
    label: "Phone / WhatsApp (required)",
    placeholder: CONTACT_PHONE,
    type: "tel",
    required: true,
  },
];

const initialInquiryForm = {
  name: "",
  company: "",
  designation: "",
  email: "",
  phone: "",
  service: serviceOptions[0],
  projectSize: "",
  location: "",
  requirement: "",
  source: "",
};

const fallbackContact = {
  phone: CONTACT_PHONE,
  email: CONTACT_EMAILS_DISPLAY,
  address: "417 Ratna High Street, Naranpura, Ahmedabad, 380013, Gujarat, India",
  linkedin: "https://www.linkedin.com/company/environomics-projects-llp/",
  socials: [
    {
      id: "social_linkedin",
      platform: "LinkedIn",
      handle: "@environomics-projects-llp",
      url: "https://www.linkedin.com/company/environomics-projects-llp/",
      logo: "",
    },
  ],
};

function buildRequirementSummary(form) {
  return [
    form.designation ? `Designation: ${form.designation}` : null,
    form.service ? `Service Required: ${form.service}` : null,
    form.projectSize ? `Project Size: ${form.projectSize}` : null,
    form.location ? `Facility Location: ${form.location}` : null,
    form.requirement ? `Brief Requirement: ${form.requirement}` : null,
    form.source ? `Lead Source: ${form.source}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function getPhoneDigits(value) {
  return String(value ?? "").replace(/\D+/g, "");
}

function getWhatsAppUrl(phone) {
  const digits = getPhoneDigits(phone);
  if (!digits) {
    return "/contact?focus=form";
  }

  return `https://wa.me/${digits.startsWith("91") ? digits : `91${digits}`}`;
}

function getMapUrl(address) {
  const cleanAddress = String(address ?? "").trim();
  return cleanAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanAddress)}`
    : "/contact?focus=form";
}

function getAddressLines(address) {
  return normalizeDisplayLines(address, {
    fallback: fallbackContact.address,
    maxLines: 4,
    maxLineLength: 34,
  });
}

function fallbackImage(label) {
  const safeLabel = label.replace(/&/g, "&amp;");
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 160">
      <rect width="480" height="160" rx="24" fill="#ffffff"/>
      <rect x="8" y="8" width="464" height="144" rx="18" fill="#0f1c2c"/>
      <text x="34" y="72" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="3">ENVIRONOMICS</text>
      <text x="34" y="112" fill="#93c5fd" font-family="Arial, sans-serif" font-size="14">${safeLabel}</text>
    </svg>
  `)}`;
}

function handleImageError(event, label) {
  const fallback = fallbackImage(label);
  if (event.currentTarget.src !== fallback) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallback;
  }
}

function Icon({ name, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`.trim()}>{name}</span>;
}

export default function ContactUsPage() {
  const { content } = usePublicContent();
  const [inquiryForm, setInquiryForm] = useState(initialInquiryForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const contact = useMemo(() => {
    const backendContact = content?.contact ?? {};

    return {
      ...fallbackContact,
      ...backendContact,
      phone: normalizeContactPhone(backendContact.phone, fallbackContact.phone),
      email: formatContactEmails(backendContact.email),
      address: String(backendContact.address ?? "").trim() || fallbackContact.address,
      linkedin: normalizeSingleLineText(
        backendContact.linkedin,
        fallbackContact.linkedin
      ),
      socials:
        Array.isArray(backendContact.socials)
          ? backendContact.socials
          : fallbackContact.socials,
    };
  }, [content]);
  const contactEmails = useMemo(() => parseContactEmails(contact.email), [contact.email]);
  const addressLines = useMemo(() => getAddressLines(contact.address), [contact.address]);
  const whatsappHref = useMemo(() => getWhatsAppUrl(contact.phone), [contact.phone]);
  const mapHref = useMemo(() => getMapUrl(contact.address), [contact.address]);
  const ctaCards = useMemo(
    () => [
      {
        eyebrow: "Assessment",
        title: "Request a Free Feasibility Assessment",
        action: "Get Started",
        color: "text-primary",
        href: "/contact?focus=form",
      },
      {
        eyebrow: "Resources",
        title: "Download Our Project Catalogue",
        action: "Download Now",
        color: "text-primary",
        href: CATALOGUE_PDF_PATH,
        external: true,
      },
      {
        eyebrow: "Success Stories",
        title: "View Our Project Portfolio",
        action: "Explore Gallery",
        color: "text-primary",
        href: "/projects",
      },
      {
        eyebrow: "Quick Chat",
        title: "Connect with Our Team on WhatsApp",
        action: "Open WhatsApp",
        color: "text-[#25D366]",
        extraClass: "cta-whatsapp",
        titleHoverColor: "group-hover:text-[#25D366]",
        href: whatsappHref,
        external: true,
      },
    ],
    [whatsappHref]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);

    if (params.get("focus") !== "form") {
      window.scrollTo(0, 0);
      return;
    }

    const scrollToForm = () => {
      const formSection = document.getElementById("contact-inquiry-form");
      formSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToForm);
    });
  }, []);

  useEffect(() => {
    if (!isSuccessPopupOpen || typeof window === "undefined") {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsSuccessPopupOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSuccessPopupOpen]);

  const updateInquiryField = (field, value) => {
    setInquiryForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleInquirySubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitError("");
    setIsSuccessPopupOpen(false);

    try {
      const recipient = getPrimaryContactEmail(contact.email);
      const subject = `Website inquiry from ${inquiryForm.company.trim() || inquiryForm.name.trim()}`;
      const body = [
        `Name: ${inquiryForm.name.trim()}`,
        `Company: ${inquiryForm.company.trim()}`,
        `Email: ${inquiryForm.email.trim()}`,
        `Phone: ${inquiryForm.phone.trim()}`,
        "",
        buildRequirementSummary(inquiryForm),
      ].join("\n");

      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setInquiryForm(initialInquiryForm);
      setSubmitMessage(
        "Your email app has been opened with the inquiry details. Please send the email to complete your request."
      );
      setIsSuccessPopupOpen(true);
    } catch (error) {
      setSubmitError(error.message || "We could not open your email app right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-on-surface selection:bg-primary/20">
      <SiteHeader />

      {isSuccessPopupOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-success-title"
          onClick={() => setIsSuccessPopupOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_32px_80px_rgba(15,23,42,0.25)] sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Icon name="check_circle" className="text-3xl" />
              </div>
              <button
                type="button"
                onClick={() => setIsSuccessPopupOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close success popup"
              >
                <Icon name="close" className="text-xl" />
              </button>
            </div>
            <h3 id="contact-success-title" className="mt-5 font-optika-bold text-2xl text-deep-navy">
              Inquiry Submitted
            </h3>
            <p className="mt-3 font-helixa-regular text-sm leading-relaxed text-slate-600">
              {submitMessage}
            </p>
            <button
              type="button"
              onClick={() => setIsSuccessPopupOpen(false)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      <main className="pt-20">
        <section className="hero-gradient relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32 md:py-48">
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <svg className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="relative z-10 mx-auto max-w-6xl text-center">
            <h1 className="stagger-item optika-bold mx-auto mb-8 max-w-5xl text-center text-4xl leading-[1.05] text-white sm:text-5xl md:mb-10 md:text-6xl lg:text-7xl" style={{ animationDelay: "0.1s" }}>
              Let&apos;s Engineer Your Energy Future Together
            </h1>
            <div className="stagger-item mx-auto max-w-3xl space-y-6" style={{ animationDelay: "0.2s" }}>
              <p className="font-helixa-regular text-base leading-relaxed text-white/90 md:text-lg">
                Whether you are evaluating solar for the first time, expanding an existing plant, or looking for a dependable O&amp;M partner, get in touch and we will take it from there.
              </p>
              <p className="font-helixa-regular text-base leading-relaxed text-white/70">
                We respond to every enquiry within 24 business hours with a real technical answer, and complex projects receive a preliminary assessment within 48 hours at no cost and with no obligation to proceed.
              </p>
            </div>
          </div>
        </section>

        <div className="relative z-20 mx-auto -mt-12 max-w-7xl px-4 sm:-mt-16 sm:px-6 md:-mt-20 lg:px-8">
          <div className="stagger-item grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4" style={{ animationDelay: "0.3s" }}>
            {ctaCards.map((card) => (
              <a key={card.title} href={card.href} target={card.external ? "_blank" : undefined} rel={card.external ? "noreferrer" : undefined} className={`cta-architectural glass-lift group flex flex-col justify-between rounded-xl bg-white p-6 sm:p-8 ${card.extraClass ?? ""}`}>
                <div>
                  <span className={`font-helixa-bold mb-4 block text-[10px] uppercase tracking-[0.2em] ${card.color}`}>{card.eyebrow}</span>
                  <h3 className={`font-optika-bold text-lg leading-snug text-deep-navy transition-colors ${card.titleHoverColor ?? "group-hover:text-primary"}`}>{card.title}</h3>
                </div>
                <div className={`font-helixa-bold mt-8 flex items-center text-sm ${card.color}`}>
                  {card.action}
                  <Icon name="arrow_forward" className="ml-2 text-sm transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3 lg:gap-16">
              <div id="contact-inquiry-form" className="stagger-item scroll-mt-28 rounded-2xl border border-outline-variant/30 bg-white p-6 shadow-sm sm:p-8 md:p-10 lg:col-span-2 lg:p-12" style={{ animationDelay: "0.4s" }}>
                <div className="mb-10">
                  <h2 className="font-optika-bold mb-2 text-3xl text-deep-navy">Inquiry Form</h2>
                  <p className="font-helixa-regular text-sm text-slate-500">Provide your technical requirements below for a detailed assessment.</p>
                </div>
                {submitError ? (
                  <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {submitError}
                  </div>
                ) : null}
                <form className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2" onSubmit={handleInquirySubmit}>
                  {inquiryFieldDefinitions.map((field) => (
                    <div key={field.key} className="flex flex-col gap-2">
                      <label className="font-helixa-bold text-[10px] uppercase tracking-widest text-slate-500">{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={inquiryForm[field.key]}
                        required={field.required}
                        onChange={(event) => updateInquiryField(field.key, event.target.value)}
                        className="form-input-animated font-helixa-regular w-full rounded bg-surface-container-low/50 px-4 py-3"
                      />
                    </div>
                  ))}
                  <div className="flex flex-col gap-2">
                    <label className="font-helixa-bold text-[10px] uppercase tracking-widest text-slate-500">Service Required</label>
                    <select
                      value={inquiryForm.service}
                      onChange={(event) => updateInquiryField("service", event.target.value)}
                      className="form-input-animated custom-select font-helixa-regular w-full cursor-pointer rounded bg-surface-container-low/50 px-4 py-3"
                    >
                      {serviceOptions.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-helixa-bold text-[10px] uppercase tracking-widest text-slate-500">Project Size (kWp or kW)</label>
                    <input
                      type="text"
                      placeholder="e.g. 500kWp"
                      value={inquiryForm.projectSize}
                      onChange={(event) => updateInquiryField("projectSize", event.target.value)}
                      className="form-input-animated font-helixa-regular w-full rounded bg-surface-container-low/50 px-4 py-3"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-helixa-bold text-[10px] uppercase tracking-widest text-slate-500">Facility Location</label>
                    <input
                      type="text"
                      placeholder="City, State"
                      value={inquiryForm.location}
                      onChange={(event) => updateInquiryField("location", event.target.value)}
                      className="form-input-animated font-helixa-regular w-full rounded bg-surface-container-low/50 px-4 py-3"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="font-helixa-bold text-[10px] uppercase tracking-widest text-slate-500">Brief Requirement</label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Describe your project goals..."
                      value={inquiryForm.requirement}
                      onChange={(event) => updateInquiryField("requirement", event.target.value)}
                      className="form-input-animated font-helixa-regular w-full rounded bg-surface-container-low/50 px-4 py-3"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="font-helixa-bold text-[10px] uppercase tracking-widest text-slate-500">How did you find us?</label>
                    <input
                      type="text"
                      placeholder="Search, Social Media, Referral..."
                      value={inquiryForm.source}
                      onChange={(event) => updateInquiryField("source", event.target.value)}
                      className="form-input-animated font-helixa-regular w-full rounded bg-surface-container-low/50 px-4 py-3"
                    />
                  </div>
                  <div className="pt-6 md:col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group font-helixa-bold flex w-full items-center justify-center gap-2 rounded bg-primary px-10 py-4 text-white shadow-lg shadow-primary/10 transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Submitting Inquiry..." : "Submit Technical Inquiry"}
                      <Icon name="arrow_forward" className="text-sm transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-6">
                <div className="contact-card-click rounded-2xl border-2 border-primary/20 bg-white p-6 shadow-md transition-all hover:border-primary/40 sm:p-8">
                  <div className="mb-6 flex items-start justify-between">
                    <span className="font-helixa-bold rounded bg-primary px-3 py-1 text-[9px] uppercase tracking-widest text-white">Corporate Headquarters</span>
                    <Icon name="corporate_fare" className="text-3xl text-primary" />
                  </div>
                  <h3 className="font-optika-bold mb-5 text-2xl text-deep-navy">Registered Office</h3>
                  <div className="mb-6 flex items-start gap-4">
                    <Icon name="location_on" className="mt-1 text-primary" />
                    <div className="font-helixa-regular min-h-[6.5rem] text-sm leading-relaxed text-slate-600">
                      <p className="font-helixa-bold mb-1 text-deep-navy">Environomics Projects LLP</p>
                      {addressLines.length ? (
                        addressLines.map((line) => (
                          <div key={line}>{line}</div>
                        ))
                      ) : (
                        <div>{fallbackContact.address}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-t border-outline-variant/20 pt-6">
                    <Icon name="schedule" className="text-slate-400" />
                    <p className="font-helixa-regular text-xs text-slate-500">Mon to Sat: 9:00 AM to 6:30 PM IST</p>
                  </div>
                </div>

                <div className="contact-card-click group relative overflow-hidden rounded-2xl border-none bg-primary p-6 text-white sm:p-8">
                  <div className="relative z-10">
                    <h3 className="font-optika-bold mb-3 text-xl">Visit Our Facilities</h3>
                    <p className="font-helixa-regular mb-8 text-sm text-white/90">View our engineering studio and live project monitoring centers.</p>
                    <a href={mapHref} target="_blank" rel="noreferrer" className="group/btn font-helixa-bold inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm text-primary shadow-xl shadow-black/10 transition-all hover:bg-white/90">
                      <Icon name="map" className="text-base" />
                      Open Google Maps
                      <Icon name="arrow_forward" className="text-xs transition-transform group-hover/btn:translate-x-1" />
                    </a>
                  </div>
                  <div className="pointer-events-none absolute -bottom-6 -right-6 opacity-10 transition-all duration-700 group-hover:scale-110 group-hover:opacity-20">
                    <Icon name="explore" className="text-[140px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="architectural-inquiry-box relative overflow-hidden rounded-2xl p-8 text-on-background sm:p-10 md:p-14 lg:p-16" style={{ borderLeftColor: '#2AAF6F' }}>
              <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-full w-32 bg-gradient-to-r from-primary/5 to-transparent" />
              <div className="relative z-10">
                <h2 className="font-optika-bold mb-6 text-3xl tracking-tight text-growth-green sm:text-4xl md:text-5xl">Urgent Inquiries?</h2>
                <p className="font-helixa-regular mb-10 max-w-2xl text-base text-growth-green sm:mb-12 sm:text-lg">For immediate assistance regarding project maintenance or emergency audits, connect with our 24/7 industrial support team.</p>
                <div className="grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
                  {[
                    { icon: "call", label: "Industrial Hotline (24/7)", values: [contact.phone] },
                    { icon: "inbox", label: "Project Support", values: contactEmails },
                  ].map((item) => (
                    <div key={item.label} className="group flex cursor-pointer items-center gap-6">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-outline-variant/30 bg-green-50 shadow-sm transition-all duration-300 group-hover:border-primary group-hover:bg-growth-green/90">
                        <Icon name={item.icon} className="text-2xl text-[#2AAF6F] transition-colors group-hover:text-white" />
                      </div>
                      <div>
                        <p className="font-helixa-bold mb-1 text-[10px] uppercase tracking-[0.2em]">{item.label}</p>
                        {item.values.map((value) => (
                          <p
                            key={value}
                            className="font-helixa-bold text-xl tracking-tight text-growth-green sm:text-2xl md:text-3xl"
                            style={singleLineClampStyle}
                            title={value}
                          >
                            {value}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      </div>
  );
}
