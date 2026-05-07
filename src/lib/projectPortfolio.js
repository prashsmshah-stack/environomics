import { fetchStrapiJson, resolveStrapiMediaUrl } from "./strapiApi";
import { getLocalCompanyLogo } from "./companyLogoRegistry";

const industryOrder = [
  "Automotive",
  "Pharma",
  "Textiles",
  "Engineering",
  "Chemicals",
  "Manufacturing",
  "Food & Bev",
  "FMCG",
  "Tiles / MFG",
];

const industryLabels = new Map([
  ["AUTOMOTIVE", "Automotive"],
  ["PHARMA", "Pharma"],
  ["PHARMACEUTICAL", "Pharma"],
  ["PHARMACEUTICALS", "Pharma"],
  ["TEXTILES", "Textiles"],
  ["TEXTILE", "Textiles"],
  ["ENGINEERING", "Engineering"],
  ["CHEMICALS", "Chemicals"],
  ["CHEMICAL", "Chemicals"],
  ["MANUFACTURING", "Manufacturing"],
  ["MFG", "Manufacturing"],
  ["FOOD & BEV", "Food & Bev"],
  ["FOOD AND BEV", "Food & Bev"],
  ["FMCG", "FMCG"],
  ["TILES / MFG", "Tiles / MFG"],
  ["TILES", "Tiles / MFG"],
]);

export const fallbackProjects = [
  {
    name: "GRG COTSPIN",
    industry: "Textiles",
    capacity: "4,200 kWp Solar",
    description: "2023 TEXTILES Largest single install. Anchor proof point.",
    image: "/imgs/projects/grg-cotspin.jpg",
    brand: {
      kind: "image",
      src: getLocalCompanyLogo("GRG COTSPIN"),
      alt: "GRG Cotspin Logo",
      style: { borderRadius: "4px" },
    },
  },
  {
    name: "HONDA INDIA",
    industry: "Automotive",
    capacity: "2,500 kWp Solar",
    description: "2023 AUTOMOTIVE Global brand. Highest name recognition.",
    image: "/imgs/projects/honda-india.jpg",
    brand: {
      kind: "image",
      src: getLocalCompanyLogo("HONDA INDIA"),
      alt: "Honda India Logo",
    },
  },
  {
    name: "OTSUKA PHARMACEUTICALS",
    industry: "Pharma",
    capacity: "2,024 kWp Solar",
    description: "2018 PHARMA 7 yrs live. Longevity proof. Still above P50 in 2025.",
    image: "/imgs/projects/otsuka-pharmaceuticals.jpg",
    brand: {
      kind: "image",
      src: getLocalCompanyLogo("OTSUKA PHARMACEUTICALS"),
      alt: "Otsuka Pharmaceuticals Logo",
    },
  },
  {
    name: "WELSPUN GROUP",
    industry: "Textiles",
    capacity: "2,000 kWp Solar",
    description: "2024 TEXTILES National conglomerate. Scale and recency.",
    image: "/imgs/projects/welspun-group.jpg",
    brand: {
      kind: "image",
      src: getLocalCompanyLogo("WELSPUN GROUP"),
      alt: "Welspun Group Logo",
    },
  },
  {
    name: "SIEMENS ENERGY",
    industry: "Engineering",
    capacity: "1,300 kWp Solar",
    description: "2023 ENGINEERING Global MNC. Strongest credibility signal.",
    image: "/imgs/projects/siemens-energy.jpg",
    brand: {
      kind: "image",
      src: getLocalCompanyLogo("SIEMENS ENERGY"),
      alt: "Siemens Energy Logo",
    },
  },
  {
    name: "BAXTER PHARMA",
    industry: "Pharma",
    capacity: "1,300 kWp Solar",
    description: "2024 PHARMA Global pharma MNC. GMP-grade proof.",
    image: "/imgs/projects/baxter-pharma.jpg",
    brand: {
      kind: "image",
      src: getLocalCompanyLogo("BAXTER PHARMA"),
      alt: "Baxter Pharma Logo",
    },
  },
  {
    name: "COLGATE-PALMOLIVE",
    industry: "FMCG",
    capacity: "250 kWp Solar",
    description: "2025 FMCG Household global name. FMCG diversity.",
    image: "/imgs/projects/colgate-palmolive.jpg",
    brand: {
      kind: "image",
      src: getLocalCompanyLogo("COLGATE-PALMOLIVE"),
      alt: "Colgate-Palmolive Logo",
    },
  },
  {
    name: "AMOL MINECHEM",
    industry: "Chemicals",
    capacity: "1,899 kWp Solar",
    description: "2022-23 CHEMICALS Largest chemicals install. Sector diversity.",
    image: "/imgs/projects/amol-minechem.jpg",
    brand: {
      kind: "image",
      src: getLocalCompanyLogo("AMOL MINECHEM"),
      alt: "Amol Minechem Logo",
    },
  },
  {
    name: "RAVIRAJ FOILS",
    industry: "Manufacturing",
    capacity: "1,899 kWp Solar",
    description: "2022-23 MANUFACTURING Multi-phase proof. Repeat-client signal.",
    image: "/imgs/projects/raviraj-foils.png",
    brand: {
      kind: "image",
      src: getLocalCompanyLogo("RAVIRAJ FOILS"),
      alt: "Raviraj Foils Logo",
    },
  },
  {
    name: "AKASH FASHION",
    industry: "Textiles",
    capacity: "999 kWp Solar",
    description: "2021 TEXTILES Sub-MW to MW scale. Textiles depth.",
    image: "/imgs/projects/akash-fashion.jpg",
    brand: {
      kind: "image",
      src: getLocalCompanyLogo("AKASH FASHION"),
      alt: "Akash Fashion Logo",
    },
  },
  {
    name: "MONGINIS FOODS",
    industry: "Food & Bev",
    capacity: "780 kWp Solar",
    description: "2018 FOOD & BEV Recognisable brand. Food sector coverage.",
    image: "/imgs/projects/monginis-foods.jpg",
    brand: {
      kind: "image",
      src: getLocalCompanyLogo("MONGINIS FOODS"),
      alt: "Monginis Foods Logo",
    },
  },
  {
    name: "ROHAN DYES (RDL)",
    industry: "Chemicals",
    capacity: "325 kWp Solar",
    description: "2020 CHEMICALS Chemical sector breadth. Steady delivery.",
    image: "/imgs/projects/rohan-dyes-rdl.jpg",
    brand: {
      kind: "image",
      src: getLocalCompanyLogo("ROHAN DYES (RDL)"),
      alt: "Rohan Dyes Logo",
    },
  },
  {
    name: "FUJI SILVERTECH",
    industry: "Manufacturing",
    capacity: "528.5 kWp Solar",
    description: "2025 MANUFACTURING Most recent. Above yield.",
    image: "/imgs/projects/fuji-silvertech.jpg",
    brand: {
      kind: "image",
      src: getLocalCompanyLogo("FUJI SILVERTECH"),
      alt: "Fuji SilverTech Logo",
    },
  },
  {
    name: "SOMANY EVERGREEN",
    industry: "Tiles / MFG",
    capacity: "900 kWp Solar",
    description: "2022 TILES / MFG Known Indian brand. Tiles sector unique.",
    image: "/imgs/projects/somany-evergreen.jpg",
    brand: {
      kind: "image",
      src: getLocalCompanyLogo("SOMANY EVERGREEN"),
      alt: "Somany Evergreen Logo",
    },
  },
  {
    name: "BUSCH VACUUM",
    industry: "Engineering",
    capacity: "72 kWp Solar + HVAC",
    description: "2020 ENGINEERING Dual-service Solar and HVAC project.",
    image: "/imgs/projects/busch-vacuum.jpg",
    brand: {
      kind: "image",
      src: getLocalCompanyLogo("BUSCH VACUUM"),
      alt: "Busch Vacuum Logo",
    },
  },
];

export function fallbackProjectMedia(label, variant = "photo") {
  const safeLabel = String(label ?? "Project").replace(/&/g, "&amp;");

  if (variant === "logo") {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 160"><rect width="480" height="160" rx="24" fill="#ffffff"/><rect x="8" y="8" width="464" height="144" rx="18" fill="#0f1c2c"/><text x="34" y="72" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="700">ENVIRONOMICS</text><text x="34" y="112" fill="#93c5fd" font-family="Arial, sans-serif" font-size="14">${safeLabel}</text></svg>`)}`;
  }

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f1c2c"/><stop offset="100%" stop-color="#1572C8"/></linearGradient></defs><rect width="1200" height="800" fill="url(#bg)"/><text x="80" y="120" fill="#ffffff" font-family="Arial, sans-serif" font-size="38" font-weight="700">ENVIRONOMICS</text><text x="80" y="720" fill="#ffffff" font-family="Arial, sans-serif" font-size="54" font-weight="700">${safeLabel}</text></svg>`)}`;
}

export function handleProjectMediaError(event, label, variant = "photo") {
  const fallback = fallbackProjectMedia(label, variant);
  if (event.currentTarget.src !== fallback) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallback;
  }
}

export function sortIndustries(values) {
  return [...values].sort((left, right) => {
    const leftIndex = industryOrder.indexOf(left);
    const rightIndex = industryOrder.indexOf(right);
    const safeLeftIndex = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
    const safeRightIndex = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;

    if (safeLeftIndex !== safeRightIndex) {
      return safeLeftIndex - safeRightIndex;
    }

    return left.localeCompare(right);
  });
}

export function normalizeIndustry(value, fallback = "Industrial") {
  const text = String(value ?? "").trim();

  if (!text) {
    return fallback;
  }

  const normalized = text
    .toUpperCase()
    .replace(/&/g, "AND")
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();

  const compact = normalized.replace(/\s+/g, " ");

  const normalizedLabels = Array.from(industryLabels.entries()).map(([token, label]) => [
    token
      .toUpperCase()
      .replace(/&/g, "AND")
      .replace(/[^A-Z0-9]+/g, " ")
      .trim(),
    label,
  ]);

  for (const [normalizedToken, label] of normalizedLabels) {
    if (compact === normalizedToken) {
      return label;
    }
  }

  for (const [normalizedToken, label] of normalizedLabels) {
    if (compact === normalizedToken || compact.includes(normalizedToken)) {
      return label;
    }
  }

  return text;
}

export function normalizeProjectSlug(value = "") {
  return (
    String(value ?? "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "project"
  );
}

function getProjectYear(value = "", fallback = "Live") {
  const matchedYear = String(value ?? "").match(/\b(20\d{2})\b/);
  return matchedYear?.[1] ?? fallback;
}

function normalizeFallbackProject(project, index = 0) {
  const name = String(project?.name ?? "").trim() || `Project ${index + 1}`;
  const description = String(project?.description ?? project?.meta ?? "").trim();

  return {
    ...project,
    id: project?.id ?? `fallback-project-${index}`,
    slug: normalizeProjectSlug(project?.slug || name),
    name,
    industry: normalizeIndustry(project?.industry),
    capacity: String(project?.capacity ?? project?.projectSize ?? "").trim(),
    description,
    year: String(project?.year ?? "").trim() || getProjectYear(description),
    displayOrder: Number(project?.displayOrder ?? index + 1),
    image: project?.image || fallbackProjectMedia(`${name} Project`),
    listingImage: project?.listingImage || project?.image || fallbackProjectMedia(`${name} Project`),
    brand: {
      kind: "image",
      ...(project?.brand || {}),
      src:
        getLocalCompanyLogo(name, project?.brand?.src) ||
        fallbackProjectMedia(name, "logo"),
      alt: project?.brand?.alt || `${name} Logo`,
    },
    galleryImages: Array.isArray(project?.galleryImages) ? project.galleryImages : [],
    isFallbackProject: true,
  };
}

export function getFallbackProjects() {
  return fallbackProjects.map(normalizeFallbackProject);
}

export function getProjectCaseStudyHref(project) {
  const slug =
    typeof project === "string"
      ? normalizeProjectSlug(project)
      : normalizeProjectSlug(project?.slug ?? project?.name ?? "");

  return `/projects/case-study?project=${encodeURIComponent(slug)}`;
}

function normalizeMediaItem(media, fallbackAlt = "") {
  return {
    url: resolveStrapiMediaUrl(media?.url),
    alternativeText: String(media?.alternativeText ?? "").trim() || fallbackAlt,
  };
}

function normalizeGalleryImages(project) {
  const images = Array.isArray(project?.galleryImages) ? project.galleryImages : [];

  return images
    .map((image, index) => {
      const media = normalizeMediaItem(image, `${project.name} site image ${index + 1}`);

      return {
        id: image.id ?? `${project.slug}-gallery-${index + 1}`,
        src: media.url,
        alt: media.alternativeText,
      };
    })
    .filter((image) => image.src);
}

export function normalizeProjectFromApi(project, index = 0) {
  const name = String(project?.name ?? "").trim() || `Project ${index + 1}`;
  const slug = normalizeProjectSlug(project?.slug || name);
  const coverImage = normalizeMediaItem(project?.coverImage, `${name} project`);
  const logo = normalizeMediaItem(project?.logo, `${name} logo`);
  const localLogo = getLocalCompanyLogo(name);

  return {
    id: project?.id ?? `project-${index}`,
    slug,
    name,
    industry: normalizeIndustry(project?.industry),
    capacity: String(project?.projectSize ?? "").trim(),
    description: String(project?.description ?? "").trim(),
    year: String(project?.year ?? "").trim() || "Live",
    displayOrder: Number(project?.displayOrder ?? index + 1),
    image: coverImage.url || fallbackProjectMedia(`${name} Project`),
    listingImage: coverImage.url || fallbackProjectMedia(`${name} Project`),
    brand: {
      kind: "image",
      src: logo.url || localLogo || fallbackProjectMedia(name, "logo"),
      alt: logo.alternativeText || `${name} Logo`,
    },
    galleryImages: normalizeGalleryImages({ ...project, name, slug }),
  };
}

function mergeProjectsWithFallback(apiProjects) {
  const mergedBySlug = new Map();

  getFallbackProjects().forEach((project) => {
    mergedBySlug.set(project.slug, project);
  });

  apiProjects.forEach((project, index) => {
    try {
      const normalizedProject = normalizeProjectFromApi(project, index);
      const fallbackProject = mergedBySlug.get(normalizedProject.slug);

      mergedBySlug.set(normalizedProject.slug, {
        ...fallbackProject,
        ...normalizedProject,
        image: normalizedProject.image || fallbackProject?.image,
        listingImage:
          normalizedProject.listingImage || fallbackProject?.listingImage || fallbackProject?.image,
        brand: {
          ...(fallbackProject?.brand || {}),
          ...(normalizedProject.brand || {}),
          src:
            normalizedProject.brand?.src ||
            fallbackProject?.brand?.src ||
            fallbackProjectMedia(normalizedProject.name, "logo"),
        },
        galleryImages: normalizedProject.galleryImages?.length
          ? normalizedProject.galleryImages
          : fallbackProject?.galleryImages || [],
        isFallbackProject: false,
      });
    } catch (error) {
      console.warn("Skipping invalid project from backend:", error);
    }
  });

  return Array.from(mergedBySlug.values()).sort((left, right) => {
    const leftOrder = Number.isFinite(left.displayOrder) ? left.displayOrder : Number.MAX_SAFE_INTEGER;
    const rightOrder = Number.isFinite(right.displayOrder)
      ? right.displayOrder
      : Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return String(left.name ?? "").localeCompare(String(right.name ?? ""));
  });
}

export async function fetchProjects() {
  try {
    const response = await fetchStrapiJson("/api/public/projects");
    const projects = Array.isArray(response?.data) ? response.data : [];
    return mergeProjectsWithFallback(projects);
  } catch (error) {
    console.warn("Using fallback projects because the backend project list failed:", error);
    return getFallbackProjects();
  }
}

export async function fetchProjectBySlug(slug) {
  const normalizedSlug = normalizeProjectSlug(slug);
  const fallbackProject = getFallbackProjects().find((project) => project.slug === normalizedSlug);

  try {
    const response = await fetchStrapiJson(`/api/public/projects/${encodeURIComponent(normalizedSlug)}`);
    return response?.data
      ? mergeProjectsWithFallback([response.data]).find((project) => project.slug === normalizedSlug) ??
          normalizeProjectFromApi(response.data)
      : fallbackProject ?? null;
  } catch (error) {
    console.warn("Using fallback project because the backend project detail failed:", error);
    return fallbackProject ?? null;
  }
}
