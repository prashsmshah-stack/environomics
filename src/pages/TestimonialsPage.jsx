import { useMemo } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { usePublicContent } from "../context/PublicContentContext";
import { resolveMediaUrl } from "../lib/api";
import { testimonialShowcase } from "../lib/testimonialShowcase";
import { normalizeSingleLineText } from "../lib/contentLayout";

const testimonialPdfPages = [2, 5, 7, 10, 13, 14, 18, 21, 23, 27, 28, 29, 27, 32, 35];

const testimonialPdfPageMatches = [
  { match: "testimonial-1.png", page: 2 },
  { match: "testimonial-2.png", page: 5 },
  { match: "testimonial-3.png", page: 7 },
  { match: "testimonial-4.png", page: 10 },
  { match: "testimonial-5.png", page: 13 },
  { match: "testimonial-6.png", page: 14 },
  { match: "testimonial-8.png", page: 18 },
  { match: "testimonial-9.png", page: 21 },
  { match: "testimonial-10.png", page: 23 },
  { match: "testimonial-11.png", page: 27 },
  { match: "johnson-screens.png", page: 27 },
  { match: "testimonial-12.png", page: 28 },
  { match: "testimonial-13.png", page: 29 },
  { match: "testimonial-15.png", page: 32 },
  { match: "testimonial-16.png", page: 35 },
];

const fallbackTestimonials = testimonialShowcase
  .filter((_, index) => index !== 6)
  .slice(0, 15)
  .map((testimonial, index) => ({
    ...testimonial,
    pdfPage: testimonialPdfPages[index] ?? 1,
  }));

const TESTIMONIALS_PDF_PATH = "/downloads/customer-testimonial-certificates-scan.pdf";

const testimonialLogos = {
  "Wide Angle": "https://www.environomics.net.in/wp-content/uploads/2024/02/wideangle.jpg",
  "Loyal Equipments Ltd": "https://www.environomics.net.in/wp-content/uploads/2024/01/aqseptencelogo.png",
  "Otsuka Pharmaceutical India Pvt. Ltd.": "https://www.environomics.net.in/wp-content/uploads/2024/02/otsuka.png",
  "Bharat Beams Pvt Ltd": "https://www.environomics.net.in/wp-content/uploads/2024/03/bharat-beams-private-limited-120x120-1.jpg",
  "Busch Vacuum India Private Limited": "/imgs/company-logos/busch-vacuum.png",
  "Swiss Pharma Pvt Ltd": "https://www.environomics.net.in/wp-content/uploads/2024/02/swiss.png",
  "Somany Evergreen Knits Ltd": "https://www.environomics.net.in/wp-content/uploads/2024/02/Somany-Evergreen.png",
  "Raviraj Foils Ltd": "https://www.ravirajfoils.com/images/logo.png",
  "Siemens Energy": "https://www.environomics.net.in/wp-content/uploads/2024/02/siemens.jpg",
  "Johnson Screens": "https://www.environomics.net.in/wp-content/uploads/2024/02/johnson-screens.png",
  "Honda Motorcycle & Scooter India Pvt. Ltd": "https://www.environomics.net.in/wp-content/uploads/2025/02/2023_honda-Photoroom.webp",
  "Baxter Pharmaceuticals India Private Ltd": "/imgs/company-logos/baxter-pharma.png",
  "Fuji Silvertech": "/imgs/company-logos/fuji-silvertech.png",
  "Colgate Palmolive India Ltd": "/imgs/company-logos/colgate-palmolive.png",
};

function fallbackImage(label, variant = "photo") {
  const safeLabel = label.replace(/&/g, "&amp;");

  if (variant === "logo") {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 160">
        <rect width="480" height="160" rx="24" fill="#ffffff"/>
        <rect x="8" y="8" width="464" height="144" rx="18" fill="#0f1c2c"/>
        <text x="34" y="72" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="3">ENVIRONOMICS</text>
        <text x="34" y="112" fill="#93c5fd" font-family="Arial, sans-serif" font-size="14">Engineering. Procurement. Construction.</text>
      </svg>
    `)}`;
  }

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f1c2c"/>
          <stop offset="100%" stop-color="#1572C8"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)"/>
      <g opacity="0.16" stroke="#dbeafe" stroke-width="2" fill="none">
        <path d="M90 620 L320 380 L470 500 L720 210 L1110 470"/>
        <path d="M120 690 L350 450 L520 560 L780 270 L1140 540"/>
      </g>
      <text x="80" y="120" fill="#ffffff" font-family="Arial, sans-serif" font-size="38" font-weight="700" letter-spacing="4">ENVIRONOMICS</text>
      <text x="80" y="720" fill="#ffffff" font-family="Arial, sans-serif" font-size="54" font-weight="700">${safeLabel}</text>
    </svg>
  `)}`;
}

function handleImageError(event, label, variant = "photo") {
  const fallback = fallbackImage(label, variant);
  if (event.currentTarget.src !== fallback) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallback;
  }
}

function normalizeTestimonialKey(value = "") {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function resolveCertificatePdfPage(imageUrl, fallbackPage = 1) {
  const normalized = String(imageUrl ?? "").toLowerCase().replace(/\\/g, "/");
  const matched = testimonialPdfPageMatches.find((item) => normalized.includes(item.match));
  return matched?.page ?? fallbackPage;
}

function getCertificatePageHref(pageNumber) {
  return `${TESTIMONIALS_PDF_PATH}#page=${pageNumber}&view=FitH`;
}

export default function TestimonialsPage() {
  const pageStyles = `
    .testimonials-hero {
      background: linear-gradient(180deg, #155189 0%, #0f2f52 100%);
    }
  `;

  const { content } = usePublicContent();
  const testimonials = useMemo(() => {
    const backendTestimonials =
      Array.isArray(content?.testimonials) && content.testimonials.length ? content.testimonials : null;

    if (!backendTestimonials) {
      return fallbackTestimonials;
    }

    const testimonialsByTitle = new Map();

    backendTestimonials.forEach((testimonial) => {
      const key = normalizeTestimonialKey(testimonial.title);
      if (!testimonialsByTitle.has(key)) {
        testimonialsByTitle.set(key, []);
      }
      testimonialsByTitle.get(key).push(testimonial);
    });

    return fallbackTestimonials.map((testimonial, index) => {
      const key = normalizeTestimonialKey(testimonial.title);
      const matchedTestimonials = testimonialsByTitle.get(key) ?? [];
      const backendTestimonial = matchedTestimonials.shift();
      const resolvedImage =
        resolveMediaUrl(backendTestimonial?.image ?? "") ||
        testimonial.image ||
        fallbackImage(`${testimonial.title} Facility`);

      return {
        ...testimonial,
        id: backendTestimonial?.id ?? testimonial.id ?? `testimonial-${index}`,
        title: normalizeSingleLineText(backendTestimonial?.title, testimonial.title),
        tag: normalizeSingleLineText(backendTestimonial?.tag, testimonial.tag),
        subtitle: normalizeSingleLineText(backendTestimonial?.subtitle, testimonial.subtitle),
        capacity: normalizeSingleLineText(backendTestimonial?.capacity, testimonial.capacity),
        installed: normalizeSingleLineText(backendTestimonial?.installed, testimonial.installed),
        description: normalizeSingleLineText(
          backendTestimonial?.description,
          testimonial.description
        ),
        image: resolvedImage,
        pdfPage: resolveCertificatePdfPage(resolvedImage, testimonial.pdfPage ?? index + 1),
      };
    });
  }, [content]);

  return (
    <div className="bg-white font-body text-on-surface selection:bg-solar-blue/20">
      <style>{pageStyles}</style>
      <SiteHeader />

      <main className="px-4 pb-16 pt-20 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24 xl:px-12">
        <div className="mx-auto max-w-[1440px]">
          <section className="testimonials-hero mb-10 px-6 py-16 text-center sm:mb-12 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
            <div className="mx-auto max-w-6xl">
              <h1 className="optika-bold text-5xl leading-[0.98] text-white sm:text-6xl lg:text-[5.5rem]">
                Trusted by India&apos;s Largest
                <br />
                Industrial Brands
              </h1>
              <p className="optika-medium mx-auto mt-10 max-w-6xl text-lg leading-[1.4] text-white/90 sm:text-xl lg:text-[1.08rem]">
                The best measure of an EPC contractor is what clients say after the project closes,
                once the system has been running for a year or two and they know whether it actually
                performed.
              </p>
            </div>
          </section>

          <section className="rounded-[32px] border border-[#e8edf5] bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => {
                const certificateHref = getCertificatePageHref(testimonial.pdfPage ?? 1);

                return (
                  <a
                    key={testimonial.id}
                    href={certificateHref}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white opacity-0 shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition duration-300 animate-fade-in-up hover:-translate-y-1 hover:border-[#a4c9ff] hover:shadow-[0_20px_40px_rgba(0,89,162,0.15)]"
                    style={{ animationDelay: `${0.04 * (index + 1)}s` }}
                    aria-label={`Open the full testimonial certificate PDF for ${testimonial.title}`}
                  >
                    <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden border-b border-slate-100 bg-slate-50 p-4 sm:min-h-[380px] lg:min-h-[420px]">
                      <div className="flex h-full w-full items-center justify-center">
                        <img
                          src={testimonial.image}
                          alt={`${testimonial.title} testimonial`}
                          className="max-h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
                          loading="lazy"
                          decoding="async"
                          onError={(event) =>
                            handleImageError(event, `${testimonial.title} Testimonial`)
                          }
                        />
                      </div>
                    </div>

                    <div className="flex min-h-[112px] items-end justify-between gap-4 px-4 py-4">
                      <div>
                        <span className="block text-sm font-bold leading-snug text-deep-navy sm:text-[0.98rem]">
                          {testimonial.title}
                        </span>
                        <span className="mt-1 block text-xs uppercase tracking-[0.12em] text-slate-500">
                          {testimonial.tag}
                        </span>
                      </div>

                      {testimonialLogos[testimonial.title] ? (
                        <img
                          src={testimonialLogos[testimonial.title]}
                          alt={`${testimonial.title} logo`}
                          className="h-8 w-auto max-w-[72px] shrink-0 object-contain opacity-60"
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : null}
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
