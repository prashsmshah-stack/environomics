import { useEffect, useState } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { operationsMaintenanceGalleryItems } from "../lib/operationsMaintenanceGallery";

export default function OperationsMaintenanceGalleryPage() {
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const activeItem =
    activeImageIndex === null ? null : operationsMaintenanceGalleryItems[activeImageIndex];

  useEffect(() => {
    if (!activeItem || typeof document === "undefined") {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveImageIndex(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeItem]);

  return (
    <div className="bg-white font-body text-on-surface selection:bg-solar-blue/20">
      <SiteHeader />

      <main className="px-4 pb-16 pt-20 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24 xl:px-12">
        <div className="mx-auto max-w-[1240px]">
          <section className="overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#0f2f52_0%,#155189_48%,#1c6bb3_100%)] px-6 py-14 text-white shadow-[0_24px_70px_rgba(15,47,82,0.18)] sm:px-10 sm:py-16 lg:px-14 lg:py-20">
            <a
              href="/om"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/16"
            >
              Back to O&amp;M Services
            </a>
            <h1 className="mt-8 max-w-4xl text-4xl font-black leading-[0.96] text-white sm:text-5xl lg:text-[4.5rem]">
              Solar O&amp;M Image Gallery
            </h1>
          </section>

          <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {operationsMaintenanceGalleryItems.map((item, index) => (
              <article
                key={item.src}
                className="flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]"
              >
                <button
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className="group relative block border-b border-slate-100 bg-slate-50 px-4 py-4 text-left"
                  aria-label={`Open ${item.title}`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="block aspect-[4/3] w-full rounded-[18px] bg-white object-cover transition duration-500 group-hover:scale-[1.02]"
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <span className="pointer-events-none absolute right-8 top-8 inline-flex items-center rounded-full bg-white/92 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0f4f88] shadow-[0_10px_24px_rgba(15,79,136,0.12)]">
                    View
                  </span>
                </button>

                <div className="flex flex-1 flex-col justify-between gap-4 px-5 py-5">
                  <div>
                    <h2 className="text-xl font-black tracking-[-0.03em] text-deep-navy">
                      {item.title}
                    </h2>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>

      {activeItem ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/88 px-4 py-6 backdrop-blur-sm sm:px-8"
          onClick={() => setActiveImageIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
        >
          <div
            className="relative w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/12 bg-slate-900 shadow-[0_32px_80px_rgba(15,23,42,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveImageIndex(null)}
              className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-black/35 text-2xl text-white transition hover:bg-black/55"
              aria-label="Close image viewer"
            >
              &times;
            </button>

            <div className="bg-[radial-gradient(circle_at_top,#15385f_0%,#020617_65%)] px-3 pb-3 pt-16 sm:px-6 sm:pb-6 sm:pt-20">
              <img
                src={activeItem.src}
                alt={activeItem.alt}
                className="max-h-[78vh] w-full rounded-[20px] bg-slate-950 object-contain"
              />
              <div className="px-2 pb-2 pt-5 text-white sm:px-1">
                <p className="text-xl font-black tracking-[-0.03em]">{activeItem.title}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <SiteFooter />
    </div>
  );
}
