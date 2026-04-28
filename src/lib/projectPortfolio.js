import { resolveMediaUrl } from "./mediaUrl";
import { normalizeSingleLineText } from "./contentLayout";
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
  ["TEXTILES", "Textiles"],
  ["ENGINEERING", "Engineering"],
  ["CHEMICALS", "Chemicals"],
  ["MANUFACTURING", "Manufacturing"],
  ["FOOD & BEV", "Food & Bev"],
  ["FMCG", "FMCG"],
  ["TILES / MFG", "Tiles / MFG"],
]);

export const fallbackProjects = [
  {
    name: "GRG COTSPIN",
    industry: "Textiles",
    capacity: "4,200 kWp Solar",
    meta: "2023  TEXTILES  Largest single install. Anchor proof point.",
    image: "/imgs/projects/grg-cotspin.jpg",
    brand: {
      kind: "image",
      src: "https://www.environomics.net.in/wp-content/uploads/2025/02/2023_GRG_cotspin.jpeg",
      alt: "GRG Cotspin Logo",
      style: { borderRadius: "4px", objectFit: "cover" },
    },
  },
  {
    name: "HONDA INDIA",
    industry: "Automotive",
    capacity: "2,500 kWp Solar",
    meta: "2023  AUTOMOTIVE  Global brand. Highest name recognition.",
    image: "/imgs/projects/honda-india.jpg",
    brand: {
      kind: "image",
      src: "https://www.environomics.net.in/wp-content/uploads/2025/02/2023_honda-Photoroom.webp",
      alt: "Honda India Logo",
    },
  },
  {
    name: "OTSUKA PHARMACEUTICALS",
    industry: "Pharma",
    capacity: "2,024 kWp Solar",
    meta: "2018  PHARMA  7 yrs live  Longevity proof. Still above P50 in 2025.",
    image: "/imgs/projects/otsuka-pharmaceuticals.jpg",
    brand: {
      kind: "image",
      src: "https://www.environomics.net.in/wp-content/uploads/2024/02/otsuka.png",
      alt: "Otsuka Pharmaceuticals Logo",
    },
  },
  {
    name: "WELSPUN GROUP",
    industry: "Textiles",
    capacity: "2,000 kWp Solar",
    meta: "2024  TEXTILES  National conglomerate. Scale + recency.",
    image: "/imgs/projects/welspun-group.jpg",
    brand: {
      kind: "image",
      src: "https://www.environomics.net.in/wp-content/uploads/2025/02/2023_welspun-Photoroom.webp",
      alt: "Welspun Group Logo",
    },
  },
  {
    name: "SIEMENS ENERGY",
    industry: "Engineering",
    capacity: "1,300 kWp Solar",
    meta: "2023  ENGINEERING  Global MNC. Strongest credibility signal.",
    image: "/imgs/projects/siemens-energy.jpg",
    brand: {
      kind: "image",
      src: "https://www.environomics.net.in/wp-content/uploads/2024/02/siemens.jpg",
      alt: "Siemens Energy Logo",
    },
  },
  {
    name: "BAXTER PHARMA",
    industry: "Pharma",
    capacity: "1,300 kWp Solar",
    meta: "2024  PHARMA  Global pharma MNC. GMP-grade proof.",
    image: "/imgs/projects/baxter-pharma.jpg",
    brand: {
      kind: "image",
      src: "/imgs/company-logos/baxter-pharma.png",
      alt: "Baxter Pharma Logo",
    },
  },
  {
    name: "COLGATE-PALMOLIVE",
    industry: "FMCG",
    capacity: "250 kWp Solar",
    meta: "2025  FMCG  Household global name. FMCG diversity.",
    image: "/imgs/projects/colgate-palmolive.jpg",
    brand: {
      kind: "image",
      src: "/imgs/company-logos/colgate-palmolive.png",
      alt: "Colgate-Palmolive Logo",
    },
  },
  {
    name: "AMOL MINECHEM",
    industry: "Chemicals",
    capacity: "1,899 kWp Solar",
    meta: "2022-23  CHEMICALS  Largest chemicals install. Sector diversity.",
    image: "/imgs/projects/amol-minechem.jpg",
    brand: {
      kind: "image",
      src: "/imgs/company-logos/amol-minechem.jpg",
      alt: "Amol Minechem Logo",
    },
  },
  {
    name: "RAVIRAJ FOILS",
    industry: "Manufacturing",
    capacity: "1,899 kWp Solar",
    meta: "2022-23  MANUFACTURING  Multi-phase proof. Repeat-client signal.",
    image: "/imgs/projects/raviraj-foils.png",
    brand: {
      kind: "image",
      src: "https://www.ravirajfoils.com/images/logo.png",
      alt: "Raviraj Foils Logo",
    },
  },
  {
    name: "AKASH FASHION",
    industry: "Textiles",
    capacity: "999 kWp Solar",
    meta: "2021  TEXTILES  Sub-MW to MW scale. Textiles depth.",
    image: "/imgs/projects/akash-fashion.jpg",
    brand: {
      kind: "image",
      src: "https://www.environomics.net.in/wp-content/uploads/2024/01/akashfashion.png",
      alt: "Akash Fashion Logo",
    },
  },
  {
    name: "MONGINIS FOODS",
    industry: "Food & Bev",
    capacity: "780 kWp Solar",
    meta: "2018  FOOD & BEV  Recognisable brand. Food sector coverage.",
    image: "/imgs/projects/monginis-foods.jpg",
    brand: {
      kind: "image",
      src: "https://www.environomics.net.in/wp-content/uploads/2025/02/2017_monginis-Photoroom.webp",
      alt: "Monginis Foods Logo",
    },
  },
  {
    name: "ROHAN DYES (RDL)",
    industry: "Chemicals",
    capacity: "325 kWp Solar",
    meta: "2020  CHEMICALS  Chemical sector breadth. Steady delivery.",
    image: "/imgs/projects/rohan-dyes-rdl.jpg",
    brand: {
      kind: "image",
      src: "https://www.environomics.net.in/wp-content/uploads/2024/02/rohan-dyes-rdil-logonew.png",
      alt: "Rohan Dyes Logo",
    },
  },
  {
    name: "FUJI SILVERTECH",
    industry: "Manufacturing",
    capacity: "528.5 kWp Solar",
    meta: "2025  MANUFACTURING  Most recent. Above yield.",
    image: "/imgs/projects/fuji-silvertech.jpg",
    brand: {
      kind: "image",
      src: "/imgs/company-logos/fuji-silvertech.png",
      alt: "Fuji SilverTech Logo",
    },
  },
  {
    name: "SOMANY EVERGREEN",
    industry: "Tiles / MFG",
    capacity: "900 kWp Solar",
    meta: "2022  TILES / MFG  Known Indian brand. Tiles sector unique.",
    image: "/imgs/projects/somany-evergreen.jpg",
    brand: {
      kind: "image",
      src: "https://www.environomics.net.in/wp-content/uploads/2024/02/Somany-Evergreen.png",
      alt: "Somany Evergreen Logo",
    },
  },
  {
    name: "BUSCH VACUUM",
    industry: "Engineering",
    capacity: "72 kWp Solar + HVAC",
    meta: "2020  ENGINEERING  Dual-service (Solar + HVAC).",
    image: "/imgs/projects/busch-vacuum.jpg",
    brand: {
      kind: "image",
      src: "/imgs/company-logos/busch-vacuum.png",
      alt: "Busch Vacuum Logo",
    },
  },
];

export function fallbackProjectMedia(label, variant = "photo") {
  const safeLabel = label.replace(/&/g, "&amp;");

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

export function extractIndustryFromText(value = "") {
  const normalized = String(value ?? "").toUpperCase();

  for (const [token, label] of industryLabels.entries()) {
    if (normalized.includes(token)) {
      return label;
    }
  }

  return "Industrial";
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

export function getProjectYear(value = "", fallback = "Live") {
  const matchedYear = String(value ?? "").match(/\b(20\d{2})\b/);
  return matchedYear?.[1] ?? fallback;
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

export function getProjectCaseStudyHref(project) {
  const slug =
    typeof project === "string"
      ? normalizeProjectSlug(project)
      : normalizeProjectSlug(project?.slug ?? project?.name ?? "");

  return `/projects/case-study?project=${encodeURIComponent(slug)}`;
}

export function getPublishedProjects(content) {
  const backendProjects =
    Array.isArray(content?.projects) && content.projects.length
      ? content.projects.filter((project) => {
          const status = String(project?.status ?? "").trim().toLowerCase();
          return !status || status === "published";
        })
      : null;

  if (!backendProjects) {
    return fallbackProjects.map((project, index) => {
      const description = project.description ?? project.meta ?? "";
      const preferredLogo = getLocalCompanyLogo(project.name, project.brand?.src);

      return {
        ...project,
        id: `project-${index}`,
        slug: normalizeProjectSlug(project.name),
        description,
        year: getProjectYear(description),
        brand: {
          ...project.brand,
          src: preferredLogo,
        },
      };
    });
  }

  const presentationByName = new Map(fallbackProjects.map((project) => [project.name, project]));

  return backendProjects.map((project, index) => {
    const name = String(project.name ?? "").trim();
    const presentation = presentationByName.get(name);
    const descriptionSource =
      project.description ?? project.meta ?? presentation?.description ?? presentation?.meta ?? "";
    const companyLogo = resolveMediaUrl(project.companyLogo ?? "");
    const normalizedName = normalizeSingleLineText(name || presentation?.name, `Project ${index + 1}`);
    const normalizedDescription = normalizeSingleLineText(
      descriptionSource,
      presentation?.description ?? presentation?.meta ?? ""
    );
    const localCompanyLogo = getLocalCompanyLogo(normalizedName);

    return {
      id: project.id ?? `project-${index}`,
      slug: normalizeProjectSlug(normalizedName),
      name: normalizedName,
      industry: normalizeSingleLineText(
        project.industry,
        presentation?.industry ?? extractIndustryFromText(descriptionSource)
      ),
      capacity: normalizeSingleLineText(project.capacity, presentation?.capacity || ""),
      description: normalizedDescription,
      year: getProjectYear(normalizedDescription),
      image:
        presentation?.image ||
        resolveMediaUrl(project.image ?? "") ||
        fallbackProjectMedia(`${name || "Project"} Project`),
      brand: {
        kind: "image",
        src:
          localCompanyLogo ||
          companyLogo ||
          presentation?.brand?.src ||
          fallbackProjectMedia(name || "Project", "logo"),
        alt: presentation?.brand?.alt ?? `${name || "Project"} Logo`,
        style: presentation?.brand?.style,
      },
    };
  });
}

export function getProjectBySlug(content, slug) {
  const normalizedSlug = normalizeProjectSlug(slug);
  return getPublishedProjects(content).find((project) => project.slug === normalizedSlug) ?? null;
}
