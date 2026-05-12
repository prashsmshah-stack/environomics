import { useEffect, useMemo, useState } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { cultureSections } from "../lib/cultureGallery";

function getRequestedCultureSectionId() {
  if (typeof window === "undefined") {
    return "";
  }

  return new URLSearchParams(window.location.search).get("section") ?? "";
}

function fallbackCultureImage(label = "Culture") {
  const safeLabel = label.replace(/&/g, "&amp;");

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0d1b2a"/>
          <stop offset="55%" stop-color="#1572c8"/>
          <stop offset="100%" stop-color="#2aaf6f"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)"/>
      <text x="80" y="126" fill="#ffffff" font-family="Arial, sans-serif" font-size="36" font-weight="700" letter-spacing="4">ENVIRONOMICS</text>
      <text x="80" y="704" fill="#ffffff" font-family="Arial, sans-serif" font-size="66" font-weight="700">${safeLabel}</text>
    </svg>
  `)}`;
}

function handleImageError(event, label) {
  const fallback = fallbackCultureImage(label);
  if (event.currentTarget.src !== fallback) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallback;
  }
}

export default function CulturePage() {
  const [activeSectionId, setActiveSectionId] = useState(() => getRequestedCultureSectionId());
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeSection = useMemo(
    () => cultureSections.find((section) => section.id === activeSectionId) ?? null,
    [activeSectionId]
  );
  const activeImage = activeSection?.images[activeImageIndex] ?? activeSection?.images[0] ?? null;

  function openSection(sectionId) {
    setActiveSectionId(sectionId);
    setActiveImageIndex(0);
  }

  function closeSection() {
    setActiveSectionId("");
    setActiveImageIndex(0);
  }

  function showImageAt(index) {
    if (!activeSection?.images.length) {
      return;
    }

    const imageCount = activeSection.images.length;
    setActiveImageIndex((index + imageCount) % imageCount);
  }

  useEffect(() => {
    if (!activeSection || typeof document === "undefined") {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeSection();
      }

      if (event.key === "ArrowLeft") {
        showImageAt(activeImageIndex - 1);
      }

      if (event.key === "ArrowRight") {
        showImageAt(activeImageIndex + 1);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSection, activeImageIndex]);

  return (
    <div className="bg-white font-body text-on-surface selection:bg-primary/20">
      <SiteHeader />

      <main className="px-4 pb-16 pt-20 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24 xl:px-12">
        <div className="mx-auto max-w-[1240px]">
          <section className="overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#0d1b2a_0%,#155189_52%,#2aaf6f_100%)] px-6 py-14 text-white shadow-[0_24px_70px_rgba(15,47,82,0.18)] sm:px-10 sm:py-16 lg:px-14 lg:py-20">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/16"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Home</span>
            </a>
            <h1 className="mt-8 max-w-4xl text-4xl font-black leading-[0.96] text-white sm:text-5xl lg:text-[4.5rem]">
              Our Culture
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-white/84 sm:text-lg">
              A look at the people, learning, community work, and shared moments that shape
              Environomics beyond project delivery.
            </p>
          </section>

          <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {cultureSections.map((section, index) => (
              <button
                key={section.id}
                type="button"
                onClick={() => openSection(section.id)}
                className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white text-left shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_26px_58px_rgba(15,23,42,0.12)]"
              >
                <div className="relative overflow-hidden bg-slate-100">
                  <img
                    src={section.coverImage || fallbackCultureImage(section.title)}
                    alt={`${section.title} cover`}
                    className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    onError={(event) => handleImageError(event, section.title)}
                  />
                </div>

                <div className="flex flex-1 flex-col px-5 py-5">
                  <h2 className="text-xl font-black tracking-[-0.03em] text-deep-navy">
                    {section.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                    {section.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                    View gallery
                    <span className="material-symbols-outlined text-[18px]">open_in_full</span>
                  </span>
                </div>
              </button>
            ))}
          </section>
        </div>
      </main>

      {activeSection && activeImage ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/88 px-4 py-6 backdrop-blur-sm sm:px-8"
          onClick={closeSection}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeSection.title} gallery`}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-[28px] border border-white/12 bg-white shadow-[0_32px_80px_rgba(15,23,42,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeSection}
              className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-2xl text-deep-navy shadow-sm transition hover:bg-slate-100"
              aria-label="Close gallery"
            >
              &times;
            </button>

            <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#f8fbff_0%,#eef7f1_100%)] px-5 py-5 pr-16 sm:px-7">
              <div className="flex flex-wrap items-start gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_14px_30px_rgba(21,114,200,0.22)]">
                  <span className="material-symbols-outlined text-[26px]">{activeSection.icon}</span>
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                    Culture Gallery
                  </p>
                  <h2 className="mt-1 text-3xl font-black tracking-[-0.04em] text-deep-navy sm:text-4xl">
                    {activeSection.title}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                    {activeSection.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 gap-0 overflow-hidden lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="relative min-h-0 bg-slate-950 px-3 py-4 sm:px-5">
                <img
                  src={activeImage.src}
                  alt={activeImage.alt}
                  className="h-[52vh] w-full rounded-[20px] bg-slate-900 object-contain sm:h-[58vh] lg:h-[64vh]"
                  onError={(event) => handleImageError(event, activeImage.title)}
                />

                {activeSection.images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => showImageAt(activeImageIndex - 1)}
                      className="absolute left-6 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white transition hover:bg-black/55"
                      aria-label="Previous image"
                    >
                      <span className="material-symbols-outlined text-[24px]">chevron_left</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => showImageAt(activeImageIndex + 1)}
                      className="absolute right-6 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white transition hover:bg-black/55"
                      aria-label="Next image"
                    >
                      <span className="material-symbols-outlined text-[24px]">chevron_right</span>
                    </button>
                  </>
                ) : null}

                <div className="mt-4 flex items-center justify-between gap-4 px-1 text-white">
                  <p className="text-sm font-bold">
                    Image {activeImageIndex + 1} of {activeSection.images.length}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/62">
                    {activeSection.title}
                  </p>
                </div>
              </div>

              <div className="min-h-0 overflow-y-auto bg-white p-4 sm:p-5">
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                  {activeSection.images.map((image, index) => {
                    const isSelected = index === activeImageIndex;

                    return (
                      <button
                        key={image.id}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`group overflow-hidden rounded-[18px] border bg-slate-50 p-2 text-left transition ${
                          isSelected
                            ? "border-primary shadow-[0_12px_26px_rgba(21,114,200,0.16)]"
                            : "border-slate-200 hover:border-primary/40"
                        }`}
                        aria-label={`Show ${image.title}`}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="aspect-[4/3] w-full rounded-[12px] object-cover transition duration-300 group-hover:scale-[1.02]"
                          loading="lazy"
                          decoding="async"
                          onError={(event) => handleImageError(event, image.title)}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <SiteFooter />
    </div>
  );
}
