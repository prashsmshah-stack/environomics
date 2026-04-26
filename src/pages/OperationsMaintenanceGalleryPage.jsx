import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { operationsMaintenanceGalleryItems } from "../lib/operationsMaintenanceGallery";

export default function OperationsMaintenanceGalleryPage() {
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
            <p className="mt-8 text-sm font-black uppercase tracking-[0.28em] text-white/70">
              Solar O&amp;M Gallery
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.96] text-white sm:text-5xl lg:text-[4.5rem]">
              Full O&amp;M Images In A Separate Tab
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-white/82 sm:text-lg">
              Every image is shown in full without the old modal crop. Each image also has a text
              section below it so there is clear space for captions, notes, or project details.
            </p>
          </section>

          <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {operationsMaintenanceGalleryItems.map((item, index) => (
              <article
                key={item.src}
                className="flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]"
              >
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-4">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="block aspect-[4/3] w-full rounded-[18px] bg-white object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between gap-4 px-5 py-5">
                  <div>
                    <h2 className="text-xl font-black tracking-[-0.03em] text-deep-navy">
                      {item.title}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={item.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[#c8def8] bg-[#f3f8fe] px-4 py-2 text-sm font-bold text-[#0f4f88] transition hover:-translate-y-0.5 hover:border-[#8ec0f5] hover:bg-[#eaf4ff]"
                    >
                      Open Original Image
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                        className="h-4 w-4"
                      >
                        <path d="M6 3h7v7" />
                        <path d="M13 3 3 13" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
