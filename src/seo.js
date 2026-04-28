import { resolveMediaUrl } from "./lib/api";
import { getPrimaryContactEmail } from "./lib/siteContent";

const SITE_NAME = "Environomics Projects LLP";
const WEBSITE_NAME = "Environomics";
const SITE_URL_FALLBACK = "https://environomics.in";
const DEFAULT_IMAGE_PATH = "/imgs/hero-2560.jpg";
const DEFAULT_LOGO_PATH = "/imgs/LOGO%20(1).png";

const pageMetadata = {
  "/": {
    title: "Turnkey Solar, HVAC & Industrial EPC in India",
    description:
      "Environomics Projects LLP delivers turnkey EPC solutions across solar power, HVAC, clean rooms, electrification, automation, and industrial utilities in India.",
  },
  "/home": {
    title: "Turnkey Solar, HVAC & Industrial EPC in India",
    description:
      "Environomics Projects LLP delivers turnkey EPC solutions across solar power, HVAC, clean rooms, electrification, automation, and industrial utilities in India.",
  },
  "/about": {
    title: "About Environomics",
    description:
      "Learn about Environomics Projects LLP, our EPC process, engineering approach, leadership, and experience delivering industrial infrastructure projects across India.",
  },
  "/projects": {
    title: "Industrial EPC Projects Portfolio",
    description:
      "Explore Environomics project work across rooftop solar, ground mount systems, industrial HVAC, and utility infrastructure for leading commercial and industrial clients.",
  },
  "/projects/case-study": {
    title: "Project Case Study",
    description:
      "Review detailed project information from the Environomics industrial EPC portfolio, including client, sector, installed capacity, and project imagery.",
  },
  "/om": {
    title: "Solar O&M Services",
    description:
      "Explore Environomics solar operations and maintenance services covering preventive maintenance, remote monitoring, corrective response, and third-party plant support.",
  },
  "/om/gallery": {
    title: "Solar O&M Image Gallery",
    description:
      "View full Environomics solar operations and maintenance images in a separate tab with room for supporting captions and project notes below each image.",
  },
  "/clients": {
    title: "Clients and Installation Portfolio",
    description:
      "See the clients who trust Environomics for solar EPC, industrial utilities, HVAC, and long-term infrastructure execution across multiple sectors in India.",
  },
  "/services": {
    title: "Solar EPC, HVAC and Industrial Utility Services",
    description:
      "Discover Environomics services spanning solar rooftop, ground mount plants, pharmaceutical clean rooms, electrification, automation, and energy audits.",
  },
  "/testimonials": {
    title: "Client Testimonials",
    description:
      "Read client testimonials and proof points from Environomics solar EPC and industrial infrastructure projects delivered for major brands and manufacturers.",
  },
  "/innovation": {
    title: "Innovation and R&D",
    description:
      "Explore Environomics innovation initiatives, proprietary solar engineering work, R&D programs, and industrial infrastructure technology development.",
  },
  "/contact": {
    title: "Contact Environomics",
    description:
      "Contact Environomics Projects LLP for solar EPC, industrial HVAC, clean rooms, automation, electrification, and feasibility assessments for your facility.",
  },
  "/privacy": {
    title: "Privacy Policy",
    description:
      "Read the Environomics Projects LLP privacy policy covering website inquiries, contact information, and data handling practices.",
  },
  "/admin": {
    title: "Admin Panel",
    description:
      "Secure Environomics content management portal for website updates and lead handling.",
  },
};

const routeToPageKey = {
  "/": "home",
  "/home": "home",
  "/about": "about",
  "/projects": "projects",
  "/projects/case-study": "projects",
  "/clients": "clients",
  "/services": "services",
  "/testimonials": "testimonials",
  "/innovation": "innovation",
  "/contact": "contact",
};

function trimTrailingSlash(value = "") {
  return String(value).replace(/\/+$/, "");
}

function ensureMetaTag(attribute, value) {
  let node = document.head.querySelector(`meta[${attribute}="${value}"]`);

  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, value);
    document.head.appendChild(node);
  }

  return node;
}

function ensureLinkTag(rel) {
  let node = document.head.querySelector(`link[rel="${rel}"]`);

  if (!node) {
    node = document.createElement("link");
    node.setAttribute("rel", rel);
    document.head.appendChild(node);
  }

  return node;
}

function upsertMetadataTag(definition) {
  const { attribute, key, content } = definition;
  const node = ensureMetaTag(attribute, key);
  node.setAttribute("content", content);
}

function getPageMetadata(route, content) {
  const fallbackMetadata = pageMetadata[route] ?? pageMetadata["/"];
  const pageKey = routeToPageKey[route];
  const pageSeo = pageKey ? content?.seo?.pages?.[pageKey] ?? {} : {};

  return {
    title: String(pageSeo.title ?? "").trim() || fallbackMetadata.title,
    description: String(pageSeo.description ?? "").trim() || fallbackMetadata.description,
  };
}

function getSiteUrl(content, origin) {
  const candidate =
    String(content?.seo?.schema?.siteUrl ?? "").trim() ||
    String(content?.settings?.domain ?? "").trim() ||
    origin ||
    SITE_URL_FALLBACK;

  try {
    return trimTrailingSlash(new URL(candidate, origin || SITE_URL_FALLBACK).href);
  } catch {
    return SITE_URL_FALLBACK;
  }
}

function resolveMetadataAssetUrl(path, siteUrl) {
  if (!path) {
    return new URL(DEFAULT_IMAGE_PATH, `${siteUrl}/`).href;
  }

  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }

  if (/^\/?uploads\//i.test(path)) {
    return resolveMediaUrl(path.startsWith("/") ? path : `/${path}`);
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${siteUrl}/`).href;
}

function getSchemaSettings(content, siteUrl) {
  const schema = content?.seo?.schema ?? {};

  return {
    organizationName: String(schema.organizationName ?? "").trim() || SITE_NAME,
    websiteName: String(schema.websiteName ?? "").trim() || WEBSITE_NAME,
    siteUrl,
    logo: resolveMetadataAssetUrl(schema.logo || DEFAULT_LOGO_PATH, siteUrl),
    defaultImage: resolveMetadataAssetUrl(schema.defaultImage || DEFAULT_IMAGE_PATH, siteUrl),
    sameAs: Array.isArray(schema.sameAs) ? schema.sameAs.filter(Boolean) : [],
  };
}

function buildStructuredData({
  canonicalUrl,
  route,
  title,
  description,
  imageUrl,
  schema,
  contact,
}) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: schema.organizationName,
    url: schema.siteUrl,
    logo: schema.logo,
    sameAs: schema.sameAs,
  };

  if (contact?.email) {
    organization.email = getPrimaryContactEmail(contact.email);
  }

  if (contact?.address) {
    organization.address = {
      "@type": "PostalAddress",
      streetAddress: contact.address,
      addressCountry: "IN",
    };
  }

  return [
    organization,
    {
      "@context": "https://schema.org",
      "@type": route === "/" ? "WebSite" : "WebPage",
      name: title,
      description,
      url: canonicalUrl,
      image: imageUrl,
      publisher: {
        "@type": "Organization",
        name: schema.organizationName,
      },
    },
  ];
}

export function applyRouteMetadata(route, content) {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const metadata = getPageMetadata(route, content);
  const origin = window.location.origin || SITE_URL_FALLBACK;
  const siteUrl = getSiteUrl(content, origin);
  const schema = getSchemaSettings(content, siteUrl);
  const canonicalUrl = new URL(route === "/home" ? "/" : route, `${siteUrl}/`).href;
  const imageUrl = schema.defaultImage;
  const siteName = schema.organizationName || SITE_NAME;
  const title = `${metadata.title} | ${siteName}`;
  const robotsContent =
    route === "/admin"
      ? "noindex,nofollow,noarchive"
      : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

  document.title = title;
  document.documentElement.lang = "en";

  const metaTags = [
    { attribute: "name", key: "description", content: metadata.description },
    { attribute: "name", key: "robots", content: robotsContent },
    { attribute: "name", key: "theme-color", content: "#1572C8" },
    { attribute: "property", key: "og:type", content: "website" },
    { attribute: "property", key: "og:site_name", content: schema.websiteName },
    { attribute: "property", key: "og:title", content: title },
    { attribute: "property", key: "og:description", content: metadata.description },
    { attribute: "property", key: "og:url", content: canonicalUrl },
    { attribute: "property", key: "og:image", content: imageUrl },
    { attribute: "property", key: "og:locale", content: "en_IN" },
    { attribute: "name", key: "twitter:card", content: "summary_large_image" },
    { attribute: "name", key: "twitter:title", content: title },
    { attribute: "name", key: "twitter:description", content: metadata.description },
    { attribute: "name", key: "twitter:image", content: imageUrl },
  ];

  metaTags.forEach(upsertMetadataTag);

  const canonicalLink = ensureLinkTag("canonical");
  canonicalLink.setAttribute("href", canonicalUrl);

  let structuredDataNode = document.head.querySelector('script[data-seo="route-schema"]');
  if (route === "/admin") {
    if (structuredDataNode) {
      structuredDataNode.remove();
    }
    return;
  }

  if (!structuredDataNode) {
    structuredDataNode = document.createElement("script");
    structuredDataNode.type = "application/ld+json";
    structuredDataNode.setAttribute("data-seo", "route-schema");
    document.head.appendChild(structuredDataNode);
  }

  structuredDataNode.textContent = JSON.stringify(
    buildStructuredData({
      canonicalUrl,
      route,
      title,
      description: metadata.description,
      imageUrl,
      schema,
      contact: content?.contact,
    })
  );
}
