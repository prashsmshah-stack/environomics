import { useEffect, useMemo, useRef } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { usePublicContent } from "../context/PublicContentContext";
import { resolveMediaUrl } from "../lib/api";
import { normalizeSingleLineText } from "../lib/contentLayout";

const fallbackProjects = [
  { name: "GRG COTSPIN", capacity: "4,200 kWp Solar", meta: "2023  TEXTILES  Largest single install. Anchor proof point.", image: "https://www.environomics.net.in/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-14-at-20.10.40_ef099853-1-1024x768-640x480_c.jpg", brand: { kind: "image", src: "https://www.environomics.net.in/wp-content/uploads/2025/02/2023_GRG_cotspin.jpeg", alt: "GRG Cotspin Logo", style: { borderRadius: "4px", objectFit: "cover" } } },
  { name: "HONDA INDIA", capacity: "2,500 kWp Solar", meta: "2023  AUTOMOTIVE  Global brand. Highest name recognition.", image: "https://www.environomics.net.in/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-14-at-20.04.21_db116f50-1024x768-640x480.jpg", brand: { kind: "image", src: "https://www.environomics.net.in/wp-content/uploads/2025/02/2023_honda-Photoroom.webp", alt: "Honda India Logo" } },
  { name: "OTSUKA PHARMACEUTICALS", capacity: "2,024 kWp Solar", meta: "2018  PHARMA  7 yrs live  Longevity proof. Still above P50 in 2025.", image: "https://www.environomics.net.in/wp-content/uploads/2024/02/Otsuka06-1024x768-640x480_c.jpg", brand: { kind: "image", src: "https://www.environomics.net.in/wp-content/uploads/2024/02/otsuka.png", alt: "Otsuka Pharmaceuticals Logo" } },
  { name: "WELSPUN GROUP", capacity: "2,000 kWp Solar", meta: "2024  TEXTILES  National conglomerate. Scale + recency.", image: "https://www.environomics.net.in/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-14-at-20.10.41_76ec1bcd-1024x768-640x480_c.jpg", brand: { kind: "image", src: "https://www.environomics.net.in/wp-content/uploads/2025/02/2023_welspun-Photoroom.webp", alt: "Welspun Group Logo" } },
  { name: "SIEMENS ENERGY", capacity: "1,300 kWp Solar", meta: "2023  ENGINEERING  Global MNC. Strongest credibility signal.", image: "https://www.environomics.net.in/wp-content/uploads/2024/02/DJI_0314-1-1024x683-640x480_c.jpg", brand: { kind: "image", src: "https://www.environomics.net.in/wp-content/uploads/2024/02/siemens.jpg", alt: "Siemens Energy Logo" } },
  { name: "BAXTER PHARMA", capacity: "1,300 kWp Solar", meta: "2024  PHARMA  Global pharma MNC. GMP-grade proof.", image: "https://www.environomics.net.in/wp-content/uploads/2024/02/DJI_0310-2-scaled.jpg", brand: { kind: "baxter" } },
  { name: "COLGATE-PALMOLIVE", capacity: "250 kWp Solar", meta: "2025  FMCG  Household global name. FMCG diversity.", image: "https://www.environomics.net.in/wp-content/uploads/2024/02/Otsuka05-1024x768-640x480_c.jpg", brand: { kind: "image", src: "https://www.environomics.net.in/wp-content/uploads/2025/02/2025_colgate_palmolive-Photoroom.webp", alt: "Colgate-Palmolive Logo" } },
  { name: "AMOL MINECHEM", capacity: "1,899 kWp Solar", meta: "2022-23  CHEMICALS  Largest chemicals install. Sector diversity.", image: "https://www.environomics.net.in/wp-content/uploads/2024/02/DJI_0306-1-1-1024x682-640x480_c.jpg", brand: { kind: "amol" } },
  { name: "RAVIRAJ FOILS", capacity: "1,899 kWp Solar", meta: "2022-23  MANUFACTURING  Multi-phase proof. Repeat-client signal.", image: "https://www.environomics.net.in/wp-content/uploads/2024/02/DJI_0327-1-scaled.jpg", brand: { kind: "image", src: "https://www.ravirajfoils.com/images/logo.png", alt: "Raviraj Foils Logo" } },
  { name: "AKASH FASHION", capacity: "999 kWp Solar", meta: "2021  TEXTILES  Sub-MW to MW scale. Textiles depth.", image: "https://www.environomics.net.in/wp-content/uploads/2024/02/DJI_0327-2-1024x683-640x480_c.jpg", brand: { kind: "image", src: "https://www.environomics.net.in/wp-content/uploads/2024/01/akashfashion.png", alt: "Akash Fashion Logo" } },
  { name: "MONGINIS FOODS", capacity: "780 kWp Solar", meta: "2018  FOOD & BEV  Recognisable brand. Food sector coverage.", image: "https://www.environomics.net.in/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-14-at-20.20.00_fc6dfe58-1024x768-640x480.jpg", brand: { kind: "image", src: "https://www.environomics.net.in/wp-content/uploads/2025/02/2017_monginis-Photoroom.webp", alt: "Monginis Foods Logo" } },
  { name: "ROHAN DYES (RDL)", capacity: "325 kWp Solar", meta: "2020  CHEMICALS  Chemical sector breadth. Steady delivery.", image: "https://www.environomics.net.in/wp-content/uploads/2024/02/DJI_0311-1-1024x682-640x480_c.jpg", brand: { kind: "image", src: "https://www.environomics.net.in/wp-content/uploads/2024/02/rohan-dyes-rdil-logonew.png", alt: "Rohan Dyes Logo" } },
  { name: "FUJI SILVERTECH", capacity: "528.5 kWp Solar", meta: "2025  MANUFACTURING  Most recent. Above yield.", image: "https://www.environomics.net.in/wp-content/uploads/2024/02/DJI_0308-1024x682-640x480_c.jpg", brand: { kind: "fuji" } },
  { name: "SOMANY EVERGREEN", capacity: "900 kWp Solar", meta: "2022  TILES / MFG  Known Indian brand. Tiles sector unique.", image: "https://www.environomics.net.in/wp-content/uploads/2024/02/DJI_0309-1024x682-640x480_c.jpg", brand: { kind: "image", src: "https://www.environomics.net.in/wp-content/uploads/2024/02/Somany-Evergreen.png", alt: "Somany Evergreen Logo" } },
  { name: "BUSCH VACUUM", capacity: "72 kWp Solar + HVAC", meta: "2020  ENGINEERING  Dual-service (Solar + HVAC).", image: "https://www.environomics.net.in/wp-content/uploads/2024/02/20230530_162952-scaled.jpg", brand: { kind: "busch" }, highlight: true },
];

const valueCards = [
  ["verified_user", "Turnkey Accountability", "Single turnkey accountability, with one team responsible from design through the 25 year life cycle."],
  ["monitoring", "Yield Validation", "Performance validated against the PVsyst yield model before handover, with documented test data and site verification."],
  ["history_edu", "Execution Track Record", "100+ projects delivered on time across a decade, backed by comprehensive milestone and compliance reports."],
  ["precision_manufacturing", "Asset Stewardship", "Post commissioning O&M available for all installed assets, with specialized technical care to maximize uptime."],
  ["gavel", "Regulatory Compliance", "Net metering, open access, and DISCOM coordination handled end to end for a frictionless transition."],
  ["account_balance", "Financial Bankability", "Bankable EPC design documentation that supports green bonds and international project financing standards."],
];

const pageStyles = `
  .font-optika-bold { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; letter-spacing: -0.02em; }
  .font-optika-regular { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 400; }
  .font-helixa-bold { font-family: 'Inter', sans-serif; font-weight: 700; }
  .font-helixa-regular { font-family: 'Inter', sans-serif; font-weight: 400; }
  .bg-growth-green { background-color: #003d22; }
  .glass-lift-card { transition: transform .5s cubic-bezier(.4,0,.2,1), box-shadow .5s cubic-bezier(.4,0,.2,1), border-color .5s, background-color .5s; position: relative; overflow: hidden; border: 2px solid rgba(255,255,255,.5) !important; background-color: rgba(255,255,255,.96) !important; }
  .glass-lift-card:hover { transform: translateY(-8px); box-shadow: 0 25px 50px -12px rgba(0,0,0,.3); border-color: #fff !important; background-color: #fff !important; }
  .values-blue-panel { background: #1572C8; border-radius: 20px; padding: 52px 40px 48px; box-shadow: 0 20px 60px rgba(21,114,200,.3); position: relative; }
  .values-blue-panel::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 3px; background: rgba(255,255,255,.35); border-radius: 0 0 20px 20px; }
  @keyframes lineGrow { from { transform: translateX(-50%) scaleY(0); transform-origin: top; } to { transform: translateX(-50%) scaleY(1); transform-origin: top; } }
  @keyframes lineFlow { 0% { background-position: 0 0; } 100% { background-position: 0 36px; } }
  @keyframes lineBeam { 0% { top: -60px; opacity: 0; } 8% { opacity: 1; } 92% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
  @keyframes dotPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(42,175,111,.45), 0 0 0 4px #fff; } 50% { box-shadow: 0 0 0 8px rgba(42,175,111,0), 0 0 0 4px #fff; } }
  @keyframes shineSwipe { 0% { left: -75%; opacity: 1; } 100% { left: 130%; opacity: 1; } }
  @keyframes popIn { 0% { opacity: 0; transform: scale(0.82) translateY(32px); } 60% { opacity: 1; transform: scale(1.04) translateY(-6px); } 80% { transform: scale(0.98) translateY(2px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
  .tl-vline { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; transform: translateX(-50%); background: repeating-linear-gradient(to bottom, #1572C8 0, #1572C8 9px, transparent 9px, transparent 18px); animation: lineGrow 1.2s cubic-bezier(.4,0,.2,1) both, lineFlow 1s linear infinite; z-index: 0; overflow: visible; }
  .tl-vline::after { content: ''; position: absolute; left: 50%; transform: translateX(-50%); width: 6px; height: 60px; border-radius: 3px; background: linear-gradient(to bottom, transparent, rgba(21,114,200,.85), transparent); animation: lineBeam 2.8s ease-in-out infinite; pointer-events: none; }
  .tl-bridge { position: relative; width: 100%; height: 72px; background: #fff; }
  .tl-bridge .tl-vline { animation: lineFlow 1s linear infinite; }
  .tl-section { background: #fff; padding: 0 40px 100px; }
  .tl-outer { position: relative; max-width: 1100px; margin: 0 auto; }
  .tl-row { display: flex; align-items: center; width: 100%; margin-bottom: 80px; position: relative; z-index: 1; }
  .tl-half { width: calc(50% - 44px); flex-shrink: 0; }
  .tl-img-half { display: flex; }
  .tl-img-half.img-left { justify-content: flex-end; padding-right: 44px; }
  .tl-img-half.img-right { justify-content: flex-start; padding-left: 44px; }
  .tl-img-wrap { position: relative; overflow: hidden; border-radius: 14px; cursor: pointer; isolation: isolate; }
  .tl-img { width: 310px; height: 205px; object-fit: cover; border-radius: 14px; border: 7px solid #2AAF6F; box-shadow: 0 6px 28px rgba(21,114,200,.15); display: block; }
  .tl-img-wrap .tl-img { transition: transform .55s cubic-bezier(.4,0,.2,1), box-shadow .55s ease, filter .55s ease; }
  .tl-img-wrap:hover .tl-img { transform: scale(1.07); box-shadow: 0 0 0 4px #2AAF6F, 0 16px 48px rgba(42,175,111,.35); filter: brightness(1.08) saturate(1.15); }
  .tl-img-wrap::before { content: ''; position: absolute; top: 0; left: -75%; width: 50%; height: 100%; background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.45) 50%, transparent 100%); transform: skewX(-15deg); z-index: 2; opacity: 0; pointer-events: none; }
  .tl-img-wrap:hover::before { animation: shineSwipe .65s ease forwards; }
  .tl-img-caption { position: absolute; bottom: 0; left: 0; right: 0; padding: 14px 16px 12px; background: linear-gradient(to top, rgba(0,61,34,.92) 0%, transparent 100%); color: #fff; display: flex; flex-direction: column; gap: 4px; opacity: 0; transform: translateY(8px); transition: opacity .4s ease, transform .4s ease; z-index: 3; pointer-events: none; border-radius: 0 0 14px 14px; }
  .tl-img-wrap:hover .tl-img-caption { opacity: 1; transform: translateY(0); }
  .tl-img-caption-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; }
  .tl-img-caption-detail { font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: rgba(255,255,255,.84); }
  .tl-text-half.text-left { padding-right: 44px; text-align: right; }
  .tl-text-half.text-right { padding-left: 44px; text-align: left; }
  .tl-logo-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .tl-text-half.text-left .tl-logo-row { flex-direction: row-reverse; }
  .tl-logo { height: 38px; width: auto; max-width: 130px; object-fit: contain; display: block; }
  .tl-logo-svg { height: 38px; width: auto; display: block; }
  .tl-name { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 21px; color: #0d1117; text-transform: uppercase; letter-spacing: -.2px; margin: 0 0 5px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; min-height: 2.4em; }
  .tl-kw { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 16px; color: #0059a2; margin: 0 0 7px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .tl-meta { font-family: 'Inter', sans-serif; font-size: 10.5px; font-weight: 700; color: #4c596b; text-transform: uppercase; letter-spacing: .05em; line-height: 1.7; margin: 0; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; min-height: 3.4em; }
  .tl-dot-col { width: 88px; flex-shrink: 0; display: flex; justify-content: center; align-items: center; position: relative; z-index: 2; }
  .tl-dot { width: 28px; height: 28px; border-radius: 50%; background: #fff; border: 3px solid #2AAF6F; box-shadow: 0 0 0 5px rgba(42,175,111,.13); animation: dotPulse 2.5s ease-in-out infinite; flex-shrink: 0; }
  .tl-row::before { content: ''; position: absolute; top: 50%; transform: translateY(-50%); height: 3px; background: #2AAF6F; z-index: 3; pointer-events: none; }
  .tl-row.tl-row-left::before { left: calc(50% - 88px); width: 74px; }
  .tl-row.tl-row-right::before { left: calc(50% + 14px); width: 74px; }
  .tl-row::after { position: absolute; top: 50%; transform: translateY(-50%); font-family: 'Inter', sans-serif; font-size: 28px; font-weight: 900; color: #2AAF6F; line-height: 1; z-index: 4; pointer-events: none; }
  .tl-row.tl-row-left::after { content: '\\00BB'; left: calc(50% + 28px); }
  .tl-row.tl-row-right::after { content: '\\00AB'; right: calc(50% + 28px); }
  .tl-row:not(.tl-row-15) { opacity: 1; transform: translateX(0); transition: opacity .6s ease, transform .6s ease; }
  .tl-row.is-visible { opacity: 1; transform: translateX(0); }
  .tl-row-15 { will-change: opacity, transform; opacity: 1; }
  .tl-row-15.pop-visible { animation: popIn .75s cubic-bezier(.4,0,.2,1) forwards; }
  @media (max-width: 1024px) {
    .values-blue-panel { padding: 36px 22px 32px; border-radius: 18px; }
    .tl-section { padding: 0 16px 72px; }
    .tl-outer { max-width: 100%; }
    .tl-vline { display: none; }
    .tl-row, .tl-half, .tl-img-half, .tl-text-half, .tl-dot-col { display: block; width: 100%; }
    .tl-row { margin-bottom: 40px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 28px; box-shadow: 0 4px 24px rgba(15,23,42,.06); }
    .tl-row::before, .tl-row::after { display: none; }
    .tl-img-half.img-left, .tl-img-half.img-right, .tl-text-half.text-left, .tl-text-half.text-right { padding: 0; text-align: left; }
    .tl-dot-col { display: none; }
    .tl-img { width: 100%; max-width: 100%; height: auto; aspect-ratio: 310 / 205; }
    .tl-logo-row, .tl-text-half.text-left .tl-logo-row { flex-direction: row; }
    .tl-name { font-size: 18px; }
    .tl-kw { font-size: 15px; }
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

function BrandLogo({ brand, name }) {
  if (brand.kind === "baxter") {
    return <svg className="tl-logo-svg" viewBox="0 0 160 38"><text x="0" y="30" fontFamily="Arial Black,sans-serif" fontSize="27" fontWeight="900" fill="#cc0000">Baxter</text></svg>;
  }
  if (brand.kind === "amol") {
    return <svg className="tl-logo-svg" viewBox="0 0 200 38"><rect width="200" height="38" rx="3" fill="#0a2d5e" /><text x="8" y="25" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="700" fill="#ffffff">AMOL MINECHEM</text></svg>;
  }
  if (brand.kind === "fuji") {
    return <svg className="tl-logo-svg" viewBox="0 0 200 38"><rect width="200" height="38" rx="3" fill="#003087" /><text x="8" y="22" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="700" fill="#ffffff">FUJI SILVERTECH</text><text x="8" y="34" fontFamily="Arial,sans-serif" fontSize="7.5" fill="#a0bce0">PRECAST INDO JAPAN PARTNERSHIP</text></svg>;
  }
  if (brand.kind === "busch") {
    return <svg className="tl-logo-svg" viewBox="0 0 200 38"><rect width="200" height="38" rx="3" fill="#c8102e" /><text x="8" y="24" fontFamily="Arial,sans-serif" fontSize="12.5" fontWeight="700" fill="#ffffff">BUSCH VACUUM</text><text x="8" y="34" fontFamily="Arial,sans-serif" fontSize="7.5" fill="#ffb3be">SOLUTIONS</text></svg>;
  }
  return <img className="tl-logo" src={brand.src} alt={brand.alt ?? `${name} Logo`} style={brand.style} loading="lazy" decoding="async" onError={(event) => handleImageError(event, name, "logo")} />;
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
      <div className="tl-img-caption" aria-hidden="true">
        <span className="tl-img-caption-title">{project.name}</span>
        <span className="tl-img-caption-detail">{project.capacity}</span>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { content } = usePublicContent();
  const rowsRef = useRef([]);
  const row15Ref = useRef(null);
  const projects = useMemo(() => {
    const getTimelineDirection = (index) => (index % 2 === 0 ? "left" : "right");
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
        description: project.description ?? project.meta ?? "",
        direction: getTimelineDirection(index),
      }));
    }

    const presentationByName = new Map(
      fallbackProjects.map((project, index) => [
        project.name,
        {
          ...project,
          description: project.description ?? project.meta ?? "",
          direction: getTimelineDirection(index),
        },
      ])
    );

    return backendProjects.map((project, index) => {
      const name = String(project.name ?? "").trim();
      const presentation = presentationByName.get(name);
      const specialBrandKind =
        presentation?.brand?.kind && presentation.brand.kind !== "image"
          ? presentation.brand.kind
          : null;
      const companyLogo = resolveMediaUrl(project.companyLogo ?? "");

      return {
        id: project.id ?? `project-${index}`,
        name: normalizeSingleLineText(name || presentation?.name, `Project ${index + 1}`),
        capacity: normalizeSingleLineText(project.capacity, presentation?.capacity || ""),
        description: normalizeSingleLineText(
          project.description ?? project.meta,
          presentation?.description ?? presentation?.meta ?? ""
        ),
        image: resolveMediaUrl(project.image ?? "") || fallbackImage(`${name || "Project"} Project`),
        brand:
          specialBrandKind && !companyLogo
            ? { kind: specialBrandKind }
            : {
                kind: "image",
                src: companyLogo || fallbackImage(name || "Project", "logo"),
                alt: presentation?.brand?.alt ?? `${name || "Project"} Logo`,
                style: presentation?.brand?.style,
              },
        highlight: name === "BUSCH VACUUM" || Boolean(presentation?.highlight),
        direction: getTimelineDirection(index),
      };
    });
  }, [content]);

  useEffect(() => {
    rowsRef.current.filter(Boolean).forEach((row) => {
      row.style.opacity = "1";
      row.style.transform = "translateX(0)";
      row.classList.remove("is-visible", "pop-visible");
    });

    if (row15Ref.current) {
      row15Ref.current.style.opacity = "1";
      row15Ref.current.style.transform = "";
      row15Ref.current.classList.remove("pop-visible");
    }
  }, [projects]);

  return (
    <div className="bg-white font-body text-on-surface selection:bg-primary/20">
      <style>{pageStyles}</style>

      <SiteHeader />

      <header className="bg-white px-4 pb-10 pt-24 text-on-surface sm:px-6 sm:pb-12 lg:px-8 lg:pb-14 lg:pt-28 md:pt-32">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-1 items-center gap-12">
            <div className="w-full text-left">
              <h1 className="optika-bold mb-6 text-4xl leading-[1.05] text-primary sm:text-5xl md:text-6xl lg:text-7xl">
                Global Portfolio
              </h1>
              <h2 className="font-helixa-bold mb-6 w-full text-on-surface" style={{ fontSize: "clamp(1.2rem, 2.1vw, 2.25rem)", lineHeight: "1.15" }}>
                Commissioned with Precision. Performing with Expectation.
              </h2>
              <p className="font-helixa-regular w-full text-base leading-relaxed text-tertiary md:text-lg lg:text-[1.15rem]">Our project portfolio spans over a decade of execution across India&apos;s most demanding commercial and industrial environments. Each installation is live, operational, and generating returns, not a case study with a soft conclusion. From 30 kWp rooftop systems to multi megawatt ground mount plants, from pharmaceutical grade HVAC to automated compressed air networks, every project below is live, operational, and performing.</p>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-white px-4 pb-0 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10" id="project-values">
        <div className="mx-auto max-w-screen-2xl">
          <div className="values-blue-panel">
            <div className="relative z-10 mb-12 text-center">
              <h2 className="font-optika-bold text-center text-3xl text-white md:text-4xl">Why Clients Choose Environomics<br />Key Project Values</h2>
            </div>
            <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {valueCards.map(([icon, title, description]) => (
                <div key={title} className="glass-lift-card group flex flex-col rounded-xl bg-white p-6 shadow-sm sm:p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5 transition-colors duration-500 group-hover:bg-primary/20">
                      <span className="material-symbols-outlined text-2xl text-primary transition-transform duration-500 group-hover:scale-110">{icon}</span>
                    </div>
                  </div>
                  <h3 className="mb-4 text-lg font-optika-bold text-on-surface">{title}</h3>
                  <p className="text-[15px] font-helixa-regular leading-relaxed text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="tl-bridge">
            <div className="tl-vline" />
          </div>
        </div>
      </section>

      <section className="tl-section">
        <div className="tl-outer">
          <div className="tl-vline" />

          {projects.map((project, index) => {
            const imageLeft = project.direction !== "right";
            const isLast = project.highlight;

            return (
              <div
                key={project.id ?? project.name}
                ref={(element) => {
                  rowsRef.current[index] = element;
                  if (isLast) row15Ref.current = element;
                }}
                className={`tl-row ${imageLeft ? "tl-row-left" : "tl-row-right"} ${isLast ? "tl-row-15" : ""}`}
              >
                {imageLeft ? (
                  <>
                    <div className="tl-half tl-img-half img-left">
                      <ProjectImage project={project} />
                    </div>
                    <div className="tl-dot-col"><div className="tl-dot" /></div>
                    <div className="tl-half tl-text-half text-right">
                      <div className="tl-logo-row"><BrandLogo brand={project.brand} name={project.name} /></div>
                      <h4 className="tl-name" title={project.name}>{project.name}</h4>
                      <p className="tl-kw" title={project.capacity}>{project.capacity}</p>
                      <p className="tl-meta" title={project.description}>{project.description}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="tl-half tl-text-half text-left">
                      <div className="tl-logo-row"><BrandLogo brand={project.brand} name={project.name} /></div>
                      <h4 className="tl-name" title={project.name}>{project.name}</h4>
                      <p className="tl-kw" title={project.capacity}>{project.capacity}</p>
                      <p className="tl-meta" title={project.description}>{project.description}</p>
                    </div>
                    <div className="tl-dot-col"><div className="tl-dot" /></div>
                    <div className="tl-half tl-img-half img-right">
                      <ProjectImage project={project} />
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {!projects.length ? (
            <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-slate-50 px-6 py-12 text-center shadow-sm">
              <h3 className="optika-bold text-2xl text-primary sm:text-3xl">
                Projects will appear here once they are published.
              </h3>
              <p className="mt-4 helixa-regular text-base leading-relaxed text-slate-600 sm:text-lg">
                Save a project as <strong>Published</strong> from the admin panel to display it on the main website.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <SiteFooter />

      </div>
  );
}
