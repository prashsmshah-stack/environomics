import { useMemo } from "react";
import footerLogo from "../../imgs/Logo White.png";
import { usePublicContent } from "../context/PublicContentContext";
import { resolveMediaUrl } from "../lib/api";
import {
  normalizeDisplayLines,
  normalizeSingleLineText,
  singleLineClampStyle,
} from "../lib/contentLayout";

const footerServices = [
  { label: "Solar EPC Solutions", href: "/services?tab=0" },
  { label: "Industrial HVAC", href: "/services?tab=3" },
  { label: "Clean Room Engineering", href: "/services?tab=3" },
  { label: "Electrical Automation", href: "/services?tab=4" },
  { label: "O&M Services", href: "/services?tab=2" },
];

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Our Projects", href: "/projects" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Innovation & R&D", href: "/innovation" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
];

const fallbackContact = {
  phone: "09998112299",
  email: "info@environomics.in",
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

const fallbackSettings = {
  footerYear: "2026",
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

function getAddressLines(address) {
  return normalizeDisplayLines(address, {
    fallback: fallbackContact.address,
    maxLines: 4,
    maxLineLength: 30,
  });
}

function SocialLinkIcon({ social }) {
  if (/linkedin/i.test(social.platform ?? "")) {
    return <LinkedInIcon className="h-5 w-5" />;
  }

  if (social.logo) {
    return (
      <img
        src={resolveMediaUrl(social.logo) || fallbackLogo(social.platform || "Social")}
        alt={social.platform || "Social media"}
        className="h-5 w-5 object-contain"
        onError={(event) => handleImageError(event, social.platform || "Social media")}
      />
    );
  }

  return <Icon name="public" className="text-xl" />;
}

export default function SiteFooter() {
  const { content } = usePublicContent();
  const contact = useMemo(() => {
    const backendContact = content?.contact ?? {};

    return {
      ...fallbackContact,
      ...backendContact,
      phone: normalizeSingleLineText(backendContact.phone, fallbackContact.phone),
      email: normalizeSingleLineText(backendContact.email, fallbackContact.email),
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
  const settings = useMemo(
    () => ({
      ...fallbackSettings,
      ...(content?.settings ?? {}),
    }),
    [content]
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

    if (contact.linkedin) {
      pushItem({
        id: "footer-linkedin",
        platform: "LinkedIn",
        url: contact.linkedin,
        logo: "",
      });
    }

    for (const social of contact.socials ?? []) {
      pushItem(social);
    }

    return items;
  }, [contact]);
  const addressLines = useMemo(() => getAddressLines(contact.address), [contact.address]);

  return (
    <footer className="relative overflow-hidden bg-[#2AAF6F] pb-10 pt-16 text-white sm:pb-12 sm:pt-20 lg:pt-24">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="mb-8 flex items-center gap-3 sm:mb-10">
              <img
                src={footerLogo}
                alt="Environomics Logo"
                className="h-14 w-auto object-contain sm:h-16"
                onError={(event) => handleImageError(event, "Environomics Logo")}
              />
            </div>
            <p className="helixa-regular mb-8 text-sm leading-relaxed text-white/90">
              Pioneering the industrial transition to sustainable infrastructure through
              high-precision engineering and EPC excellence.
            </p>
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
          </div>

          <div>
            <h4 className="optika-bold mb-6 text-lg text-white sm:mb-8">Services</h4>
            <ul className="helixa-regular space-y-4 text-sm text-white/80">
              {footerServices.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="optika-bold mb-6 text-lg text-white sm:mb-8">Quick Links</h4>
            <ul className="helixa-regular space-y-4 text-sm text-white/80">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-[#F8FAFB]">
            <h4 className="optika-bold mb-6 flex items-center gap-2 text-lg sm:mb-8">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#2AAF6F]" />
              CONTACT DETAILS
            </h4>
            <ul className="helixa-regular space-y-4 text-sm">
              <li className="flex min-w-0 items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <Icon name="location_on" className="!text-xl text-white" />
                </div>
                <span className="min-w-0 pt-0.5">
                  {(addressLines.length ? addressLines : [fallbackContact.address]).map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex min-w-0 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <Icon name="call" className="!text-xl text-white" />
                </div>
                <span style={singleLineClampStyle} title={contact.phone}>{contact.phone}</span>
              </li>
              <li className="flex min-w-0 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <Icon name="mail" className="!text-xl text-white" />
                </div>
                <span style={singleLineClampStyle} title={contact.email}>{contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center sm:gap-6 sm:pt-10 md:flex-row md:text-left">
          <p className="helixa-regular text-sm text-white/60">© {settings.footerYear} Environomics. All rights reserved.</p>
          <div className="helixa-bold flex flex-wrap justify-center gap-4 text-[11px] uppercase tracking-[0.25em] text-white/40 sm:gap-8 md:justify-end lg:gap-12">
            <span>Engineering</span>
            <span>Procurement</span>
            <span>Construction</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
