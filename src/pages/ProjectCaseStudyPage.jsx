import { useMemo } from "react";
import { usePublicContent } from "../context/PublicContentContext";
import { getProjectBySlug, handleProjectMediaError } from "../lib/projectPortfolio";

const projectGalleryAssetModules = {
  ...import.meta.glob("../../imgs/AKASH FASHION IMAGE *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/AMOL MINECHEM IMAGE *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/BAXTER IMAGE *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/BAXTER IMAGES *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/BUSCH VACUUM IMAGE *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/BUSH VACUUM IMAGE *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/COLGATE IMAGES *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/FUJI SILVERTECH IMAGE *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/GRG IMAGE *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/HONDA IMAGE *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/MONGINIES IMAGE *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/OTSUKA IMAGE *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/RAVIRAJ FOILS IMAGE *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/ROHAN DYES IMAGE *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/ROHAN DYES  IMAGE *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/SIEMENS IMAGE *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/SOMAY IMAGE *.jpeg", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../imgs/WELSPUN IMAGE *.jpeg", {
    eager: true,
    import: "default",
  }),
};

const projectGalleryPrefixes = {
  "grg-cotspin": ["GRG IMAGE"],
  "honda-india": ["HONDA IMAGE"],
  "otsuka-pharmaceuticals": ["OTSUKA IMAGE"],
  "welspun-group": ["WELSPUN IMAGE"],
  "siemens-energy": ["SIEMENS IMAGE"],
  "baxter-pharma": ["BAXTER IMAGE", "BAXTER IMAGES"],
  "colgate-palmolive": ["COLGATE IMAGE", "COLGATE IMAGES"],
  "amol-minechem": ["AMOL MINECHEM IMAGE"],
  "raviraj-foils": ["RAVIRAJ FOILS IMAGE"],
  "akash-fashion": ["AKASH FASHION IMAGE"],
  "monginis-foods": ["MONGINIES IMAGE", "MONGINIS IMAGE"],
  "rohan-dyes-rdl": ["ROHAN DYES IMAGE"],
  "fuji-silvertech": ["FUJI SILVERTECH IMAGE"],
  "somany-evergreen": ["SOMAY IMAGE", "SOMANY IMAGE"],
  "busch-vacuum": ["BUSCH VACUUM IMAGE", "BUSH VACUUM IMAGE"],
};

const pageStyles = `
  .case-study-shell {
    background:
      radial-gradient(circle at top left, rgba(21, 114, 200, 0.14), transparent 34%),
      linear-gradient(180deg, #edf4fb 0%, #f8fbff 100%);
  }
  .case-study-paper {
    box-shadow: 0 28px 80px rgba(15, 23, 42, 0.14);
  }
`;

function getRequestedProjectSlug() {
  if (typeof window === "undefined") {
    return "";
  }

  return new URLSearchParams(window.location.search).get("project") ?? "";
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white px-5 py-4">
      <p className="helixa-bold text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="optika-medium mt-2 text-lg leading-tight text-on-surface">{value}</p>
    </div>
  );
}

function getAssetFilename(path = "") {
  return path.split("/").pop() ?? "";
}

function normalizeGalleryAssetLabel(value = "") {
  return String(value ?? "")
    .replace(/\.[^.]+$/, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function getGalleryImageOrder(value = "") {
  const matchedNumber = normalizeGalleryAssetLabel(value).match(/(\d+)(?!.*\d)/);
  return matchedNumber ? Number.parseInt(matchedNumber[1], 10) : Number.MAX_SAFE_INTEGER;
}

function getProjectGalleryImages(project) {
  const slug = project?.slug ?? "";
  const prefixes = projectGalleryPrefixes[slug] ?? [];

  if (!prefixes.length) {
    return [];
  }

  return Object.entries(projectGalleryAssetModules)
    .map(([path, src]) => {
      const filename = getAssetFilename(path);
      const normalizedName = normalizeGalleryAssetLabel(filename);

      return {
        src,
        filename,
        normalizedName,
      };
    })
    .filter((item) => prefixes.some((prefix) => item.normalizedName.startsWith(prefix)))
    .sort((left, right) => {
      const orderDifference = getGalleryImageOrder(left.filename) - getGalleryImageOrder(right.filename);
      if (orderDifference !== 0) {
        return orderDifference;
      }

      return left.filename.localeCompare(right.filename);
    })
    .map((item, index) => ({
      ...item,
      id: `${slug}-gallery-${index + 1}`,
      alt: `${project.name} site image ${index + 1}`,
    }));
}

export default function ProjectCaseStudyPage() {
  const { content, status } = usePublicContent();
  const requestedSlug = getRequestedProjectSlug();
  const fallbackProject = useMemo(() => getProjectBySlug(null, requestedSlug), [requestedSlug]);
  const project = useMemo(
    () => getProjectBySlug(content, requestedSlug) ?? fallbackProject,
    [content, fallbackProject, requestedSlug]
  );
  const projectGallery = useMemo(() => getProjectGalleryImages(project), [project]);
  const caseStudyImages = useMemo(() => {
    if (!project) {
      return [];
    }

    const primaryImage = {
      id: `${project.slug ?? "project"}-cover`,
      src: project.image,
      alt: `${project.name} project`,
      isPrimary: true,
    };

    const seenSources = new Set([project.image]);
    const galleryImages = projectGallery.filter((image) => {
      if (seenSources.has(image.src)) {
        return false;
      }

      seenSources.add(image.src);
      return true;
    });

    return [primaryImage, ...galleryImages];
  }, [project, projectGallery]);
  const isLoading = !fallbackProject && (status === "idle" || status === "loading");

  return (
    <div className="case-study-shell min-h-screen font-body text-on-surface selection:bg-primary/20">
      <style>{pageStyles}</style>

      <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <a
              href="/projects"
              className="helixa-bold inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-on-surface shadow-sm transition hover:border-primary/30 hover:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to projects</span>
            </a>

            <p className="helixa-bold text-xs uppercase tracking-[0.18em] text-slate-500">
              Project case study
            </p>
          </div>

          {isLoading ? (
            <div className="case-study-paper rounded-[32px] border border-white/70 bg-white px-6 py-20 text-center sm:px-10">
              <p className="optika-medium text-2xl text-on-surface sm:text-3xl">
                Loading project details...
              </p>
            </div>
          ) : project ? (
            <article className="case-study-paper overflow-hidden rounded-[32px] border border-white/70 bg-white">
              <div className="border-b border-slate-200 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="helixa-bold rounded-full bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.08em] text-primary">
                        {project.industry}
                      </span>
                      <span className="helixa-bold rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.08em] text-slate-700">
                        {project.year}
                      </span>
                    </div>

                    <h1 className="optika-bold text-4xl leading-[1.02] text-primary sm:text-5xl lg:text-[4rem]">
                      {project.name}
                    </h1>
                    <p className="optika-medium mt-4 text-xl text-on-surface sm:text-2xl">
                      {project.capacity}
                    </p>
                  </div>

                  <div className="flex w-full max-w-[220px] items-center justify-center rounded-[24px] border border-slate-200 bg-slate-50 px-6 py-5">
                    <img
                      src={project.brand.src}
                      alt={project.brand.alt ?? `${project.name} logo`}
                      className="max-h-16 w-auto max-w-full object-contain"
                      style={project.brand.style}
                      loading="lazy"
                      decoding="async"
                      onError={(event) => handleProjectMediaError(event, project.name, "logo")}
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 sm:px-8 lg:px-10 lg:py-10">
                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
                  <div className="px-4 py-4 sm:px-5 sm:py-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="helixa-bold text-xs uppercase tracking-[0.18em] text-slate-500">
                        Project site images
                      </p>
                      <p className="helixa-bold rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.08em] text-primary shadow-sm">
                        {caseStudyImages.length} total images
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {caseStudyImages.map((image, index) => (
                        <figure
                          key={image.id}
                          className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm"
                        >
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="aspect-[4/3] w-full object-cover"
                            loading={index <= 1 ? "eager" : "lazy"}
                            decoding="async"
                            onError={(event) =>
                              handleProjectMediaError(
                                event,
                                image.isPrimary
                                  ? `${project.name} Project`
                                  : `${project.name} Site Image ${index}`
                              )
                            }
                          />
                        </figure>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailItem label="Company" value={project.name} />
                  <DetailItem label="Industry" value={project.industry} />
                  <DetailItem label="Commissioned" value={project.year} />
                </div>

                <div className="mt-4 rounded-[28px] border border-slate-200 bg-slate-50 px-6 py-6">
                  <p className="helixa-bold text-xs uppercase tracking-[0.18em] text-slate-500">
                    Project overview
                  </p>
                  <p className="helixa-regular mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">
                    {project.description}
                  </p>
                </div>
              </div>
            </article>
          ) : (
            <div className="case-study-paper rounded-[32px] border border-white/70 bg-white px-6 py-16 text-center sm:px-10">
              <h1 className="optika-bold text-3xl text-on-surface sm:text-4xl">
                Case study not found
              </h1>
              <p className="helixa-regular mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                The selected project could not be found. Return to the projects page and open a
                case study from the live portfolio list.
              </p>
              <a
                href="/projects"
                className="helixa-bold mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm text-white transition hover:bg-primary/90"
              >
                <span>View all projects</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
