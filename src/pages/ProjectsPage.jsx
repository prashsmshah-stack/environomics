import { useEffect, useMemo, useRef, useState } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { usePublicContent } from "../context/PublicContentContext";
import {
  getProjectCaseStudyHref,
  getPublishedProjects,
  handleProjectMediaError,
  sortIndustries,
} from "../lib/projectPortfolio";

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

function BrandLogo({ brand, name }) {
  return (
    <img
      className="tl-logo"
      src={brand.src}
      alt={brand.alt ?? `${name} Logo`}
      style={brand.style}
      loading="lazy"
      decoding="async"
      onError={(event) => handleProjectMediaError(event, name, "logo")}
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
        onError={(event) => handleProjectMediaError(event, `${project.name} Project`)}
      />
    </div>
  );
}

export default function ProjectsPage() {
  const { content } = usePublicContent();
  const filterRef = useRef(null);
  const [isIndustryMenuOpen, setIsIndustryMenuOpen] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState([]);

  const projects = useMemo(() => getPublishedProjects(content), [content]);

  const industries = useMemo(
    () =>
      sortIndustries(
        Array.from(
          new Set(
            projects
              .map((project) => String(project.industry ?? "").trim() || "Industrial")
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
              {filteredProjects.map((project, index) => (
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
                        {project.year}
                      </span>
                    </div>
                  </div>

                  <h3 className="tl-name mb-3" title={project.name}>
                    {project.name}
                  </h3>

                  <p className="optika-medium mb-5 text-lg text-primary sm:text-xl">
                    {project.capacity}
                  </p>

                  <a
                    href={getProjectCaseStudyHref(project)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Read the full case study for ${project.name}`}
                    className="helixa-bold mt-auto inline-flex items-center justify-between gap-3 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary transition hover:bg-primary hover:text-white"
                  >
                    <span>Read full case study</span>
                    <span className="material-symbols-outlined text-lg">arrow_outward</span>
                  </a>
                </article>
              ))}
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
