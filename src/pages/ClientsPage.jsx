import { useEffect, useMemo, useRef, useState } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { usePublicContent } from "../context/PublicContentContext";
import { resolveMediaUrl } from "../lib/api";
import {
  createLineClampStyle,
  normalizeSingleLineText,
  singleLineClampStyle,
} from "../lib/contentLayout";

const sectorOrder = [
  "Automotive",
  "Pharma",
  "Textiles",
  "Engineering",
  "Chemicals",
  "Manufacturing",
  "Food & Bev",
  "FMCG",
  "Education",
  "Steel / Infra",
  "Healthcare",
  "Tiles / MFG",
  "Water Tech",
  "Paper / MFG",
];

const fallbackClients = [
  { n: "GRG Cotspin", s: "Textiles", y: "2023", c: "4,200 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2025/02/2023_GRG_cotspin.jpeg" },
  { n: "Honda India", s: "Automotive", y: "2023", c: "2,500 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2025/02/2023_honda-Photoroom.webp" },
  { n: "Welspun Group", s: "Textiles", y: "2024", c: "2,000 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2025/02/2023_welspun-Photoroom.webp" },
  { n: "Otsuka Pharmaceuticals", s: "Pharma", y: "2018", c: "2,024 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/02/otsuka.png" },
  { n: "Baxter Pharmaceutical", s: "Pharma", y: "2024", c: "1,300 kWp", k: "baxter" },
  { n: "Siemens Energy", s: "Engineering", y: "2023", c: "1,300 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/02/siemens.jpg" },
  { n: "Jindal", s: "Steel / Infra", y: "2017", c: "1,000 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/03/OIP-53.jpg" },
  { n: "Raviraj Foils", s: "Manufacturing", y: "2022-23", c: "1,899 kWp", l: "https://www.ravirajfoils.com/images/logo.png" },
  { n: "Amol Minechem", s: "Chemicals", y: "2022-23", c: "1,899 kWp", l: "https://www.amolminechem.com/images/amol-dicalite-logo2.svg" },
  { n: "Akash Fashion", s: "Textiles", y: "2021", c: "999 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/01/akashfashion.png" },
  { n: "Somany Evergreen", s: "Tiles / MFG", y: "2022", c: "900 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/02/Somany-Evergreen.png" },
  { n: "Monginis Foods", s: "Food & Bev", y: "2018", c: "780 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2025/02/2017_monginis-Photoroom.webp" },
  { n: "Fuji SilverTech", s: "Manufacturing", y: "2025", c: "528.5 kWp", k: "fuji" },
  { n: "Colgate-Palmolive", s: "FMCG", y: "2025", c: "250 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2025/02/2025_colgate_palmolive-Photoroom.webp" },
  { n: "Rohan Dyes (RDL)", s: "Chemicals", y: "2020", c: "325 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/02/rohan-dyes-rdil-logonew.png" },
  { n: "Balkrishna", s: "Manufacturing", y: "2019", c: "325 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/03/logo-3.png" },
  { n: "Delhi University", s: "Education", y: "2017", c: "120 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/03/delhi-university-686256-1.jpg" },
  { n: "DPS Bopal", s: "Education", y: "2018", c: "90 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/03/delhi-public-school-bopal-logo-1.jpg" },
  { n: "Busch Vacuum", s: "Engineering", y: "2020", c: "72 kWp + HVAC", k: "busch" },
  { n: "JMC Paper", s: "Paper / MFG", y: "2019", c: "50 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/03/download-8.jpg" },
  { n: "Aqseptence", s: "Water Tech", y: "2022-23", c: "320 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/01/aqseptencelogo.png" },
  { n: "Screenotex", s: "Manufacturing", y: "2021", c: "100 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/01/screen.png" },
  { n: "CTM Technical Textiles", s: "Textiles", y: "2022", c: "390 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/01/CTM-Technical-Textiles-Ltd.jpg" },
  { n: "RSL Dye & Chemical", s: "Chemicals", y: "2021", c: "325 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/01/rdl-logo.png" },
  { n: "Raghuvir Exim", s: "Textiles", y: "2018-19", c: "195 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2025/02/2019_REL.webp" },
  { n: "Swiss", s: "Manufacturing", y: "2021", c: "200 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/02/swiss.png" },
  { n: "Wideangle", s: "Engineering", y: "2017", c: "120 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/02/wideangle.jpg" },
  { n: "Western Shellcast", s: "Manufacturing", y: "2024", c: "400 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2025/02/2024_western_pal_shellcast.webp" },
  { n: "HYS Lifecare", s: "Healthcare", y: "2019", c: "90 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/03/hys.jpg" },
  { n: "Bharat Beams", s: "Manufacturing", y: "2018", c: "100 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/03/bharat-beams-private-limited-120x120-1.jpg" },
];

const clientLayoutStyles = `
  .client-grid-card > p:last-of-type {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

function logoFallback(label) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 160">
      <rect width="480" height="160" rx="24" fill="#ffffff"/>
      <rect x="8" y="8" width="464" height="144" rx="18" fill="#0f1c2c"/>
      <text x="32" y="92" fill="#ffffff" font-family="Arial,sans-serif" font-size="24" font-weight="700">${label.replace(/&/g, "&amp;")}</text>
    </svg>
  `)}`;
}

function handleLogoError(event, label) {
  const fallback = logoFallback(label);
  if (event.currentTarget.src !== fallback) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallback;
  }
}

function Icon({ name, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`.trim()}>{name}</span>;
}

function Logo({ client }) {
  if (client.k === "baxter") {
    return (
      <svg viewBox="0 0 160 40" className="max-h-[44px] max-w-[130px]">
        <text x="0" y="30" fontFamily="Arial Black, Arial, sans-serif" fontSize="28" fontWeight="900" fill="#cc0000">Baxter</text>
      </svg>
    );
  }

  if (client.k === "fuji") {
    return (
      <svg viewBox="0 0 200 42" className="max-h-[42px] max-w-[140px]">
        <rect width="200" height="42" rx="4" fill="#003087" />
        <text x="8" y="26" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700" fill="#ffffff">FUJI SILVERTECH</text>
        <text x="8" y="37" fontFamily="Arial, sans-serif" fontSize="7" fill="#8ab0e0">INDO-JAPAN PARTNERSHIP</text>
      </svg>
    );
  }

  if (client.k === "busch") {
    return (
      <svg viewBox="0 0 200 42" className="max-h-[42px] max-w-[140px]">
        <rect width="200" height="42" rx="4" fill="#c8102e" />
        <text x="8" y="26" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" fill="#ffffff">BUSCH VACUUM</text>
        <text x="8" y="37" fontFamily="Arial, sans-serif" fontSize="7" fill="#ffb3be">SOLUTIONS</text>
      </svg>
    );
  }

  return (
    <img
      src={client.l || logoFallback(client.n)}
      alt={client.n}
      className="max-h-[52px] max-w-[140px] object-contain grayscale-[0.3] transition duration-300 group-hover:grayscale-0"
      loading="lazy"
      decoding="async"
      onError={(event) => handleLogoError(event, client.n)}
    />
  );
}

export default function ClientsPage() {
  const { content } = usePublicContent();
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState([]);
  const ref = useRef(null);
  const clients = useMemo(() => {
    const backendClients =
      Array.isArray(content?.clients) && content.clients.length ? content.clients : null;

    if (!backendClients) {
      return fallbackClients;
    }

    const specialLogoKinds = new Map(
      fallbackClients.filter((client) => client.k).map((client) => [client.n, client.k])
    );

    return backendClients.map((client, index) => {
      const name = String(client.name ?? "").trim();
      const companyLogo = resolveMediaUrl(client.companyLogo ?? "");

      return {
        id: client.id ?? `client-${index}`,
        n: normalizeSingleLineText(name, `Client ${index + 1}`),
        s: normalizeSingleLineText(client.category, "Industrial"),
        y: normalizeSingleLineText(client.year),
        c: normalizeSingleLineText(client.capacity),
        l: companyLogo,
        k: companyLogo ? "" : specialLogoKinds.get(name) ?? "",
      };
    });
  }, [content]);
  const sectors = useMemo(() => {
    const ranking = new Map(sectorOrder.map((sector, index) => [sector, index]));
    return [...new Set(clients.map((client) => client.s).filter(Boolean))].sort((left, right) => {
      const leftRank = ranking.has(left) ? ranking.get(left) : Number.MAX_SAFE_INTEGER;
      const rightRank = ranking.has(right) ? ranking.get(right) : Number.MAX_SAFE_INTEGER;

      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }

      return left.localeCompare(right);
    });
  }, [clients]);

  useEffect(() => {
    const onMouseDown = (event) => {
      if (open && ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const visibleClients = useMemo(
    () => (filters.length === 0 ? clients : clients.filter((client) => filters.includes(client.s))),
    [clients, filters]
  );

  const filterLabel = filters.length === 0 ? "Filter by Industry" : filters.length === 1 ? filters[0] : "Industries";

  function toggleFilter(sector) {
    setFilters((current) => (current.includes(sector) ? current.filter((item) => item !== sector) : [...current, sector]));
  }

  return (
    <div className="bg-white font-body text-on-surface selection:bg-primary/20">
      <style>{clientLayoutStyles}</style>
      <SiteHeader />

      <main>
        <section className="bg-surface-container-low px-4 pb-16 pt-20 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24 xl:px-12">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-12">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
                <div ref={ref} className="relative w-full sm:w-auto">
                  <button type="button" onClick={() => setOpen((current) => !current)} className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] shadow-[0_2px_8px_rgba(0,89,162,0.08)] transition-all sm:w-auto ${open || filters.length ? "border-primary bg-primary text-white" : "border-[#d1dff0] bg-white text-primary hover:border-[#a4c9ff] hover:bg-[#eef4ff]"}`}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    <span>{filterLabel}</span>
                    {filters.length ? <span className={`rounded-full px-2 py-0.5 text-[10px] ${open ? "bg-white text-primary" : "bg-primary text-white"}`}>{filters.length}</span> : null}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true"><path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>

                  {open ? (
                    <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-[18rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_12px_40px_rgba(0,40,100,0.12)] sm:min-w-[240px]">
                      <p className="mb-3 border-b border-slate-100 px-2 pb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Select Industry</p>
                      <div className="grid grid-cols-2 gap-1">
                        <button type="button" onClick={() => setFilters([])} className={`rounded-lg px-3 py-2 text-left text-[11px] font-semibold transition-all ${filters.length === 0 ? "border border-primary bg-primary text-white" : "border border-transparent text-slate-600 hover:border-[#d4e6ff] hover:bg-[#eef4ff] hover:text-primary"}`}>All</button>
                        {sectors.map((sector) => {
                          const active = filters.includes(sector);
                          return (
                            <button key={sector} type="button" onClick={() => toggleFilter(sector)} className={`rounded-lg px-3 py-2 text-left text-[11px] font-semibold transition-all ${active ? "border border-primary bg-[#eef4ff] text-primary" : "border border-transparent text-slate-600 hover:border-[#d4e6ff] hover:bg-[#eef4ff] hover:text-primary"}`}>
                              {sector}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                        <button type="button" onClick={() => setFilters([])} className="flex-1 rounded-lg border border-[#d1dff0] bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 transition-all hover:border-[#a4c9ff] hover:bg-slate-50">Clear All</button>
                        <button type="button" onClick={() => setOpen(false)} className="flex-1 rounded-lg bg-primary px-3 py-2 text-[11px] font-bold text-white transition-all hover:bg-primary/90">Apply</button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <h1 className="optika-bold mb-4 text-4xl leading-[1.05] text-on-surface sm:text-5xl md:text-6xl lg:text-7xl">Our Clients</h1>
              <p className="helixa-regular w-full max-w-none text-base leading-relaxed text-tertiary sm:text-lg md:text-xl">Every logo below represents a live, commissioned installation with documented performance data and ongoing operations support across India&apos;s industrial landscape.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {visibleClients.map((client, index) => (
                <article key={client.id ?? client.n} className="client-grid-card group relative flex min-h-[230px] flex-col items-center overflow-hidden rounded-2xl border border-[#e8edf5] bg-white px-4 pb-5 pt-6 shadow-[0_2px_12px_rgba(0,40,100,0.06)] opacity-0 transition-all duration-300 hover:-translate-y-2 hover:border-[#a4c9ff] hover:shadow-[0_20px_40px_rgba(0,89,162,0.15)] animate-fade-in-up sm:px-5 sm:pt-7" style={{ animationDelay: `${0.04 * (index + 1)}s` }}>
                  <div className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#0059a2] to-[#1572c8] transition-transform duration-300 group-hover:scale-x-100" />
                  <div className="mb-4 flex h-[72px] w-full items-center justify-center"><Logo client={client} /></div>
                  <p className="optika-bold text-center text-[0.72rem] uppercase tracking-[0.08em] text-primary" style={createLineClampStyle(2, "2.6em")} title={client.n}>{client.n}</p>
                  <span className="mt-2 inline-flex max-w-full rounded-full bg-[#eef4ff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary" style={singleLineClampStyle} title={client.s}>{client.s}</span>
                  <p className="mt-2 text-center text-[11px] text-tertiary">{client.y} · {client.c}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />

      </div>
  );
}
