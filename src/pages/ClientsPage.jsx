import { useMemo } from "react";
import PageIntro from "../components/PageIntro";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { usePublicContent } from "../context/PublicContentContext";
import { getLocalCompanyLogo } from "../lib/companyLogoRegistry";
import {
  normalizeSingleLineText,
} from "../lib/contentLayout";
import { resolveMediaUrl } from "../lib/mediaUrl";

const fallbackClients = [
  { n: "GRG Cotspin", s: "Textiles", y: "2023", c: "4,200 kWp" },
  { n: "Honda India", s: "Automotive", y: "2023", c: "2,500 kWp" },
  { n: "Welspun Group", s: "Textiles", y: "2024", c: "2,000 kWp" },
  { n: "Otsuka Pharmaceuticals", s: "Pharma", y: "2018", c: "2,024 kWp" },
  { n: "Baxter Pharmaceutical", s: "Pharma", y: "2024", c: "1,300 kWp" },
  { n: "Siemens Energy", s: "Engineering", y: "2023", c: "1,300 kWp" },
  { n: "Jindal", s: "Steel / Infra", y: "2017", c: "1,000 kWp" },
  { n: "Raviraj Foils", s: "Manufacturing", y: "2022-23", c: "1,899 kWp" },
  { n: "Amol Minechem", s: "Chemicals", y: "2022-23", c: "1,899 kWp" },
  { n: "Akash Fashion", s: "Textiles", y: "2021", c: "999 kWp" },
  { n: "Somany Evergreen", s: "Tiles / MFG", y: "2022", c: "900 kWp" },
  { n: "Monginis Foods", s: "Food & Bev", y: "2018", c: "780 kWp" },
  { n: "Fuji SilverTech", s: "Manufacturing", y: "2025", c: "528.5 kWp" },
  { n: "Colgate-Palmolive", s: "FMCG", y: "2025", c: "250 kWp" },
  { n: "Rohan Dyes (RDL)", s: "Chemicals", y: "2020", c: "325 kWp" },
  { n: "Delhi University", s: "Education", y: "2017", c: "120 kWp" },
  { n: "DPS Bopal", s: "Education", y: "2018", c: "90 kWp" },
  { n: "Busch Vacuum", s: "Engineering", y: "2020", c: "72 kWp + HVAC" },
  { n: "JMC Paper", s: "Paper / MFG", y: "2019", c: "50 kWp" },
  { n: "Aqseptence", s: "Water Tech", y: "2022-23", c: "320 kWp" },
  { n: "Screenotex", s: "Manufacturing", y: "2021", c: "100 kWp" },
  { n: "CTM Technical Textiles", s: "Textiles", y: "2022", c: "390 kWp" },
  { n: "RSL Dye & Chemical", s: "Chemicals", y: "2021", c: "325 kWp" },
  { n: "Raghuvir Exim", s: "Textiles", y: "2018-19", c: "195 kWp" },
  { n: "Swiss", s: "Manufacturing", y: "2021", c: "200 kWp" },
  { n: "Wideangle", s: "Engineering", y: "2017", c: "120 kWp" },
  { n: "Western Shellcast", s: "Manufacturing", y: "2024", c: "400 kWp" },
  { n: "HYS Lifecare", s: "Healthcare", y: "2019", c: "90 kWp" },
  { n: "Bharat Beams", s: "Manufacturing", y: "2018", c: "100 kWp" },
];

const supplementalClients = [
  { id: "supplemental-client-1", n: "Dangee Dums", s: "Industrial", y: "", c: "" },
  {
    id: "supplemental-client-2",
    n: "Shree Bhagwat Vidyapith Trust",
    s: "Industrial",
    y: "",
    c: "",
  },
  {
    id: "supplemental-client-3",
    n: "The Pioneer Magnesia Works",
    s: "Industrial",
    y: "",
    c: "",
  },
];

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

function Logo({ client }) {
  return (
    <img
      src={client.l || logoFallback(client.n)}
      alt={client.n}
      className="max-h-[64px] max-w-[160px] object-contain transition duration-300 group-hover:scale-[1.04]"
      loading="lazy"
      decoding="async"
      onError={(event) => handleLogoError(event, client.n)}
    />
  );
}

export default function ClientsPage() {
  const pageStyles = `
    .clients-page-intro h1,
    .clients-page-intro .optika-bold {
      color: #0d1b2a !important;
    }
    .clients-page-intro p {
      color: #4c596b !important;
      max-width: none !important;
      width: 100%;
      line-height: 1.35;
    }
    @media (min-width: 1280px) {
      .clients-page-intro p {
        font-size: clamp(1.05rem, 1.45vw, 1.75rem);
      }
    }
  `;

  const { content } = usePublicContent();
  const clients = useMemo(() => {
    const backendClients =
      Array.isArray(content?.clients) && content.clients.length ? content.clients : null;

    const baseClients = !backendClients
      ? fallbackClients.map((client) => ({
          ...client,
          l: getLocalCompanyLogo(client.n),
        }))
      : backendClients.map((client, index) => {
          const name = String(client.name ?? "").trim();
          const normalizedName = normalizeSingleLineText(name, `Client ${index + 1}`);

          return {
            id: client.id ?? `client-${index}`,
            n: normalizedName,
            s: normalizeSingleLineText(client.category, "Industrial"),
            y: normalizeSingleLineText(client.year),
            c: normalizeSingleLineText(client.capacity),
            l: resolveMediaUrl(client.logo?.url ?? client.logo) || getLocalCompanyLogo(normalizedName),
          };
        });

    const existingNames = new Set(baseClients.map((client) => String(client.n ?? "").trim().toLowerCase()));
    const mergedClients = [...baseClients];

    supplementalClients.forEach((client) => {
      const lookupKey = String(client.n ?? "").trim().toLowerCase();
      if (!lookupKey || existingNames.has(lookupKey)) {
        return;
      }

      existingNames.add(lookupKey);
      mergedClients.push({
        ...client,
        l: getLocalCompanyLogo(client.n),
      });
    });

    return mergedClients;
  }, [content]);

  return (
    <div className="bg-white font-body text-on-surface selection:bg-primary/20">
      <style>{pageStyles}</style>
      <SiteHeader />

      <main>
        <section className="bg-white px-4 pb-16 pt-20 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24 xl:px-12">
          <div className="mx-auto max-w-[1440px]">
            <PageIntro
              className="clients-page-intro mb-10 sm:mb-12"
              align="left"
              variant="plain"
              title="Our Clients"
              subtitle="Every logo below represents a live, commissioned installation with documented performance data and ongoing operations support across India's industrial landscape."
            />

            <div className="grid grid-cols-2 items-center gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {clients.map((client, index) => (
                <div
                  key={client.id ?? client.n}
                  className="group flex h-[100px] items-center justify-center opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${0.04 * (index + 1)}s` }}
                  title={client.n}
                >
                  <Logo client={client} />
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />

      </div>
  );
}
