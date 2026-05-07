import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useEffect, useMemo, useState } from "react";
import {
  normalizeDisplayLines,
  normalizeSingleLineText,
  singleLineClampStyle,
} from "../lib/contentLayout";
import { fetchStrapiJson, resolveStrapiMediaUrl } from "../lib/strapiApi";
import {
  CATALOGUE_PDF_PATH,
  CONTACT_EMAILS_DISPLAY,
  CONTACT_PHONE,
  formatContactEmails,
  normalizeContactPhone,
  parseContactEmails,
} from "../lib/siteContent";

const fallbackServiceOptions = ["Solar Rooftop", "Ground Mount", "O&M", "HVAC", "Automation", "Energy Audit", "Other"];
const fallbackInquiryFieldDefinitions = [
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
  service: fallbackServiceOptions[0],
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

const fallbackContactPage = {
  isFallback: true,
  heroTitle: "Let's Engineer Your Energy Future Together",
  heroIntro:
    "Whether you are evaluating solar for the first time, expanding an existing plant, or looking for a dependable O&M partner, get in touch and we will take it from there.",
  heroNote:
    "We respond to every enquiry within 24 business hours with a real technical answer, and complex projects receive a preliminary assessment within 48 hours at no cost and with no obligation to proceed.",
  ctaCards: [
    {
      id: "assessment",
      eyebrow: "Assessment",
      title: "Request a Free Feasibility Assessment",
      action: "Get Started",
      color: "text-primary",
      href: "/contact?focus=form",
      external: false,
    },
    {
      id: "resources",
      eyebrow: "Resources",
      title: "Download Our Project Catalogue",
      action: "Download Now",
      color: "text-primary",
      href: CATALOGUE_PDF_PATH,
      external: true,
    },
    {
      id: "portfolio",
      eyebrow: "Success Stories",
      title: "View Our Project Portfolio",
      action: "Explore Gallery",
      color: "text-primary",
      href: "/projects",
      external: false,
    },
    {
      id: "quick-chat",
      eyebrow: "Quick Chat",
      title: "Connect with Our Team on WhatsApp",
      action: "Open WhatsApp",
      color: "text-[#25D366]",
      extraClass: "cta-whatsapp",
      titleHoverColor: "group-hover:text-[#25D366]",
      href: "whatsapp",
      external: true,
    },
  ],
  formHeading: "Inquiry Form",
  formDescription: "Provide your technical requirements below for a detailed assessment.",
  formFields: fallbackInquiryFieldDefinitions,
  serviceOptions: fallbackServiceOptions,
  serviceFieldLabel: "Service Required",
  projectSizeLabel: "Project Size (kWp or kW)",
  projectSizePlaceholder: "e.g. 500kWp",
  locationLabel: "Facility Location",
  locationPlaceholder: "City, State",
  requirementLabel: "Brief Requirement",
  requirementPlaceholder: "Describe your project goals...",
  sourceLabel: "How did you find us?",
  sourcePlaceholder: "Search, Social Media, Referral...",
  submitButtonLabel: "Submit Technical Inquiry",
  submittingButtonLabel: "Submitting Inquiry...",
  successTitle: "Inquiry Submitted",
  successMessage:
    "Your inquiry has been saved. Our team will review the details and get back to you shortly.",
  closeButtonLabel: "Close",
  ...fallbackContact,
  socialLinks: fallbackContact.socials,
  officeBadge: "Corporate Headquarters",
  officeIcon: "corporate_fare",
  officeTitle: "Registered Office",
  companyName: "Environomics Projects LLP",
  businessHoursLabel: "Business Hours",
  businessHoursText: "Mon to Sat: 9:00 AM to 6:30 PM IST",
  mapsTitle: "Visit Our Facilities",
  mapsDescription: "View our engineering studio and live project monitoring centers.",
  mapsButtonLabel: "Open Google Maps",
  mapsIcon: "map",
  mapsDecorativeIcon: "explore",
  urgentTitle: "Urgent Inquiries?",
  urgentDescription:
    "For immediate assistance regarding project maintenance or emergency audits, connect with our 24/7 industrial support team.",
  hotlineLabel: "Industrial Hotline (24/7)",
  supportLabel: "Project Support",
};

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

function getAddressLines(address, fallback = fallbackContact.address) {
  return normalizeDisplayLines(address, {
    fallback,
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

function normalizeSocialLink(social, index) {
  return {
    id: social?.id ?? social?.url ?? `social-${index + 1}`,
    platform: normalizeSingleLineText(social?.platform, "Social"),
    handle: normalizeSingleLineText(social?.handle),
    url: normalizeSingleLineText(social?.url),
    logoUrl: resolveStrapiMediaUrl(social?.logo?.url || social?.logo),
  };
}

function normalizeContactPage(payload) {
  const data = payload?.data;

  if (!data) {
    return fallbackContactPage;
  }

  const serviceOptions = Array.isArray(data.serviceOptions)
    ? data.serviceOptions.map((item) => normalizeSingleLineText(item)).filter(Boolean)
    : [];
  const formFields = Array.isArray(data.formFields)
    ? data.formFields
        .map((field, index) => ({
          key: normalizeSingleLineText(field?.key, `field-${index + 1}`),
          label: normalizeSingleLineText(field?.label),
          placeholder: normalizeSingleLineText(field?.placeholder),
          type: normalizeSingleLineText(field?.type, "text"),
          required: Boolean(field?.required),
        }))
        .filter((field) => field.key && field.label)
    : [];
  const ctaCards = Array.isArray(data.ctaCards)
    ? data.ctaCards
        .map((card, index) => ({
          id: card?.id ?? `cta-${index + 1}`,
          eyebrow: normalizeSingleLineText(card?.eyebrow),
          title: normalizeSingleLineText(card?.title),
          action: normalizeSingleLineText(card?.action),
          href: normalizeSingleLineText(card?.href, "#"),
          external: Boolean(card?.external),
          color: normalizeSingleLineText(card?.color, "text-primary"),
          extraClass: normalizeSingleLineText(card?.extraClass),
          titleHoverColor: normalizeSingleLineText(card?.titleHoverColor),
        }))
        .filter((card) => card.title)
    : [];
  const socialLinks = Array.isArray(data.socialLinks)
    ? data.socialLinks.map(normalizeSocialLink).filter((social) => social.url)
    : [];

  return {
    ...fallbackContactPage,
    ...data,
    isFallback: false,
    heroTitle: normalizeSingleLineText(data.heroTitle),
    heroIntro: String(data.heroIntro ?? "").trim(),
    heroNote: String(data.heroNote ?? "").trim(),
    ctaCards: Array.isArray(data.ctaCards) ? ctaCards : [],
    formHeading: normalizeSingleLineText(data.formHeading),
    formDescription: String(data.formDescription ?? "").trim(),
    formFields: Array.isArray(data.formFields) ? formFields : [],
    serviceOptions: Array.isArray(data.serviceOptions) ? serviceOptions : [],
    serviceFieldLabel: normalizeSingleLineText(data.serviceFieldLabel),
    projectSizeLabel: normalizeSingleLineText(data.projectSizeLabel),
    projectSizePlaceholder: normalizeSingleLineText(data.projectSizePlaceholder),
    locationLabel: normalizeSingleLineText(data.locationLabel),
    locationPlaceholder: normalizeSingleLineText(data.locationPlaceholder),
    requirementLabel: normalizeSingleLineText(data.requirementLabel),
    requirementPlaceholder: String(data.requirementPlaceholder ?? "").trim(),
    sourceLabel: normalizeSingleLineText(data.sourceLabel),
    sourcePlaceholder: normalizeSingleLineText(data.sourcePlaceholder),
    submitButtonLabel: normalizeSingleLineText(data.submitButtonLabel),
    submittingButtonLabel: normalizeSingleLineText(data.submittingButtonLabel),
    successTitle: normalizeSingleLineText(data.successTitle),
    successMessage: String(data.successMessage ?? "").trim(),
    closeButtonLabel: normalizeSingleLineText(data.closeButtonLabel),
    phone: normalizeContactPhone(data.phone, ""),
    email: parseContactEmails(data.email, []).join(", "),
    address: String(data.address ?? "").trim(),
    linkedin: normalizeSingleLineText(data.linkedin),
    socialLinks: Array.isArray(data.socialLinks) ? socialLinks : [],
    officeBadge: normalizeSingleLineText(data.officeBadge),
    officeIcon: normalizeSingleLineText(data.officeIcon),
    officeTitle: normalizeSingleLineText(data.officeTitle),
    companyName: normalizeSingleLineText(data.companyName),
    businessHoursLabel: normalizeSingleLineText(data.businessHoursLabel),
    businessHoursText: normalizeSingleLineText(data.businessHoursText),
    mapsTitle: normalizeSingleLineText(data.mapsTitle),
    mapsDescription: String(data.mapsDescription ?? "").trim(),
    mapsButtonLabel: normalizeSingleLineText(data.mapsButtonLabel),
    mapsIcon: normalizeSingleLineText(data.mapsIcon),
    mapsDecorativeIcon: normalizeSingleLineText(data.mapsDecorativeIcon),
    urgentTitle: normalizeSingleLineText(data.urgentTitle),
    urgentDescription: String(data.urgentDescription ?? "").trim(),
    hotlineLabel: normalizeSingleLineText(data.hotlineLabel),
    supportLabel: normalizeSingleLineText(data.supportLabel),
  };
}

function resolveContactHref(href, { whatsappHref }) {
  const value = normalizeSingleLineText(href, "#");

  if (/^whatsapp$/i.test(value)) {
    return whatsappHref;
  }

  if (/^catalogue$/i.test(value)) {
    return CATALOGUE_PDF_PATH;
  }

  return value;
}

export default function ContactUsPage() {
  const [contactPage, setContactPage] = useState(fallbackContactPage);
  const [inquiryForm, setInquiryForm] = useState(initialInquiryForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadContactPage() {
      try {
        const payload = await fetchStrapiJson("/api/public/contact-page");

        if (isMounted) {
          setContactPage(normalizeContactPage(payload));
        }
      } catch {
        if (isMounted) {
          setContactPage(fallbackContactPage);
        }
      }
    }

    loadContactPage();

    return () => {
      isMounted = false;
    };
  }, []);

  const contact = useMemo(() => {
    return {
      ...fallbackContact,
      phone: contactPage.phone || (contactPage.isFallback ? fallbackContact.phone : ""),
      email: contactPage.email || (contactPage.isFallback ? formatContactEmails(fallbackContact.email) : ""),
      address: String(contactPage.address ?? "").trim() || (contactPage.isFallback ? fallbackContact.address : ""),
      linkedin: normalizeSingleLineText(
        contactPage.linkedin,
        contactPage.isFallback ? fallbackContact.linkedin : ""
      ),
      socials: Array.isArray(contactPage.socialLinks)
        ? contactPage.socialLinks
        : contactPage.isFallback
          ? fallbackContact.socials
          : [],
    };
  }, [contactPage]);
  const serviceOptions = contactPage.isFallback && !contactPage.serviceOptions.length
    ? fallbackServiceOptions
    : contactPage.serviceOptions;
  const inquiryFieldDefinitions = contactPage.isFallback && !contactPage.formFields.length
    ? fallbackInquiryFieldDefinitions
    : contactPage.formFields;
  const contactEmails = useMemo(
    () => parseContactEmails(contact.email, contactPage.isFallback ? undefined : []),
    [contact.email, contactPage.isFallback]
  );
  const addressLines = useMemo(
    () => getAddressLines(contact.address, contactPage.isFallback ? fallbackContact.address : ""),
    [contact.address, contactPage.isFallback]
  );
  const whatsappHref = useMemo(() => getWhatsAppUrl(contact.phone), [contact.phone]);
  const mapHref = useMemo(() => getMapUrl(contact.address), [contact.address]);
  const ctaCards = useMemo(
    () =>
      contactPage.ctaCards.map((card) => ({
        ...card,
        href: resolveContactHref(card.href, { whatsappHref }),
      })),
    [contactPage.ctaCards, whatsappHref]
  );
  const shouldRenderHero = Boolean(contactPage.heroTitle || contactPage.heroIntro || contactPage.heroNote);
  const shouldRenderCtas = ctaCards.length > 0;
  const shouldRenderServiceField = Boolean(contactPage.serviceFieldLabel || serviceOptions.length);
  const shouldRenderProjectSizeField = Boolean(contactPage.projectSizeLabel || contactPage.projectSizePlaceholder);
  const shouldRenderLocationField = Boolean(contactPage.locationLabel || contactPage.locationPlaceholder);
  const shouldRenderRequirementField = Boolean(contactPage.requirementLabel || contactPage.requirementPlaceholder);
  const shouldRenderSourceField = Boolean(contactPage.sourceLabel || contactPage.sourcePlaceholder);
  const shouldRenderForm = Boolean(
    contactPage.formHeading ||
      contactPage.formDescription ||
      inquiryFieldDefinitions.length ||
      shouldRenderServiceField ||
      shouldRenderProjectSizeField ||
      shouldRenderLocationField ||
      shouldRenderRequirementField ||
      shouldRenderSourceField
  );
  const shouldRenderOfficeCard = Boolean(
    contactPage.officeBadge ||
      contactPage.officeIcon ||
      contactPage.officeTitle ||
      contactPage.companyName ||
      addressLines.length ||
      contactPage.businessHoursLabel ||
      contactPage.businessHoursText
  );
  const shouldRenderMapCard = Boolean(
    contactPage.mapsTitle ||
      contactPage.mapsDescription ||
      contactPage.mapsButtonLabel ||
      contactPage.mapsIcon ||
      contactPage.mapsDecorativeIcon
  );
  const shouldRenderUrgent = Boolean(
    contactPage.urgentTitle ||
      contactPage.urgentDescription ||
      contactPage.hotlineLabel ||
      contactPage.supportLabel ||
      contact.phone ||
      contactEmails.length
  );

  useEffect(() => {
    setInquiryForm((current) => {
      if (serviceOptions.includes(current.service)) {
        return current;
      }

      return {
        ...current,
        service: serviceOptions[0] || "",
      };
    });
  }, [serviceOptions]);

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
      await fetchStrapiJson("/api/public/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            ...inquiryForm,
            sourcePage: "Contact Us",
            pagePath: typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/contact",
            formName: contactPage.formHeading || "Inquiry Form",
          },
        }),
      });

      setInquiryForm({ ...initialInquiryForm, service: serviceOptions[0] || "" });
      setSubmitMessage(contactPage.successMessage);
      setIsSuccessPopupOpen(true);
    } catch (error) {
      setSubmitError(error.message || "We could not submit your inquiry right now.");
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
              {contactPage.successTitle}
            </h3>
            <p className="mt-3 font-helixa-regular text-sm leading-relaxed text-slate-600">
              {submitMessage}
            </p>
            <button
              type="button"
              onClick={() => setIsSuccessPopupOpen(false)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-primary/90"
            >
              {contactPage.closeButtonLabel}
            </button>
          </div>
        </div>
      ) : null}

      <main className="pt-20">
        {shouldRenderHero ? (
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
              {contactPage.heroTitle ? (
                <h1 className="stagger-item optika-bold mx-auto mb-8 max-w-5xl text-center text-4xl leading-[1.05] text-white sm:text-5xl md:mb-10 md:text-6xl lg:text-7xl" style={{ animationDelay: "0.1s" }}>
                  {contactPage.heroTitle}
                </h1>
              ) : null}
              <div className="stagger-item mx-auto max-w-3xl space-y-6" style={{ animationDelay: "0.2s" }}>
                {contactPage.heroIntro ? (
                  <p className="font-helixa-regular text-base leading-relaxed text-white/90 md:text-lg">
                    {contactPage.heroIntro}
                  </p>
                ) : null}
                {contactPage.heroNote ? (
                  <p className="font-helixa-regular text-base leading-relaxed text-white/70">
                    {contactPage.heroNote}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {shouldRenderCtas ? (
          <div className={`relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${shouldRenderHero ? "-mt-12 sm:-mt-16 md:-mt-20" : "pt-10"}`}>
            <div className="stagger-item grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4" style={{ animationDelay: "0.3s" }}>
              {ctaCards.map((card) => (
                <a key={card.title} href={card.href} target={card.external ? "_blank" : undefined} rel={card.external ? "noreferrer" : undefined} className={`cta-architectural glass-lift group flex flex-col justify-between rounded-xl bg-white p-6 sm:p-8 ${card.extraClass ?? ""}`}>
                  <div>
                    {card.eyebrow ? (
                      <span className={`font-helixa-bold mb-4 block text-[10px] uppercase tracking-[0.2em] ${card.color}`}>{card.eyebrow}</span>
                    ) : null}
                    <h3 className={`font-optika-bold text-lg leading-snug text-deep-navy transition-colors ${card.titleHoverColor ?? "group-hover:text-primary"}`}>{card.title}</h3>
                  </div>
                  {card.action ? (
                    <div className={`font-helixa-bold mt-8 flex items-center text-sm ${card.color}`}>
                      {card.action}
                      <Icon name="arrow_forward" className="ml-2 text-sm transition-transform group-hover:translate-x-1" />
                    </div>
                  ) : null}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        {shouldRenderForm || shouldRenderOfficeCard || shouldRenderMapCard ? (
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className={`grid grid-cols-1 items-start gap-8 lg:gap-16 ${shouldRenderForm && (shouldRenderOfficeCard || shouldRenderMapCard) ? "lg:grid-cols-3" : "lg:grid-cols-1"}`}>
              {shouldRenderForm ? (
                <div id="contact-inquiry-form" className={`stagger-item scroll-mt-28 rounded-2xl border border-outline-variant/30 bg-white p-6 shadow-sm sm:p-8 md:p-10 lg:p-12 ${shouldRenderOfficeCard || shouldRenderMapCard ? "lg:col-span-2" : ""}`} style={{ animationDelay: "0.4s" }}>
                {contactPage.formHeading || contactPage.formDescription ? (
                  <div className="mb-10">
                    {contactPage.formHeading ? (
                      <h2 className="font-optika-bold mb-2 text-3xl text-deep-navy">{contactPage.formHeading}</h2>
                    ) : null}
                    {contactPage.formDescription ? (
                      <p className="font-helixa-regular text-sm text-slate-500">{contactPage.formDescription}</p>
                    ) : null}
                  </div>
                ) : null}
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
                  {shouldRenderServiceField ? (
                    <div className="flex flex-col gap-2">
                      {contactPage.serviceFieldLabel ? (
                        <label className="font-helixa-bold text-[10px] uppercase tracking-widest text-slate-500">{contactPage.serviceFieldLabel}</label>
                      ) : null}
                      <select
                        value={inquiryForm.service}
                        onChange={(event) => updateInquiryField("service", event.target.value)}
                        className="form-input-animated custom-select font-helixa-regular w-full cursor-pointer rounded bg-surface-container-low/50 px-4 py-3"
                      >
                        {serviceOptions.map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </div>
                  ) : null}
                  {shouldRenderProjectSizeField ? (
                    <div className="flex flex-col gap-2">
                      {contactPage.projectSizeLabel ? (
                        <label className="font-helixa-bold text-[10px] uppercase tracking-widest text-slate-500">{contactPage.projectSizeLabel}</label>
                      ) : null}
                      <input
                        type="text"
                        placeholder={contactPage.projectSizePlaceholder}
                        value={inquiryForm.projectSize}
                        onChange={(event) => updateInquiryField("projectSize", event.target.value)}
                        className="form-input-animated font-helixa-regular w-full rounded bg-surface-container-low/50 px-4 py-3"
                      />
                    </div>
                  ) : null}
                  {shouldRenderLocationField ? (
                    <div className="flex flex-col gap-2">
                      {contactPage.locationLabel ? (
                        <label className="font-helixa-bold text-[10px] uppercase tracking-widest text-slate-500">{contactPage.locationLabel}</label>
                      ) : null}
                      <input
                        type="text"
                        placeholder={contactPage.locationPlaceholder}
                        value={inquiryForm.location}
                        onChange={(event) => updateInquiryField("location", event.target.value)}
                        className="form-input-animated font-helixa-regular w-full rounded bg-surface-container-low/50 px-4 py-3"
                      />
                    </div>
                  ) : null}
                  {shouldRenderRequirementField ? (
                    <div className="flex flex-col gap-2 md:col-span-2">
                      {contactPage.requirementLabel ? (
                        <label className="font-helixa-bold text-[10px] uppercase tracking-widest text-slate-500">{contactPage.requirementLabel}</label>
                      ) : null}
                      <textarea
                        rows="4"
                        required
                        placeholder={contactPage.requirementPlaceholder}
                        value={inquiryForm.requirement}
                        onChange={(event) => updateInquiryField("requirement", event.target.value)}
                        className="form-input-animated font-helixa-regular w-full rounded bg-surface-container-low/50 px-4 py-3"
                      />
                    </div>
                  ) : null}
                  {shouldRenderSourceField ? (
                    <div className="flex flex-col gap-2 md:col-span-2">
                      {contactPage.sourceLabel ? (
                        <label className="font-helixa-bold text-[10px] uppercase tracking-widest text-slate-500">{contactPage.sourceLabel}</label>
                      ) : null}
                      <input
                        type="text"
                        placeholder={contactPage.sourcePlaceholder}
                        value={inquiryForm.source}
                        onChange={(event) => updateInquiryField("source", event.target.value)}
                        className="form-input-animated font-helixa-regular w-full rounded bg-surface-container-low/50 px-4 py-3"
                      />
                    </div>
                  ) : null}
                  <div className="pt-6 md:col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group font-helixa-bold flex w-full items-center justify-center gap-2 rounded bg-primary px-10 py-4 text-white shadow-lg shadow-primary/10 transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? contactPage.submittingButtonLabel : contactPage.submitButtonLabel}
                      <Icon name="arrow_forward" className="text-sm transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </form>
              </div>
              ) : null}

              {shouldRenderOfficeCard || shouldRenderMapCard ? (
                <div className="space-y-6">
                  {shouldRenderOfficeCard ? (
                    <div className="contact-card-click rounded-2xl border-2 border-primary/20 bg-white p-6 shadow-md transition-all hover:border-primary/40 sm:p-8">
                      {contactPage.officeBadge || contactPage.officeIcon ? (
                        <div className="mb-6 flex items-start justify-between">
                          {contactPage.officeBadge ? (
                            <span className="font-helixa-bold rounded bg-primary px-3 py-1 text-[9px] uppercase tracking-widest text-white">{contactPage.officeBadge}</span>
                          ) : null}
                          {contactPage.officeIcon ? (
                            <Icon name={contactPage.officeIcon} className="text-3xl text-primary" />
                          ) : null}
                        </div>
                      ) : null}
                      {contactPage.officeTitle ? (
                        <h3 className="font-optika-bold mb-5 text-2xl text-deep-navy">{contactPage.officeTitle}</h3>
                      ) : null}
                      {contactPage.companyName || addressLines.length ? (
                        <div className="mb-6 flex items-start gap-4">
                          {addressLines.length ? <Icon name="location_on" className="mt-1 text-primary" /> : null}
                          <div className="font-helixa-regular min-h-[6.5rem] text-sm leading-relaxed text-slate-600">
                            {contactPage.companyName ? (
                              <p className="font-helixa-bold mb-1 text-deep-navy">{contactPage.companyName}</p>
                            ) : null}
                            {addressLines.map((line) => (
                              <div key={line}>{line}</div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {contactPage.businessHoursLabel || contactPage.businessHoursText ? (
                        <div className="flex items-center gap-4 border-t border-outline-variant/20 pt-6">
                          <Icon name="schedule" className="text-slate-400" />
                          <div>
                            {contactPage.businessHoursLabel ? (
                              <p className="font-helixa-bold text-[10px] uppercase tracking-widest text-slate-400">{contactPage.businessHoursLabel}</p>
                            ) : null}
                            {contactPage.businessHoursText ? (
                              <p className="font-helixa-regular text-xs text-slate-500">{contactPage.businessHoursText}</p>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {shouldRenderMapCard ? (
                    <div className="contact-card-click group relative overflow-hidden rounded-2xl border-none bg-primary p-6 text-white sm:p-8">
                      <div className="relative z-10">
                        {contactPage.mapsTitle ? (
                          <h3 className="font-optika-bold mb-3 text-xl">{contactPage.mapsTitle}</h3>
                        ) : null}
                        {contactPage.mapsDescription ? (
                          <p className="font-helixa-regular mb-8 text-sm text-white/90">{contactPage.mapsDescription}</p>
                        ) : null}
                        {contactPage.mapsButtonLabel ? (
                          <a href={mapHref} target="_blank" rel="noreferrer" className="group/btn font-helixa-bold inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm text-primary shadow-xl shadow-black/10 transition-all hover:bg-white/90">
                            {contactPage.mapsIcon ? <Icon name={contactPage.mapsIcon} className="text-base" /> : null}
                            {contactPage.mapsButtonLabel}
                            <Icon name="arrow_forward" className="text-xs transition-transform group-hover/btn:translate-x-1" />
                          </a>
                        ) : null}
                      </div>
                      {contactPage.mapsDecorativeIcon ? (
                        <div className="pointer-events-none absolute -bottom-6 -right-6 opacity-10 transition-all duration-700 group-hover:scale-110 group-hover:opacity-20">
                          <Icon name={contactPage.mapsDecorativeIcon} className="text-[140px]" />
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
          </div>
        </div>
        </div>
        ) : null}

        {shouldRenderUrgent ? (
          <section className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="relative z-10 mx-auto max-w-6xl">
              <div className="architectural-inquiry-box relative overflow-hidden rounded-2xl p-8 text-on-background sm:p-10 md:p-14 lg:p-16" style={{ borderLeftColor: '#2AAF6F' }}>
                <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-full w-32 bg-gradient-to-r from-primary/5 to-transparent" />
                <div className="relative z-10">
                  {contactPage.urgentTitle ? (
                    <h2 className="font-optika-bold mb-6 text-3xl tracking-tight text-growth-green sm:text-4xl md:text-5xl">{contactPage.urgentTitle}</h2>
                  ) : null}
                  {contactPage.urgentDescription ? (
                    <p className="font-helixa-regular mb-10 max-w-2xl text-base text-growth-green sm:mb-12 sm:text-lg">{contactPage.urgentDescription}</p>
                  ) : null}
                  <div className="grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
                    {[
                      { icon: "call", label: contactPage.hotlineLabel, values: contact.phone ? [contact.phone] : [] },
                      { icon: "inbox", label: contactPage.supportLabel, values: contactEmails },
                    ]
                      .filter((item) => item.label || item.values.length)
                      .map((item) => (
                        <div key={item.label || item.icon} className="group flex cursor-pointer items-center gap-6">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-outline-variant/30 bg-green-50 shadow-sm transition-all duration-300 group-hover:border-primary group-hover:bg-growth-green/90">
                            <Icon name={item.icon} className="text-2xl text-[#2AAF6F] transition-colors group-hover:text-white" />
                          </div>
                          <div>
                            {item.label ? (
                              <p className="font-helixa-bold mb-1 text-[10px] uppercase tracking-[0.2em]">{item.label}</p>
                            ) : null}
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
        ) : null}
      </main>

      <SiteFooter />

      </div>
  );
}
