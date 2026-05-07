import { useEffect, useMemo, useState } from "react";
import {
  normalizeDisplayLines,
  normalizeSingleLineText,
  singleLineClampStyle,
} from "../lib/contentLayout";
import { fetchStrapiJson, resolveStrapiMediaUrl } from "../lib/strapiApi";
import {
  CONTACT_EMAILS_DISPLAY,
  CONTACT_PHONE,
  formatContactEmails,
  normalizeContactPhone,
  parseContactEmails,
} from "../lib/siteContent";

const footerServices = [
  { label: "Solar EPC Solutions", href: "/services?tab=solar-rooftop" },
  { label: "Industrial HVAC", href: "/services?tab=hvac" },
  { label: "Clean Room Engineering", href: "/services?tab=hvac" },
  { label: "Electrical Automation", href: "/services?tab=automation" },
  { label: "O&M Services", href: "/om" },
];

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Our Projects", href: "/projects" },
  { label: "O&M", href: "/om" },
  { label: "Our Clients", href: "/clients" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Innovation & R&D", href: "/innovation" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
];

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
    {
      id: "social_youtube",
      platform: "YouTube",
      handle: "Environomics Projects",
      url: "https://www.youtube.com/watch?v=c98iCb4pRg4",
      logo: "",
    },
    {
      id: "social_whatsapp",
      platform: "WhatsApp",
      handle: "+917981758833",
      url: "https://wa.me/917981758833",
      logo: "",
    },
  ],
};

const fallbackSettings = {
  footerYear: "2026",
};

const fallbackFooter = {
  isFallback: true,
  logo: {
    url: "",
    alternativeText: "Environomics Logo",
  },
  logoAlt: "Environomics Logo",
  description:
    "Pioneering the industrial transition to sustainable infrastructure through high-precision engineering and EPC excellence.",
  socialLinks: fallbackContact.socials,
  servicesHeading: "Services",
  serviceLinks: footerServices,
  quickLinksHeading: "Quick Links",
  quickLinks: footerLinks,
  contactHeading: "CONTACT DETAILS",
  address: fallbackContact.address,
  phone: fallbackContact.phone,
  email: fallbackContact.email,
  copyrightText: `\u00a9 ${fallbackSettings.footerYear} Environomics. All rights reserved.`,
  bottomWords: [
    { id: "engineering", text: "Engineering" },
    { id: "procurement", text: "Procurement" },
    { id: "construction", text: "Construction" },
  ],
};

function fallbackLogo(label) {
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
  const fallback = fallbackLogo(label);
  if (event.currentTarget.src !== fallback) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallback;
  }
}

function Icon({ name, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`.trim()}>{name}</span>;
}

function LinkedInIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M6.94 8.5H3.56V19.5H6.94V8.5ZM5.25 3C4.17 3 3.5 3.72 3.5 4.66C3.5 5.58 4.15 6.31 5.21 6.31H5.23C6.33 6.31 7 5.58 7 4.66C6.98 3.72 6.33 3 5.25 3ZM20.5 13.19C20.5 9.81 18.7 8.24 16.3 8.24C14.36 8.24 13.49 9.31 13 10.06V8.5H9.62C9.66 9.53 9.62 19.5 9.62 19.5H13V13.36C13 13.03 13.02 12.69 13.12 12.45C13.38 11.8 13.97 11.12 14.95 11.12C16.23 11.12 16.75 12.09 16.75 13.52V19.5H20.13V13.13C20.13 13.15 20.13 13.17 20.13 13.19H20.5Z" />
    </svg>
  );
}

function YouTubeIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function WhatsAppIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
    </svg>
  );
}

function getAddressLines(address, fallback = fallbackContact.address) {
  return normalizeDisplayLines(address, {
    fallback,
    maxLines: 4,
    maxLineLength: 30,
  });
}

function SocialLinkIcon({ social }) {
  if (/linkedin/i.test(social.platform ?? "")) {
    return <LinkedInIcon className="h-5 w-5" />;
  }

  if (/youtube/i.test(social.platform ?? "")) {
    return <YouTubeIcon className="h-5 w-5" />;
  }

  if (/whatsapp/i.test(social.platform ?? "")) {
    return <WhatsAppIcon className="h-5 w-5" />;
  }

  if (social.logoUrl) {
    return (
      <img
        src={social.logoUrl || fallbackLogo(social.platform || "Social")}
        alt={social.platform || "Social media"}
        className="h-5 w-5 object-contain"
        onError={(event) => handleImageError(event, social.platform || "Social media")}
      />
    );
  }

  return <Icon name="public" className="text-xl" />;
}

function normalizeFooterLink(link, index, fallbackPrefix = "link") {
  return {
    id: link?.id ?? `${fallbackPrefix}-${index + 1}`,
    label: normalizeSingleLineText(link?.label),
    href: normalizeSingleLineText(link?.href, "#"),
    isExternal: Boolean(link?.isExternal),
  };
}

function normalizeFooterSocialLink(social, index) {
  return {
    id: social?.id ?? social?.url ?? `social-${index + 1}`,
    platform: normalizeSingleLineText(social?.platform, "Social"),
    handle: normalizeSingleLineText(social?.handle),
    url: normalizeSingleLineText(social?.url, "#"),
    logoUrl: resolveStrapiMediaUrl(social?.logo?.url || social?.logo),
  };
}

function normalizeFooter(payload) {
  const data = payload?.data;

  if (!data) {
    return fallbackFooter;
  }

  const socialLinks = Array.isArray(data.socialLinks)
    ? data.socialLinks.map(normalizeFooterSocialLink).filter((item) => item.url && item.url !== "#")
    : [];
  const serviceLinks = Array.isArray(data.serviceLinks)
    ? data.serviceLinks.map((item, index) => normalizeFooterLink(item, index, "service")).filter((item) => item.label)
    : [];
  const quickLinks = Array.isArray(data.quickLinks)
    ? data.quickLinks.map((item, index) => normalizeFooterLink(item, index, "quick")).filter((item) => item.label)
    : [];
  const bottomWords = Array.isArray(data.bottomWords)
    ? data.bottomWords
        .map((item, index) => ({
          id: item?.id ?? `bottom-word-${index + 1}`,
          text: normalizeSingleLineText(item?.text),
        }))
        .filter((item) => item.text)
    : [];

  return {
    ...fallbackFooter,
    ...data,
    isFallback: false,
    logo: {
      url: resolveStrapiMediaUrl(data.logo?.url),
      alternativeText: normalizeSingleLineText(data.logo?.alternativeText, data.logoAlt || fallbackFooter.logoAlt),
    },
    logoAlt: normalizeSingleLineText(data.logoAlt, fallbackFooter.logoAlt),
    description: String(data.description ?? "").trim(),
    socialLinks: Array.isArray(data.socialLinks) ? socialLinks : [],
    servicesHeading: normalizeSingleLineText(data.servicesHeading),
    serviceLinks: Array.isArray(data.serviceLinks) ? serviceLinks : [],
    quickLinksHeading: normalizeSingleLineText(data.quickLinksHeading),
    quickLinks: Array.isArray(data.quickLinks) ? quickLinks : [],
    contactHeading: normalizeSingleLineText(data.contactHeading),
    address: String(data.address ?? "").trim(),
    phone: normalizeContactPhone(data.phone, ""),
    email: parseContactEmails(data.email, []).join(", "),
    copyrightText: normalizeSingleLineText(data.copyrightText),
    bottomWords: Array.isArray(data.bottomWords) ? bottomWords : [],
  };
}

export default function SiteFooter() {
  const [footer, setFooter] = useState(fallbackFooter);

  useEffect(() => {
    let isMounted = true;

    async function loadFooter() {
      try {
        const payload = await fetchStrapiJson("/api/public/footer");

        if (isMounted) {
          setFooter(normalizeFooter(payload));
        }
      } catch {
        if (isMounted) {
          setFooter(fallbackFooter);
        }
      }
    }

    loadFooter();

    return () => {
      isMounted = false;
    };
  }, []);

  const contact = useMemo(() => {
    return {
      ...fallbackContact,
      phone: footer.phone || (footer.isFallback ? fallbackContact.phone : ""),
      email: footer.email || (footer.isFallback ? formatContactEmails(fallbackContact.email) : ""),
      address: String(footer.address ?? "").trim() || (footer.isFallback ? fallbackContact.address : ""),
      socials: Array.isArray(footer.socialLinks)
        ? footer.socialLinks
        : footer.isFallback
          ? fallbackContact.socials
          : [],
    };
  }, [footer]);
  const contactEmails = useMemo(
    () => parseContactEmails(contact.email, footer.isFallback ? undefined : []),
    [contact.email, footer.isFallback]
  );
  const socialLinks = useMemo(() => {
    const seenUrls = new Set();
    const items = [];

    const pushItem = (item) => {
      const url = String(item?.url ?? "").trim();
      if (!url || seenUrls.has(url)) {
        return;
      }

      seenUrls.add(url);
      items.push(item);
    };

    for (const social of contact.socials ?? []) {
      pushItem(social);
    }

    return items;
  }, [contact]);
  const addressLines = useMemo(
    () => getAddressLines(contact.address, footer.isFallback ? fallbackContact.address : ""),
    [contact.address, footer.isFallback]
  );
  const shouldRenderLogo = Boolean(footer.logo.url || footer.isFallback);
  const shouldRenderServices = Boolean(footer.servicesHeading || footer.serviceLinks.length);
  const shouldRenderQuickLinks = Boolean(footer.quickLinksHeading || footer.quickLinks.length);
  const shouldRenderContact = Boolean(footer.contactHeading || addressLines.length || contact.phone || contactEmails.length);
  const shouldRenderBottom = Boolean(footer.copyrightText || footer.bottomWords.length);

  return (
    <footer className="relative overflow-hidden bg-[#2AAF6F] pb-10 pt-16 text-white sm:pb-12 sm:pt-20 lg:pt-24">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            {shouldRenderLogo ? (
              <div className="mb-8 flex items-center gap-3 sm:mb-10">
                <img
                  src={footer.logo.url || fallbackLogo(footer.logoAlt)}
                  alt={footer.logoAlt}
                  className="h-14 w-auto object-contain sm:h-16"
                  onError={(event) => handleImageError(event, footer.logoAlt)}
                />
              </div>
            ) : null}
            {footer.description ? (
              <p className="helixa-regular mb-8 text-sm leading-relaxed text-white/90">
                {footer.description}
              </p>
            ) : null}
            {socialLinks.length ? (
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.id ?? social.url}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit Environomics on ${social.platform || "social media"}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white hover:text-growth-green"
                  >
                    <SocialLinkIcon social={social} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {shouldRenderServices ? (
            <div>
              {footer.servicesHeading ? (
                <h4 className="optika-bold mb-6 text-lg text-white sm:mb-8">{footer.servicesHeading}</h4>
              ) : null}
              <ul className="helixa-regular space-y-4 text-sm text-white/80">
                {footer.serviceLinks.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} target={item.isExternal ? "_blank" : undefined} rel={item.isExternal ? "noreferrer" : undefined} className="transition-colors hover:text-white">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {shouldRenderQuickLinks ? (
            <div>
              {footer.quickLinksHeading ? (
                <h4 className="optika-bold mb-6 text-lg text-white sm:mb-8">{footer.quickLinksHeading}</h4>
              ) : null}
              <ul className="helixa-regular space-y-4 text-sm text-white/80">
                {footer.quickLinks.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} target={item.isExternal ? "_blank" : undefined} rel={item.isExternal ? "noreferrer" : undefined} className="transition-colors hover:text-white">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {shouldRenderContact ? (
            <div className="text-[#F8FAFB]">
              {footer.contactHeading ? (
                <h4 className="optika-bold mb-6 flex items-center gap-2 text-lg sm:mb-8">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#2AAF6F]" />
                  {footer.contactHeading}
                </h4>
              ) : null}
            <ul className="helixa-regular space-y-4 text-sm">
              {addressLines.length ? (
                <li className="flex min-w-0 items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <Icon name="location_on" className="!text-xl text-white" />
                  </div>
                  <span className="min-w-0 pt-0.5">
                    {addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </li>
              ) : null}
              {contact.phone ? (
                <li className="flex min-w-0 items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <Icon name="call" className="!text-xl text-white" />
                  </div>
                  <span style={singleLineClampStyle} title={contact.phone}>{contact.phone}</span>
                </li>
              ) : null}
              {contactEmails.length ? (
                <li className="flex min-w-0 items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <Icon name="mail" className="!text-xl text-white" />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    {contactEmails.map((email) => (
                      <a
                        key={email}
                        href={`mailto:${email}`}
                        className="block break-all transition-colors hover:text-white/80"
                        title={email}
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </li>
              ) : null}
            </ul>
            </div>
          ) : null}
        </div>

        {shouldRenderBottom ? (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center sm:gap-6 sm:pt-10 md:flex-row md:text-left">
            {footer.copyrightText ? (
              <p className="helixa-regular text-sm text-white/60">{footer.copyrightText}</p>
            ) : null}
            {footer.bottomWords.length ? (
              <div className="helixa-bold flex flex-wrap justify-center gap-4 text-[11px] uppercase tracking-[0.25em] text-white/40 sm:gap-8 md:justify-end lg:gap-12">
                {footer.bottomWords.map((item) => (
                  <span key={item.id ?? item.text}>{item.text}</span>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
