import { useEffect, useMemo, useRef, useState } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { usePublicContent } from "../context/PublicContentContext";
import { resolveMediaUrl } from "../lib/api";
import { normalizeSingleLineText } from "../lib/contentLayout";

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

const fallbackProjects = [
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
    brand: { kind: "image", src: "/imgs/company-logos/baxter-pharma.png", alt: "Baxter Pharma Logo" },
  },
  {
    name: "COLGATE-PALMOLIVE",
    industry: "FMCG",
    capacity: "250 kWp Solar",
    meta: "2025  FMCG  Household global name. FMCG diversity.",
    image: "/imgs/projects/colgate-palmolive.jpg",
    brand: { kind: "image", src: "/imgs/company-logos/colgate-palmolive.png", alt: "Colgate-Palmolive Logo" },
  },
  {
    name: "AMOL MINECHEM",
    industry: "Chemicals",
    capacity: "1,899 kWp Solar",
    meta: "2022-23  CHEMICALS  Largest chemicals install. Sector diversity.",
    image: "/imgs/projects/amol-minechem.jpg",
    brand: { kind: "image", src: "/imgs/company-logos/amol-minechem.jpg", alt: "Amol Minechem Logo" },
  },
  {
    name: "RAVIRAJ FOILS",
    industry: "Manufacturing",
    capacity: "1,899 kWp Solar",
    meta: "2022-23  MANUFACTURING  Multi-phase proof. Repeat-client signal.",
    image: "/imgs/projects/raviraj-foils.png",
    brand: { kind: "image", src: "https://www.ravirajfoils.com/images/logo.png", alt: "Raviraj Foils Logo" },
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
    brand: { kind: "image", src: "/imgs/company-logos/fuji-silvertech.png", alt: "Fuji SilverTech Logo" },
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
    brand: { kind: "image", src: "/imgs/company-logos/busch-vacuum.png", alt: "Busch Vacuum Logo" },
  },
];

const pageStyles = `
  .glass-lift-card {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(226, 232, 240, 0.95) !important;
    background-color: rgba(255, 255, 255, 0.98) !important;
    transition: transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s cubic-bezier(.4,0,.2,1), border-color .35s;
  }
  .glass-lift-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 28px 55px -24px rgba(15, 23, 42, 0.32);
    border-color: rgba(21, 114, 200, 0.28) !important;
  }
  @keyframes shineSwipe {
    0% { left: -75%; opacity: 1; }
    100% { left: 130%; opacity: 1; }
  }
  .tl-section {
    background: #fff;
    padding: 0 40px 100px;
  }
  .tl-outer {
    position: relative;
    max-width: 1400px;
    margin: 0 auto;
  }
  .tl-img-wrap {
    position: relative;
    overflow: hidden;
    border-radius: 18px;
    isolation: isolate;
  }
  .tl-img {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    border-radius: 18px;
    display: block;
    transition: transform .45s ease, box-shadow .45s ease;
  }
  .tl-img-wrap:hover .tl-img {
    transform: scale(1.04);
  }
  .tl-img-wrap::before {
    content: '';
    position: absolute;
    top: 0;
    left: -75%;
    width: 50%;
    height: 100%;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.45) 50%, transparent 100%);
    transform: skewX(-15deg);
    z-index: 2;
    opacity: 0;
    pointer-events: none;
  }
  .tl-img-wrap:hover::before {
    animation: shineSwipe .65s ease forwards;
  }
  .tl-logo {
    height: 38px;
    width: auto;
    max-width: 130px;
    object-fit: contain;
    display: block;
  }
  .tl-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 800;
    font-size: 1.35rem;
    color: #0d1117;
    line-height: 1.18;
    letter-spacing: -.02em;
    margin: 0;
  }
  @media (max-width: 1024px) {
    .tl-section {
      padding: 0 16px 72px;
    }
  }
`;

function fallbackImage(label, variant = "photo") {
  const safeLabel = label.replace(/&/g, "&amp;");

  if (variant === "logo") {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 160"><rect width="480" height="160" rx="24" fill="#ffffff"/><rect x="8" y="8" width="464" height="144" rx="18" fill="#0f1c2c"/><text x="34" y="72" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="700">ENVIRONOMICS</text><text x="34" y="112" fill="#93c5fd" font-family="Arial, sans-serif" font-size="14">${safeLabel}</text></svg>`)}`;
  }

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f1c2c"/><stop offset="100%" stop-color="#1572C8"/></linearGradient></defs><rect width="1200" height="800" fill="url(#bg)"/><text x="80" y="120" fill="#ffffff" font-family="Arial, sans-serif" font-size="38" font-weight="700">ENVIRONOMICS</text><text x="80" y="720" fill="#ffffff" font-family="Arial, sans-serif" font-size="54" font-weight="700">${safeLabel}</text></svg>`)}`;
}

function handleImageError(event, label, variant = "photo") {
  const fallback = fallbackImage(label, variant);
  if (event.currentTarget.src !== fallback) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallback;
  }
}

function extractIndustryFromText(value = "") {
  const normalized = String(value ?? "").toUpperCase();

  for (const [token, label] of industryLabels.entries()) {
    if (normalized.includes(token)) {
      return label;
    }
  }

  return "Industrial";
}

function sortIndustries(values) {
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

function BrandLogo({ brand, name }) {
  return (
    <img
      className="tl-logo"
      src={brand.src}
      alt={brand.alt ?? `${name} Logo`}
      style={brand.style}
      loading="lazy"
      decoding="async"
      onError={(event) => handleImageError(event, name, "logo")}
    />
  );
}

function ProjectImage({ project }) {
  return (
    <div className="tl-img-wrap">
      <img
        className="tl-img"
        src={project.image}
        alt={`${project.name} project`}
        loading="lazy"
        decoding="async"
        onError={(event) => handleImageError(event, `${project.name} Project`)}
      />
    </div>
  );
}

export default function ProjectsPage() {
  const { content } = usePublicContent();
  const filterRef = useRef(null);
  const [isIndustryMenuOpen, setIsIndustryMenuOpen] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState([]);

  const projects = useMemo(() => {
    const backendProjects =
      Array.isArray(content?.projects) && content.projects.length
        ? content.projects.filter((project) => {
            const status = String(project?.status ?? "").trim().toLowerCase();
            return !status || status === "published";
          })
        : null;

    if (!backendProjects) {
      return fallbackProjects.map((project, index) => ({
        ...project,
        id: `project-${index}`,
        description: project.description ?? project.meta ?? "",
      }));
    }

    const presentationByName = new Map(
      fallbackProjects.map((project) => [project.name, project])
    );

    return backendProjects.map((project, index) => {
      const name = String(project.name ?? "").trim();
      const presentation = presentationByName.get(name);
      const descriptionSource =
        project.description ?? project.meta ?? presentation?.description ?? presentation?.meta ?? "";
      const companyLogo = resolveMediaUrl(project.companyLogo ?? "");

      return {
        id: project.id ?? `project-${index}`,
        name: normalizeSingleLineText(name || presentation?.name, `Project ${index + 1}`),
        industry: normalizeSingleLineText(
          project.industry,
          presentation?.industry ?? extractIndustryFromText(descriptionSource)
        ),
        capacity: normalizeSingleLineText(project.capacity, presentation?.capacity || ""),
        description: normalizeSingleLineText(
          descriptionSource,
          presentation?.description ?? presentation?.meta ?? ""
        ),
        image:
          presentation?.image ||
          resolveMediaUrl(project.image ?? "") ||
          fallbackImage(`${name || "Project"} Project`),
        brand: {
          kind: "image",
          src: companyLogo || presentation?.brand?.src || fallbackImage(name || "Project", "logo"),
          alt: presentation?.brand?.alt ?? `${name || "Project"} Logo`,
          style: presentation?.brand?.style,
        },
      };
    });
  }, [content]);

  const industries = useMemo(
    () =>
      sortIndustries(
        Array.from(
          new Set(
            projects
              .map((project) => normalizeSingleLineText(project.industry, "Industrial"))
              .filter(Boolean)
          )
        )
      ),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    if (!selectedIndustries.length) {
      return projects;
    }

    return projects.filter((project) => selectedIndustries.includes(project.industry));
  }, [projects, selectedIndustries]);

  useEffect(() => {
    setSelectedIndustries((current) => {
      const next = current.filter((industry) => industries.includes(industry));
      return next.length === current.length ? current : next;
    });
  }, [industries]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    function handlePointerDown(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsIndustryMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  function toggleIndustry(industry) {
    setSelectedIndustries((current) =>
      current.includes(industry)
        ? current.filter((item) => item !== industry)
        : [...current, industry]
    );
  }

  return (
    <div className="bg-white font-body text-on-surface selection:bg-primary/20">
      <style>{pageStyles}</style>

      <SiteHeader />

      <header className="bg-white px-4 pb-10 pt-24 text-on-surface sm:px-6 sm:pb-12 lg:px-8 lg:pb-14 lg:pt-28 md:pt-32">
        <div className="mx-auto max-w-screen-2xl">
          <div className="text-left">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-5xl">
                  <h1 className="optika-bold text-4xl leading-[1.02] text-primary sm:text-5xl md:text-6xl xl:text-7xl">
                    Global Portfolio
                  </h1>

                  <h2 className="optika-bold mt-4 text-xl leading-tight text-on-surface sm:text-2xl md:text-[2.2rem]">
                    Commissioned with Precision. Performing with Expectation.
                  </h2>
                </div>

                <div ref={filterRef} className="relative lg:ml-8 lg:mt-2 lg:shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsIndustryMenuOpen((current) => !current)}
                    className="helixa-bold inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-on-surface shadow-sm transition hover:border-primary/30 hover:bg-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">filter_alt</span>
                    <span>Industry Filter</span>
                    {selectedIndustries.length ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.72rem] text-primary">
                        {selectedIndustries.length}
                      </span>
                    ) : null}
                    <span
                      className={`material-symbols-outlined text-[18px] transition-transform ${
                        isIndustryMenuOpen ? "rotate-180" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>

                  {isIndustryMenuOpen ? (
                    <div className="absolute right-0 top-full z-20 mt-3 w-[290px] rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_24px_50px_rgba(15,23,42,0.16)]">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="optika-bold text-base text-on-surface">Filter by Industry</p>
                        <button
                          type="button"
                          onClick={() => setSelectedIndustries([])}
                          disabled={!selectedIndustries.length}
                          className="helixa-bold text-xs text-primary transition hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Clear All
                        </button>
                      </div>

                      <div className="space-y-2">
                        {industries.map((industry) => (
                          <label
                            key={industry}
                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm transition hover:border-primary/25 hover:bg-slate-50"
                          >
                            <input
                              type="checkbox"
                              checked={selectedIndustries.includes(industry)}
                              onChange={() => toggleIndustry(industry)}
                              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <span className="helixa-regular text-on-surface">{industry}</span>
                          </label>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsIndustryMenuOpen(false)}
                        className="helixa-bold mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm text-white transition hover:bg-primary/90"
                      >
                        Apply Filters
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              <p className="helixa-regular max-w-none text-base leading-relaxed text-tertiary sm:text-lg lg:text-[1.08rem]">
                Our project portfolio spans over a decade of execution across India&apos;s most
                demanding commercial and industrial environments. Each installation is live,
                operational, and generating returns, not a case study with a soft conclusion. From
                30 kWp rooftop systems to multi megawatt ground mount plants, from pharmaceutical
                grade HVAC to automated compressed air networks, every project below is live,
                operational, and performing.
              </p>

              {selectedIndustries.length ? (
                <div className="flex flex-wrap items-center gap-3">
                  {selectedIndustries.map((industry) => (
                    <button
                      key={industry}
                      type="button"
                      onClick={() => toggleIndustry(industry)}
                      className="helixa-bold inline-flex items-center gap-1 rounded-full bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.08em] text-primary transition hover:bg-primary/15"
                    >
                      <span>{industry}</span>
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <section className="tl-section">
        <div className="tl-outer">
          {filteredProjects.length ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project, index) => {
                const yearMatch = project.description.match(/\b(20\d{2})\b/);
                const year = yearMatch ? yearMatch[1] : "Live";

                return (
                  <article
                    key={project.id ?? project.name}
                    className="glass-lift-card group flex h-full flex-col rounded-[26px] p-6 opacity-0 shadow-[0_16px_45px_rgba(15,23,42,0.06)] animate-fade-in-up"
                    style={{ animationDelay: `${0.04 * (index + 1)}s` }}
                  >
                    <div className="mb-5 overflow-hidden rounded-[18px]">
                      <ProjectImage project={project} />
                    </div>

                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <BrandLogo brand={project.brand} name={project.name} />

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="helixa-bold rounded-full bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.08em] text-primary">
                          {project.industry}
                        </span>
                        <span className="helixa-bold rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.08em] text-slate-700">
                          {year}
                        </span>
                      </div>
                    </div>

                    <h3 className="tl-name mb-3" title={project.name}>
                      {project.name}
                    </h3>

                    <p className="optika-medium mb-3 text-lg text-primary sm:text-xl">
                      {project.capacity}
                    </p>

                    <p className="helixa-regular mb-5 text-sm leading-relaxed text-tertiary">
                      {project.description}
                    </p>

                    <div className="mt-auto inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
                      <span className="material-symbols-outlined text-lg">solar_power</span>
                      <span className="helixa-bold">Commissioned {year}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : projects.length ? (
            <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-slate-50 px-6 py-12 text-center shadow-sm">
              <h3 className="optika-bold text-2xl text-on-surface sm:text-3xl">
                No projects match the selected industries.
              </h3>
              <p className="helixa-regular mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                Try a different industry combination or clear the filters to see the full project
                list again.
              </p>
              <button
                type="button"
                onClick={() => setSelectedIndustries([])}
                className="helixa-bold mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm text-white transition hover:bg-primary/90"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-slate-50 px-6 py-12 text-center shadow-sm">
              <h3 className="optika-bold text-2xl text-on-surface sm:text-3xl">
                Projects will appear here once they are published.
              </h3>
              <p className="helixa-regular mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                Save a project as <strong>Published</strong> from the admin panel to display it on
                the main website.
              </p>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
