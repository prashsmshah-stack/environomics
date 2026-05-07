import { memo, useEffect, useMemo, useState } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useImageCache } from "../hooks/useImageCache";
import {
  balanceTwoLineText,
  normalizeSingleLineText,
  singleLineClampStyle,
} from "../lib/contentLayout";
import { CULTURE_PAGE_PATH } from "../lib/cultureGallery";
import { fetchStrapiJson, resolveStrapiMediaUrl } from "../lib/strapiApi";

const impactCardStyles = [
  {
    valueClass: "text-primary",
    iconBg: "bg-primary-fixed group-hover:bg-primary",
  },
  {
    valueClass: "text-primary group-hover:text-secondary transition-colors duration-300",
    iconBg: "bg-primary-fixed group-hover:bg-secondary",
  },
  {
    valueClass: "text-tertiary",
    iconBg: "bg-tertiary-fixed group-hover:bg-tertiary",
  },
  {
    valueClass: "text-primary",
    iconBg: "bg-primary-fixed group-hover:bg-primary",
  },
];

const fallbackHomeContent = {
  heroBadge: "Trusted Industrial Utility Experts",
  heroTitle: "India's Trusted Turnkey EPC Partner",
  heroSubtitle: "Solar, HVAC & Industrial Utilities",
  heroLead:
    "From 30 kWp rooftop systems to 5 MWp ground mount plants, Environomics engineers, builds, and maintains the utility infrastructure that cuts your energy costs by up to 80%, reduces your carbon output, and keeps your facility running without disruption.",
  primaryCtaLabel: "Explore Our Projects",
  primaryCtaUrl: "/projects",
  secondaryCtaLabel: "Download Our Catalogue",
  secondaryCtaUrl: "/Environomics_EPC_Catalogue_2025.pdf",
  cultureCtaLabel: "Our Culture",
  cultureCtaUrl: "/culture",
  heroImageUrl: "/imgs/hero-2560.jpg",
  aboutHeading: "About Environomics",
  aboutBody:
    "For over a decade, Environomics Projects LLP has delivered EPC projects for India's reputed commercial and industrial clients. Based in Ahmedabad, Gujarat, we are a turnkey EPC company: we design, procure, build, and maintain the utility infrastructure that runs your operations. That includes megawatt-scale solar plants, pharmaceutical HVAC systems, compressed air networks, and industrial automation.",
  aboutImageUrl: "/imgs/hero-1600.jpg",
  aboutImageAlt: "Environomics industrial project site",
  certifications: ["In-house R&D", "Quality Components", "24/7 Support"],
  impactHeading: "Engineering a Greener Future, Our Verified Global Impact",
  impactCards: [
    { icon: "bolt", value: "90,000+ MWh", label: "Clean Energy Generated" },
    { icon: "co2", value: "72,000 T", label: "CO2 Emissions Avoided" },
    { icon: "payments", value: "720 M+", label: "Client Energy Savings" },
    { icon: "verified", value: "125+", label: "Delivered On Time", sublabel: "Across 8+ industrial sectors" },
  ],
  videosHeading: "Environomics Projects",
  videosDescription: "Featured from our YouTube presence, with room to add more Environomics videos here.",
  videos: [
    {
      id: "environomics-projects",
      title: "Environomics Projects",
      embedUrl: "https://www.youtube-nocookie.com/embed/c98iCb4pRg4?rel=0",
      thumbnailUrl: "https://i.ytimg.com/vi/c98iCb4pRg4/maxresdefault.jpg",
      watchUrl: "https://youtu.be/c98iCb4pRg4",
      kind: "embed",
    },
    {
      id: "environomics-solar-project",
      title: "Environomics Solar Project",
      embedUrl: "https://www.youtube-nocookie.com/embed/DCFUIUivfxo?rel=0",
      thumbnailUrl: "https://i.ytimg.com/vi/DCFUIUivfxo/maxresdefault.jpg",
      watchUrl: "https://youtu.be/DCFUIUivfxo",
      kind: "embed",
    },
  ],
  servicesHeading: "Specialized Engineering Services",
  services: [
    {
      id: "solar-rooftop",
      title: "Solar Rooftop",
      description: "Commercial and industrial rooftop solar solutions engineered for maximum yield and ROI.",
      image: "/imgs/S1.png",
      alt: "Solar Rooftop",
      href: "/services?tab=solar-rooftop",
      linkLabel: "Learn More",
    },
    {
      id: "ground-mount",
      title: "Ground Mount",
      description: "Utility-scale deployments with advanced tracking and grid-integration capabilities.",
      image: "/imgs/S2.png",
      alt: "Ground Mount Solar",
      href: "/services?tab=ground-mount",
      linkLabel: "Learn More",
    },
    {
      id: "operations-maintenance",
      title: "Operations & Maintenance",
      description: "Comprehensive O&M services ensuring peak performance and system longevity.",
      image: "/imgs/S3.png",
      alt: "Operations & Maintenance",
      href: "/om",
      linkLabel: "Learn More",
    },
    {
      id: "hvac",
      title: "HVAC & Clean Room Systems",
      description: "Specialized environmental control for pharmaceutical and high-tech manufacturing.",
      image: "/imgs/HVAC IMAGE.jpeg",
      alt: "HVAC & Clean Room Systems",
      href: "/services?tab=hvac",
      linkLabel: "Learn More",
    },
  ],
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

function youtubeThumbnailSrcDoc(video) {
  const escapedTitle = video.title.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const autoplayUrl = `${video.embedUrl}&autoplay=1`;

  return `
    <style>
      * { box-sizing: border-box; }
      html, body { height: 100%; margin: 0; overflow: hidden; }
      a { display: block; height: 100%; position: relative; background: #020617; }
      img { height: 100%; width: 100%; object-fit: cover; }
      .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(2, 6, 23, 0.08), rgba(2, 6, 23, 0.38)); }
      .play { position: absolute; inset: 0; display: grid; place-items: center; }
      .button { align-items: center; background: #1572C8; border-radius: 999px; box-shadow: 0 16px 36px rgba(2, 6, 23, 0.32); display: flex; height: 72px; justify-content: center; width: 72px; }
      .triangle { border-bottom: 15px solid transparent; border-left: 22px solid #fff; border-top: 15px solid transparent; margin-left: 5px; }
    </style>
    <a href="${autoplayUrl}" aria-label="Play ${escapedTitle}">
      <img src="${video.thumbnailUrl}" alt="${escapedTitle} thumbnail" loading="lazy">
      <span class="shade"></span>
      <span class="play"><span class="button"><span class="triangle"></span></span></span>
    </a>
  `;
}

function formatHeroTitle(value) {
  const title = normalizeSingleLineText(value);

  if (/^india(?:'|s)?s trusted turnkey epc partner$/i.test(title) || /^indias trusted turnkey epc partner$/i.test(title)) {
    return "India's Trusted\nTurnkey EPC Partner";
  }

  return balanceTwoLineText(title, {
    fallback: title,
    maxLength: 42,
  });
}

function normalizeMediaItem(media, fallbackAlt = "") {
  const url = resolveStrapiMediaUrl(media?.url);

  return {
    url,
    alt: normalizeSingleLineText(media?.alternativeText, fallbackAlt),
  };
}

function normalizeHomePage(payload) {
  const data = payload?.data;

  if (!data) {
    return fallbackHomeContent;
  }

  const heroImage = normalizeMediaItem(data.heroImage, "Homepage hero image");
  const aboutImage = normalizeMediaItem(data.aboutImage, "About Environomics");
  const services = (data.services || []).map(normalizeHomeService).filter((service) => service.title);
  const videos = (data.videos || []).map(normalizeHomeVideo).filter((video) => video.title);

  return {
    ...fallbackHomeContent,
    ...data,
    heroImageUrl: heroImage.url || fallbackHomeContent.heroImageUrl,
    aboutImageUrl: aboutImage.url || fallbackHomeContent.aboutImageUrl,
    aboutImageAlt: aboutImage.alt || fallbackHomeContent.aboutImageAlt,
    certifications: Array.isArray(data.certifications) && data.certifications.length ? data.certifications : fallbackHomeContent.certifications,
    impactCards: Array.isArray(data.impactCards) && data.impactCards.length ? data.impactCards : fallbackHomeContent.impactCards,
    services: services.length ? services : fallbackHomeContent.services,
    videos: videos.length ? videos : fallbackHomeContent.videos,
  };
}

function normalizeHomeService(service) {
  const image = normalizeMediaItem(service?.coverImage, service?.title || "Service");

  return {
    id: service?.id || service?.title,
    title: normalizeSingleLineText(service?.title),
    description: normalizeSingleLineText(service?.description),
    image: image.url,
    alt: image.alt,
    href: normalizeSingleLineText(service?.href, "/services"),
    linkLabel: normalizeSingleLineText(service?.linkLabel, "Learn More"),
  };
}

function normalizeHomeVideo(video) {
  return {
    id: video?.id || video?.videoId || video?.title,
    title: normalizeSingleLineText(video?.title),
    embedUrl: normalizeSingleLineText(video?.embedUrl),
    thumbnailUrl: resolveStrapiMediaUrl(video?.thumbnailUrl) || video?.thumbnailUrl || "",
    watchUrl: normalizeSingleLineText(video?.watchUrl, video?.youtubeUrl),
    kind: video?.kind || "embed",
  };
}

function ServiceCard({ title, description, image, alt, href = "/services", linkLabel = "Learn More", className = "" }) {
  return (
    <div className={`group bg-white rounded-xl overflow-hidden shadow-sm transition-all hover:-translate-y-2 flex flex-col h-full border border-slate-100 ${className}`.trim()}>
      <div className="h-48 overflow-hidden sm:h-56">
        <img alt={alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={image || fallbackImage(title)} loading="lazy" decoding="async" onError={(event) => handleImageError(event, alt || title)} />
      </div>
      <div className="flex flex-grow flex-col p-6 sm:p-8">
        <h3 className="optika-bold text-xl mb-4">{title}</h3>
        <p className="helixa-regular text-on-surface-variant text-sm mb-6 flex-grow">{description}</p>
        <a className="inline-flex items-center gap-2 helixa-bold text-primary hover:gap-4 transition-all" href={href}>
          {linkLabel} <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
        </a>
      </div>
    </div>
  );
}

const MemoizedServiceCard = memo(ServiceCard);

function HomeLoadingShell({ message }) {
  return (
    <div className="scroll-smooth bg-white font-body text-on-surface selection:bg-primary/20">
      <SiteHeader />
      <main className="flex min-h-[60vh] items-center justify-center px-4 pt-24">
        <p className="helixa-bold text-sm text-on-surface-variant">{message}</p>
      </main>
      <SiteFooter />
    </div>
  );
}

export default function HomePage() {
  const [homeContent, setHomeContent] = useState(null);
  const [services, setServices] = useState([]);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadHomePage() {
      try {
        setStatus("loading");
        setError("");

        const homePayload = await fetchStrapiJson("/api/public/home-page");

        if (!isMounted) {
          return;
        }

        const nextHomeContent = normalizeHomePage(homePayload);
        setHomeContent(nextHomeContent);
        setServices(nextHomeContent?.services || []);
        setFeaturedVideos(nextHomeContent?.videos || []);
        setStatus("success");
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Unable to load homepage content.");
        setHomeContent(fallbackHomeContent);
        setServices(fallbackHomeContent.services);
        setFeaturedVideos(fallbackHomeContent.videos);
        setStatus("success");
      }
    }

    loadHomePage();

    return () => {
      isMounted = false;
    };
  }, []);

  const criticalImages = useMemo(() => {
    if (!homeContent) {
      return [];
    }

    return [
      homeContent.heroImageUrl,
      homeContent.aboutImageUrl,
      ...services.map((service) => service.image),
    ].filter(Boolean);
  }, [homeContent, services]);

  useImageCache(criticalImages);

  if (status === "loading" && !homeContent) {
    return <HomeLoadingShell message="Loading homepage content..." />;
  }

  if (!homeContent) {
    return <HomeLoadingShell message={error || "Homepage content is not available yet."} />;
  }

  const heroTitle = formatHeroTitle(homeContent.heroTitle);
  const heroSubtitle = normalizeSingleLineText(homeContent.heroSubtitle);
  const primaryCta = normalizeSingleLineText(homeContent.primaryCtaLabel);
  const secondaryCta = normalizeSingleLineText(homeContent.secondaryCtaLabel);
  const cultureCta = normalizeSingleLineText(homeContent.cultureCtaLabel, "Our Culture");
  const heroLead = normalizeSingleLineText(homeContent.heroLead);
  const heroBadge = normalizeSingleLineText(homeContent.heroBadge);
  const aboutParagraphs = String(homeContent.aboutBody || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const certifications = homeContent.certifications
    .map((item) => normalizeSingleLineText(item))
    .filter(Boolean);
  const impactCards = homeContent.impactCards.filter((card) => card?.value && card?.label);
  return (
    <div className="scroll-smooth bg-white font-body text-on-surface selection:bg-primary/20">
      <SiteHeader />

      <section className="hero-split-gradient relative flex min-h-[85svh] items-center overflow-hidden pt-20 lg:min-h-[90vh]">
        <div className="hero-media-layer absolute inset-0" aria-hidden="true">
          <img
            src={homeContent.heroImageUrl || fallbackImage("Homepage")}
            sizes="100vw"
            alt=""
            className="h-full w-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            draggable="false"
            onError={(event) => handleImageError(event, "Homepage")}
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(3,18,37,0.88)_0%,rgba(0,74,141,0.78)_45%,rgba(2,12,27,0.9)_100%)]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020b18] via-[#020b18]/55 to-transparent" aria-hidden="true" />
        <div className="mx-auto flex w-full max-w-[1440px] justify-center px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="relative z-10 flex max-w-5xl flex-col items-center py-12 text-center sm:py-16">
            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-sm">
              <span className="text-[11px] font-headline font-bold uppercase tracking-[0.2em] text-white/90">{heroBadge}</span>
            </div>
            <h1
              className="optika-bold mb-4 whitespace-pre-line text-4xl leading-[1.05] text-[#9BD4FF] sm:text-5xl md:text-6xl xl:text-7xl"
              title={normalizeSingleLineText(homeContent.heroTitle)}
            >
              {heroTitle}
            </h1>
            <h2
              className="optika-medium mb-6 max-w-full text-lg text-white/90 sm:mb-8 sm:text-xl md:text-2xl"
              style={singleLineClampStyle}
              title={heroSubtitle}
            >
              {heroSubtitle}
            </h2>
            <p className="helixa-regular mb-8 max-w-3xl text-base leading-relaxed text-white/80 sm:mb-10 sm:text-lg">
              {heroLead}
            </p>
            <div className="flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
              <a href={homeContent.primaryCtaUrl} className="helixa-bold flex w-full min-w-0 items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-white shadow-lg shadow-primary/30 transition-all hover:bg-on-primary-fixed-variant sm:w-auto">
                <span className="block max-w-full" style={singleLineClampStyle} title={primaryCta}>
                  {primaryCta}
                </span>
                <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
              </a>
              <a
                href={homeContent.secondaryCtaUrl}
                target="_blank"
                rel="noreferrer"
                className="helixa-bold flex w-full min-w-0 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/12 px-8 py-4 text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:w-auto"
              >
                <span className="block max-w-full" style={singleLineClampStyle} title={secondaryCta}>
                  {secondaryCta}
                </span>
                <span className="material-symbols-outlined" data-icon="download">download</span>
              </a>
              <a
                href={homeContent.cultureCtaUrl || CULTURE_PAGE_PATH}
                className="helixa-bold flex w-full min-w-0 items-center justify-center gap-2 rounded-xl border border-white/25 bg-growth-green/90 px-8 py-4 text-white shadow-lg shadow-growth-green/20 transition-all hover:bg-growth-green sm:w-auto"
              >
                <span className="block max-w-full" style={singleLineClampStyle} title={cultureCta}>
                  {cultureCta}
                </span>
                <span className="material-symbols-outlined" data-icon="diversity_3">diversity_3</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="page-gradient-bottom">
        <section className="bg-transparent py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-16">
              <div className="relative">
                <div className="mx-auto aspect-[3/4] max-w-[450px] overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/70">
                  <img
                    alt={homeContent.aboutImageAlt}
                    className="h-full w-full object-cover"
                    src={homeContent.aboutImageUrl || fallbackImage("About Environomics")}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => handleImageError(event, "About Environomics")}
                  />
                </div>
              </div>
              <div>
                <h2 className="optika-bold mb-6 text-3xl text-on-surface sm:mb-8 sm:text-4xl">{homeContent.aboutHeading}</h2>
                <div className="space-y-6 text-on-surface-variant leading-relaxed">
                  {aboutParagraphs.map((paragraph) => (
                    <p key={paragraph} className="helixa-regular">
                      {paragraph}
                    </p>
                  ))}
                  {certifications.length ? (
                    <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {certifications.map((item) => (
                        <li key={item} className="flex items-center gap-2 helixa-bold text-on-surface sm:justify-center">
                          <span className="material-symbols-outlined text-secondary" data-icon="check_circle">check_circle</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        {impactCards.length ? (
          <section className="bg-transparent pb-14 pt-16 sm:pt-20 lg:pt-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="optika-bold mb-12 text-center text-3xl text-on-surface sm:mb-16 sm:text-4xl">{homeContent.impactHeading}</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
                {impactCards.map((card, index) => {
                  const style = impactCardStyles[index % impactCardStyles.length];
                  const icon = normalizeSingleLineText(card.icon, "verified");

                  return (
                    <div key={`${card.value}-${card.label}`} className="group rounded-xl border border-white/40 bg-white/60 p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:p-8">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:text-white group-hover:scale-105 transition-all duration-300 ${style.iconBg}`}>
                        <span className="material-symbols-outlined text-3xl" data-icon={icon}>{icon}</span>
                      </div>
                      <p className={`optika-bold mb-2 text-2xl sm:text-3xl ${style.valueClass}`}>{card.value}</p>
                      <p className="helixa-regular text-on-surface-variant text-sm">{card.label}</p>
                      {card.sublabel ? (
                        <p className="helixa-regular mt-2 text-xs text-on-surface-variant">{card.sublabel}</p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-transparent pb-16 pt-12 sm:pb-20 sm:pt-14 lg:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="optika-bold mb-4 text-center text-3xl text-on-surface sm:text-4xl">
              {homeContent.videosHeading}
            </h2>
            <p className="helixa-regular mx-auto mb-12 max-w-3xl text-center text-sm leading-relaxed text-on-surface-variant sm:mb-16 sm:text-base">
              {homeContent.videosDescription}
            </p>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {featuredVideos.map((video) =>
                video.kind === "embed" && video.embedUrl ? (
                  <article
                    key={video.id}
                    className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]"
                  >
                    <div className="aspect-video overflow-hidden bg-slate-950">
                      <iframe
                        src={video.embedUrl}
                        srcDoc={youtubeThumbnailSrcDoc(video)}
                        title={video.title}
                        className="h-full w-full"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                      <div>
                        <p className="optika-bold text-xl text-on-surface">{video.title}</p>
                        <p className="helixa-regular mt-1 text-sm text-slate-500">
                          Watch on YouTube
                        </p>
                      </div>
                      <a
                        href={video.watchUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="helixa-bold inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm text-white transition hover:bg-primary/90"
                      >
                        Open
                        <span className="material-symbols-outlined text-base">open_in_new</span>
                      </a>
                    </div>
                  </article>
                ) : (
                  <div
                    key={video.id}
                    className="group aspect-video overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100 shadow-sm transition-all hover:shadow-lg"
                  >
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                      <div className="px-6 text-center">
                        <span className="material-symbols-outlined mb-3 block text-5xl text-slate-500">
                          play_circle
                        </span>
                        <p className="optika-bold text-lg text-slate-700">{video.title}</p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-28 bg-transparent pb-16 pt-12 sm:pb-20 sm:pt-14 lg:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="optika-bold mb-12 text-center text-3xl text-on-surface sm:mb-16 sm:text-4xl">{homeContent.servicesHeading}</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {services.map((service) => (
                <MemoizedServiceCard key={service.id || service.title} {...service} />
              ))}
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
