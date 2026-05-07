import { fetchStrapiJson, resolveStrapiMediaUrl } from "./strapiApi";

export const CULTURE_PAGE_PATH = "/culture";

function normalizeText(value, fallback = "") {
  return String(value ?? "").trim() || fallback;
}

function normalizeMediaItem(media, fallbackAlt = "") {
  return {
    url: resolveStrapiMediaUrl(media?.url),
    alt: normalizeText(media?.alternativeText, fallbackAlt),
  };
}

function fallbackCultureImage(label = "Culture") {
  const safeLabel = String(label).replace(/&/g, "&amp;");
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f1c2c"/><stop offset="100%" stop-color="#2AAF6F"/></linearGradient></defs><rect width="1200" height="800" fill="url(#bg)"/><text x="80" y="120" fill="#ffffff" font-family="Arial, sans-serif" font-size="38" font-weight="700">ENVIRONOMICS</text><text x="80" y="720" fill="#ffffff" font-family="Arial, sans-serif" font-size="54" font-weight="700">${safeLabel}</text></svg>`)}`;
}

const fallbackCultureSections = [
  {
    id: "csr",
    title: "CSR",
    icon: "volunteer_activism",
    description: "Community initiatives where our team contributes time, resources, and care beyond project sites.",
  },
  {
    id: "trade-show",
    title: "TRADE SHOW",
    icon: "storefront",
    description: "Industry interactions, client conversations, and technology showcases from our trade show presence.",
  },
  {
    id: "celebrations",
    title: "CELEBRATIONS",
    icon: "celebration",
    description: "Moments that bring the team together, marking milestones, festivals, and shared wins.",
  },
  {
    id: "training",
    title: "TRAINING",
    icon: "school",
    description: "Hands-on learning sessions that strengthen safety, execution, and technical discipline.",
  },
].map((section) => ({
  ...section,
  coverImage: fallbackCultureImage(section.title),
  images: [
    {
      id: `${section.id}-fallback-image`,
      src: fallbackCultureImage(section.title),
      title: `${section.title} Image`,
      alt: `${section.title} culture image`,
    },
  ],
}));

export async function fetchCultureSections() {
  try {
    const payload = await fetchStrapiJson("/api/public/home-page");

    const sections = (payload?.data?.cultureTopics || [])
    .map((section, sectionIndex) => {
      const coverImage = normalizeMediaItem(section.coverImage, `${section.title} cover`);
      const images = (section.galleryImages || [])
        .map((image, imageIndex) => {
          const media = normalizeMediaItem(image, `${section.title} culture image ${imageIndex + 1}`);

          return {
            id: image.id || `${section.slug || section.id}-image-${imageIndex + 1}`,
            src: media.url,
            title: `${section.title} Image ${imageIndex + 1}`,
            alt: media.alt,
          };
        })
        .filter((image) => image.src);

      return {
        id: section.slug || section.id || `culture-topic-${sectionIndex + 1}`,
        title: normalizeText(section.title),
        icon: normalizeText(section.icon, "diversity_3"),
        description: normalizeText(section.description),
        coverImage: coverImage.url,
        images,
      };
    })
    .filter((section) => section.title);

    return sections.length ? sections : fallbackCultureSections;
  } catch {
    return fallbackCultureSections;
  }
}

export function getCultureSectionById(sections = [], sectionId = "") {
  return sections.find((section) => section.id === sectionId) ?? null;
}
