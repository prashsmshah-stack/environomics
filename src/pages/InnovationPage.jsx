import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useEffect } from "react";
import innovationHeroImage from "../../imgs/envato-labs-image-edit (9)ggg.png";

const initiatives = [
  {
    icon: "precision_manufacturing",
    status: "Deployed",
    title: "Proprietary Single Axis Solar Tracker for India",
    description:
      "Environomics has developed a proprietary single axis solar tracker designed for Indian soil conditions, wind load zones, and monsoon weather. It increases daily energy generation by 15 to 25% over fixed tilt systems. Imported tracker solutions often fail in India's high wind events and variable soil profiles, and ours was built around those conditions from the start. The control algorithm includes a storm stow function that moves panels to a horizontal protected position automatically when wind speed crosses preset thresholds.",
    bullets: ["India-specific Load Engineering", "25% Generation Uplift Potential"],
    hover: "hover-glow-blue",
  },
  {
    icon: "monitoring",
    status: "In-House Beta",
    title: "AI-Powered Plant Performance Platform",
    description:
      "Our in-house software team has built a proprietary plant monitoring and analytics application that uses machine learning to detect performance anomalies, predict inverter fault signatures, and schedule O&M more precisely. The platform pulls together real-time generation data, irradiance sensor inputs, weather API data, and historical performance curves to calculate expected versus actual yield at the string, inverter, and plant level. When something is off, our O&M team gets an alert before it turns into lost revenue.",
    bullets: ["Predictive Fault Detection", "Multi-Source Data Fusion"],
    hover: "hover-glow-green",
  },
];

const researchAreas = [
  ["Modeling", "Bifacial module yield modelling under Gujarat and Rajasthan albedo conditions", "border-primary", "group-hover:text-primary"],
  ["Machine Learning", "Tracker fault prediction using inverter current harmonics and weather-linked classification", "border-growth-green", "group-hover:text-growth-green"],
  ["Diagnostic", "Drone-assisted thermographic anomaly detection for utility plants", "border-primary", "group-hover:text-primary"],
  ["Storage", "Battery storage dispatch strategies for captive industrial loads", "border-growth-green", "group-hover:text-growth-green"],
  ["Optimisation", "String-level generation optimization under partial shading profiles", "border-primary", "group-hover:text-primary"],
  ["Feasibility", "Energy feasibility frameworks for hybrid rooftop-ground-mount deployments", "border-growth-green", "group-hover:text-growth-green"],
];

const publicationsDownloadPath = "/downloads/environomics-rd-overview.txt";

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

function Icon({ name, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`.trim()}>{name}</span>;
}

export default function InnovationPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white text-on-surface">
      <SiteHeader />

      <main>
        <div className="bg-white pb-24 pt-20">
          <section className="relative mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-32">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="animate-fade-in-up z-10">
                <span className="mb-6 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">Pioneering Energy</span>
                <h1 className="optika-bold mb-8 text-4xl leading-[1.05] text-primary sm:text-5xl md:text-6xl lg:text-7xl">Engineering the Future of Solar Today</h1>
                <div className="space-y-6">
                  <p className="max-w-xl text-base leading-relaxed text-black sm:text-lg">At Environomics, the R&amp;D team does real work with proprietary tools, published models, and field deployed technology, not website copy. In an industry where module efficiency, tracker technology, and AI driven monitoring are advancing every year, having in house research capability means the solutions we deliver are current, not just commercially available.</p>
                  <p className="max-w-xl text-base leading-relaxed text-black sm:text-lg">The R&amp;D team includes a Senior Scientist from SPRERI (Sardar Patel Renewable Energy Research Institute) and specialists in machine learning, photovoltaics, and applied data science. That mix of field experience and research background is what makes the work practical, and the proprietary tools we develop get deployed on live plants, not left in a lab.</p>
                </div>
              </div>
              <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-2xl border border-slate-200">
                  <img src={innovationHeroImage} alt="Environomics innovation lab" className="w-full h-full object-cover" onError={(event) => handleImageError(event, "Solar Research")} />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-12 sm:mb-16"><h2 className="mb-4 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">Active R&amp;D Initiatives</h2></div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 items-stretch">
              {initiatives.map((item, index) => (
                <div key={item.title} className={`bg-white p-6 rounded-xl glass-lift-glow border border-slate-200 animate-slide-up flex flex-col h-full shadow-sm sm:p-8 lg:p-10 ${item.hover} card-pop-up group`} style={{ animationDelay: `${0.1 + index * 0.2}s` }}>
                  <div className="mb-8 flex justify-between items-start">
                    <div className="p-4 bg-primary/10 rounded-xl text-primary transition-all duration-300 group-hover:bg-[#1572C8] group-hover:text-white"><Icon name={item.icon} className="text-4xl" /></div>
                    <span className="text-[0.65rem] font-bold text-primary uppercase tracking-widest border border-primary/40 px-3 py-1 rounded-full">{item.status}</span>
                  </div>
                  <h3 className="mb-4 text-xl font-extrabold text-primary sm:text-2xl">{item.title}</h3>
                  <p className="text-black leading-relaxed mb-8 flex-grow">{item.description}</p>
                  <ul className="space-y-4">{item.bullets.map((bullet) => <li key={bullet} className="flex items-center gap-3 text-sm text-black font-bold"><Icon name="check_circle" className="text-xl" />{bullet}</li>)}</ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="bg-gradient-to-b from-emerald-50 to-growth-green">
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <h2 className="mb-10 text-center text-3xl font-extrabold tracking-tight animate-fade-in-up sm:mb-12" style={{ color: '#2AAF6F' }}>Ongoing Research Areas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchAreas.map(([eyebrow, title, borderClass, hoverClass], index) => (
                <div key={title} className={`bg-white p-6 border-l-4 shadow-sm research-card-hover group animate-fade-in animate-slide-up sm:p-8 ${borderClass}`} style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
                  <span className={`text-xs font-bold uppercase tracking-widest mb-2 block transition-colors text-black/70 ${hoverClass}`}>{eyebrow}</span>
                  <h4 className="text-lg font-bold text-black">{title}</h4>
                </div>
              ))}
            </div>
          </section>

          <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-32">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl border border-slate-100 bg-white p-8 shadow-2xl animate-fade-in-up sm:p-10 lg:p-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-custom-green/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="relative z-10 text-center">
                <h2 className="text-3xl lg:text-5xl font-extrabold mb-6" style={{ color: '#2AAF6F' }}>Partner with our R&amp;D Lab</h2>
                <p className="text-custom-green text-lg mb-10 max-w-2xl mx-auto font-medium">Developing customized energy solutions for your specific industrial topology.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/contact?focus=form" className="flex items-center justify-center gap-2 rounded-lg bg-custom-green px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105 sm:w-auto"><span>Get in Touch</span><Icon name="send" /></a>
                  <a href={publicationsDownloadPath} download className="flex items-center justify-center gap-2 rounded-lg border border-custom-green/30 px-8 py-4 font-bold text-custom-green transition-colors hover:bg-custom-green/5 sm:w-auto"><span>Download Publications</span><Icon name="download" /></a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />

      </div>
  );
}
