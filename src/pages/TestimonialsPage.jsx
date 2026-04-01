import { useEffect, useMemo } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { usePublicContent } from "../context/PublicContentContext";
import { resolveMediaUrl } from "../lib/api";
import {
  createLineClampStyle,
  normalizeSingleLineText,
  singleLineClampStyle,
} from "../lib/contentLayout";

const fallbackTestimonials = [
  {
    title: "Colgate-Palmolive",
    tag: "Global FMCG",
    subtitle: "Operations Head",
    capacity: "250 kWp",
    installed: "2025",
    description:
      "A global FMCG brand trusted Environomics with its energy infrastructure. Professional execution and high attention to detail.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuApf37-r6cPNg2oTCu_5RmHu34EtVgI032c5kTQoR1mJ03Ny5qo84iPmuIuu2EZCuF_-2un9BpWvvWE04CiZN6-KEnM9uQZUBZSKjzLj7GD0OnCXXKqzcBUMPlZYHtr1tHlJtjolrYVOI2atdqlw6AFabS7wOLoALO36pHl0xTq4oWKyjh5v40OOM-cCIADN5XVehahoDZ5Ppgh30CpKOjtWMX6vBoZ9ylH4YwoG7eRJA6QfrznYPjpnwWtV_sfsGYxHppSVX-vlb8",
  },
  {
    title: "Baxter Pharmaceutical",
    tag: "Life Sciences",
    subtitle: "Plant Director",
    capacity: "1,300 kWp",
    installed: "2024",
    description:
      "Baxter Pharmaceutical needed a pharma-grade install with strict hygiene protocols. Environomics delivered it on schedule and exceeded our expectations.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAyYu2IPnQvhAE3wZ353sCeO86UPagz8MB-Epw2P2G1ysh-tCw3kDxd5_RFaMASfAGq5oQk8Uc7TOlUq663vYeUtnKO2blaCvG08IsJxQyhHgoXWODO9wgyLe3MN4V-DJjc3BBlCnshmXDdoldu688vkLhwscqNNuwJ8kpU96fPXPEE-EJsXcWtO6AuDOjrMEg30DZtucUnmaowZXOxw9XZ4xyV935lKvOlvUZMvYZFA1HcrJX8MGnOmivDlnvmWZkbm5E_0ayLkGk",
  },
  {
    title: "Fuji SilverTech",
    tag: "Precast Engineering",
    subtitle: "Project Lead",
    capacity: "528.5 kWp",
    installed: "2025",
    description:
      "Fuji SilverTech delivered 528.5 kWp on time and above the modelled yield. The real time monitoring system is excellent.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADeKa5dhkmjSYMrCyT7z6EpmyX1NVJV1LLWjV_VcjAC85w5q_eFeKix-19EsYovh0BI4eMtzOo8N2P4siLPkJNDFNPilY11or8Vax08BBDF84EQGXZdAMrRg0nxHWPeUGM_1gqy-DLbK7RX7IZS5D41UbQ6IRt2S3UVr1pJlbqFBGay6wqc8-H0q5RxnwqNnLMKhILzc2sWsAWolILQLP1BsvWWxz3kYVsUN5umeYE2846TSaeYh5sRjy5pP3RUud5gNf2-94a7nE",
  },
  {
    title: "Siemens Energy",
    tag: "Heavy Engineering",
    subtitle: "Procurement Manager",
    capacity: "1,300 kWp",
    installed: "2023",
    description:
      "Siemens Energy chose Environomics for a 1,300 kWp plant. High technical competence demonstrated through complex grid synchronization.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARxk8ADAlMFXx1_XzykiIURdmsCuKigrN7TPedb0Axs5e01oXwTZAGjKhcsqpc5mYsIsT0NMMWGqu8trCdTWGQjB62JKMsEvIgKEpprQVhmFH8syxxvMQreQffwkFsjFNEWGAGJ2PzfRQ-jG314613mt69gmN5tVgGkJgNvykdtVLWmpqeDedLKWnYOgNdA11yy1x-lQ_XH5iDSU7DGR9WZNW71EHQnW2Th0mnMo7OsmtWBGzcVRm_sZxL3V3qlbwk6s_G7NKyP68",
  },
  {
    title: "Honda India",
    tag: "Automotive",
    subtitle: "Engineering Head",
    capacity: "2,500 kWp",
    installed: "2023",
    description:
      "Honda India demands perfection. 2,500 kWp system delivered on time. The performance stability has been critical for our operations.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDav4tQEK2a2RUCp3ixxqlUpj-IIXYIXRs8U4FWzzImUhSkULpPDfZrWkLeWtTUer6_28gHtenaSKgmGz5A3KA_Fj-7C3OOtN9wnxT2AcrCveJ1pBKxDxDQtRNyXmNC1Hm_Ju9Pl-u2mfL8mS79nrdYperp-3CI4A43uTytnUYXJQyNfxFn2vMtz4tq8dihPcTbElQ3lMQzGw3uGw6VPLGg03IQ_ZYIJIf4KE3Ltew7O-wlUn-7qs6uuNLQIbUeEr0eeBnfyPDMPHM",
  },
  {
    title: "Welspun Group",
    tag: "Textiles & Steel",
    subtitle: "Group Operations",
    capacity: "2,000 kWp",
    installed: "2024",
    description:
      "One of Environomics' largest installations delivered 2,000 kWp for Welspun Group. It is a flagship in scale and reliability for our manufacturing hub.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAfS0Q52AlpCsTv09DwjadsivCDWpP1Lia_9Wly7kfJcnjq0i2X1Q-Qx3er7OpAqeGqmsaxe1SDmP4VzfoCy2swRDdbIudXYgnFkN3zhPZ0OkXZcPz4ZdwH69FFctSNtlVYTHe_CKewEb-dw5cngJtuigjTwVOUGynQRuN-00BlZsp_TpfLOMMQOy9tYMUotERIKzdca-dOZ_72PrY9k_v8cRAZ0ENxcb51CK_Tj07dovnnIelYEFxwsnae3LCsw3zgW5lR0TX22C0",
  },
  {
    title: "Otsuka Pharmaceuticals",
    tag: "Pharma Legacy",
    subtitle: "Energy Director",
    capacity: "2,024 kWp",
    installed: "2018",
    description:
      "Installed in 2018 for Otsuka Pharmaceuticals. Still running above projection in 2025. A testament to the build quality and engineering.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrJEBvC_ce_UtqJFNGtfmiMZWM_k2cdkXGEpz5-OcDZ5Y3UPgob2Y_XiGsDgi4vCkTAd0b8emF1V7Y7WvnfR1kMks2yYrHj0KNTRAQRwOawd40_XltYAp9oq6VNbsZJYHpKyu3YDw0rCvCo8nt5YkCLiHB9Y-CZg7f6lkxJGyYdOm3ttY6RFRb_AOdat0bajEGT6okmYmwjGjSIBLllOPyfsxr_qk9d3zUGxG0WyMPGNprttZPa2X_Kf4bKiwdTzdH1l-9cuUKDUM",
  },
  {
    title: "Raviraj Foils",
    tag: "Packaging",
    subtitle: "Managing Director",
    capacity: "2,100 kWp",
    installed: "2022",
    description:
      "Scaling solar across multiple phases was delivered on schedule every time. Their multi phase execution strategy minimized downtime.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA2vU0SCBr2ncLYv7DKdyWECSX9BXMfyz9hwoVmkrTqowZzpHXvXkbcGfrwDOz9ajeU8OieX95ASAmb_HacV1Z0kXpJS0spcRQgxmD2bFoeZmVORDbIAW_OluWiq3iEjDBEygVgA7Ux8g5OMeQuaxisnZ1S8-eyWuAmF0h7qVqF135uGmJ-oiUNxxSIdRBxNmQnFJzwSTQ9Wl88xMR_nnq9pF8EBRcUcQLEOMqhZc-iMzRZqF0X7k_WIwloyGw5R8GzdNvNRIiP72w",
  },
];

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

function Icon({ name, className = "", filled = false }) {
  return <span className={`material-symbols-outlined ${className}`.trim()} style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}>{name}</span>;
}

export default function TestimonialsPage() {
  const { content } = usePublicContent();
  const testimonials = useMemo(() => {
    const backendTestimonials =
      Array.isArray(content?.testimonials) && content.testimonials.length ? content.testimonials : null;

    if (!backendTestimonials) {
      return fallbackTestimonials;
    }

    return backendTestimonials.map((testimonial, index) => ({
      id: testimonial.id ?? `testimonial-${index}`,
      title: normalizeSingleLineText(testimonial.title, `Testimonial ${index + 1}`),
      tag: normalizeSingleLineText(testimonial.tag, "Client Feedback"),
      subtitle: normalizeSingleLineText(
        testimonial.subtitle,
        "Project Stakeholder"
      ),
      capacity: normalizeSingleLineText(testimonial.capacity),
      installed: normalizeSingleLineText(testimonial.installed),
      description: normalizeSingleLineText(testimonial.description),
      image:
        resolveMediaUrl(testimonial.image ?? "") ||
        fallbackImage(`${testimonial.title || `Testimonial ${index + 1}`} Facility`),
    }));
  }, [content]);

  useEffect(() => {
    const reveal = () => {
      const reveals = Array.from(document.querySelectorAll(".reveal"));

      reveals.forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight - 100) {
          element.classList.add("active", "animate-staggered-fade");
        }
      });
    };

    const frameId = window.requestAnimationFrame(reveal);
    window.addEventListener("scroll", reveal);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", reveal);
    };
  }, [testimonials]);

  return (
    <div className="bg-cloud-gray font-body text-on-surface selection:bg-solar-blue/20">
      <SiteHeader />

      <header className="hero-gradient pt-20">
        <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="animate-staggered-fade mx-auto max-w-6xl text-center">
            <h1 className="optika-bold mx-auto mb-8 max-w-5xl text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Trusted by India&apos;s Largest Industrial Brands
            </h1>
            <p className="helixa-regular text-base leading-relaxed text-white/90 sm:text-lg md:text-xl">
              The best measure of an EPC contractor is what clients say after the project closes, once the system has been running for a year or two and they know whether it actually performed.
            </p>
          </div>
        </section>
      </header>

      <main className="bg-cloud-gray px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          {testimonials.map((testimonial, index) => (
            <article key={testimonial.id ?? `${testimonial.title}-${index}`} className={`reveal glass-lift flex w-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm stagger-${index + 1}`}>
              <div className="relative h-[200px] overflow-hidden rounded-t-[12px] sm:h-[220px]">
                <img src={testimonial.image} alt={`${testimonial.title} Facility`} className="h-full w-full object-cover" onError={(event) => handleImageError(event, `${testimonial.title} Facility`)} />
                <span className="badge-glass optika-bold absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-full px-3 py-1 text-[10px] uppercase tracking-widest text-deep-navy" style={singleLineClampStyle} title={testimonial.tag}>{testimonial.tag}</span>
              </div>
              <div className="flex flex-grow flex-col p-6 sm:p-8">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <h3 className="optika-bold text-xl text-deep-navy sm:text-2xl" style={createLineClampStyle(2, "2.7em")} title={testimonial.title}>{testimonial.title}</h3>
                  <div className="flex shrink-0 gap-0.5 text-yellow-400">{Array.from({ length: 5 }).map((_, i) => <Icon key={i} name="star" className="!text-sm" filled />)}</div>
                </div>
                <p className="helixa-regular mb-6 text-xs uppercase tracking-wider text-slate-500" style={singleLineClampStyle} title={testimonial.subtitle}>{testimonial.subtitle}</p>
                <div className="mb-8 grid grid-cols-2 gap-4 rounded-lg bg-cloud-gray p-4">
                  <div><p className="helixa-bold text-[10px] uppercase tracking-tighter text-slate-400">Capacity</p><p className="optika-bold text-sm text-deep-navy" style={singleLineClampStyle} title={testimonial.capacity}>{testimonial.capacity}</p></div>
                  <div><p className="helixa-bold text-[10px] uppercase tracking-tighter text-slate-400">Installed</p><p className="optika-bold text-sm text-deep-navy" style={singleLineClampStyle} title={testimonial.installed}>{testimonial.installed}</p></div>
                </div>
                <p className="helixa-regular mb-8 flex-grow italic leading-relaxed text-on-surface-variant" style={createLineClampStyle(5, "8.6em")} title={testimonial.description}>&quot;{testimonial.description}&quot;</p>
                <a href="/projects" className="helixa-bold inline-flex items-center text-xs uppercase tracking-wider text-solar-blue transition-all hover:gap-2">
                  Read full case study
                  <Icon name="arrow_forward" className="ml-1 !text-sm" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>

      <section className="bg-gradient-to-b from-cloud-gray to-[#2AAF6F] px-4 pb-16 pt-12 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white p-8 text-center text-growth-green shadow-2xl sm:p-10 lg:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-growth-green/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-growth-green/5 blur-3xl" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-growth-green/10"><Icon name="bolt" className="text-3xl" /></div>
            <h2 className="optika-bold mb-6 text-3xl md:text-5xl">Ready to Optimize Your Plant?</h2>
            <p className="helixa-regular mb-10 max-w-2xl text-lg text-growth-green/80">Join India&apos;s industrial leaders in the transition to precision-engineered energy.</p>
            <a href="/contact?focus=form" className="optika-bold flex w-full items-center justify-center gap-3 rounded-lg bg-growth-green px-8 py-4 text-base text-white shadow-xl transition-all hover:bg-growth-green/90 sm:w-auto sm:px-10">Start Your Consultation <Icon name="arrow_forward" /></a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
