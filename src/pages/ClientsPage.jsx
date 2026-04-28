import { useMemo } from "react";
import PageIntro from "../components/PageIntro";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { usePublicContent } from "../context/PublicContentContext";
import { resolveMediaUrl } from "../lib/api";
import {
  normalizeSingleLineText,
} from "../lib/contentLayout";

const supplementalClientLogoModules = import.meta.glob("../../imgs/*.{jpeg,jpg,png,webp}", {
  eager: true,
  import: "default",
});

const supplementalClientLogoFilenames = [
  "Dangee Dums logo.jpeg",
  "Shree Bhagwat Vidyapith Trust Logo.jpeg",
  "The Pioneer Magnesia Works logo.jpeg",
];

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
  { n: "Baxter Pharmaceutical", s: "Pharma", y: "2024", c: "1,300 kWp", l: "/imgs/company-logos/baxter-pharma.png" },
  { n: "Siemens Energy", s: "Engineering", y: "2023", c: "1,300 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/02/siemens.jpg" },
  { n: "Jindal", s: "Steel / Infra", y: "2017", c: "1,000 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/03/OIP-53.jpg" },
  { n: "Raviraj Foils", s: "Manufacturing", y: "2022-23", c: "1,899 kWp", l: "https://www.ravirajfoils.com/images/logo.png" },
  { n: "Amol Minechem", s: "Chemicals", y: "2022-23", c: "1,899 kWp", l: "/imgs/company-logos/amol-minechem.jpg" },
  { n: "Akash Fashion", s: "Textiles", y: "2021", c: "999 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/01/akashfashion.png" },
  { n: "Somany Evergreen", s: "Tiles / MFG", y: "2022", c: "900 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/02/Somany-Evergreen.png" },
  { n: "Monginis Foods", s: "Food & Bev", y: "2018", c: "780 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2025/02/2017_monginis-Photoroom.webp" },
  { n: "Fuji SilverTech", s: "Manufacturing", y: "2025", c: "528.5 kWp", l: "/imgs/company-logos/fuji-silvertech.png" },
  { n: "Colgate-Palmolive", s: "FMCG", y: "2025", c: "250 kWp", l: "/imgs/company-logos/colgate-palmolive.png" },
  { n: "Rohan Dyes (RDL)", s: "Chemicals", y: "2020", c: "325 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/02/rohan-dyes-rdil-logonew.png" },
  { n: "Balkrishna", s: "Manufacturing", y: "2019", c: "325 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/03/logo-3.png" },
  { n: "Delhi University", s: "Education", y: "2017", c: "120 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/03/delhi-university-686256-1.jpg" },
  { n: "DPS Bopal", s: "Education", y: "2018", c: "90 kWp", l: "https://www.environomics.net.in/wp-content/uploads/2024/03/delhi-public-school-bopal-logo-1.jpg" },
  { n: "Busch Vacuum", s: "Engineering", y: "2020", c: "72 kWp + HVAC", l: "/imgs/company-logos/busch-vacuum.png" },
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

function getAssetFilename(path = "") {
  return path.split("/").pop() ?? "";
}

function formatClientNameFromLogoFilename(filename = "") {
  return String(filename ?? "")
    .replace(/\.[^.]+$/, "")
    .replace(/\blogo\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getSupplementalClients() {
  const allowedFiles = new Set(supplementalClientLogoFilenames);

  return Object.entries(supplementalClientLogoModules)
    .map(([path, src]) => {
      const filename = getAssetFilename(path);
      return { filename, src };
    })
    .filter((item) => allowedFiles.has(item.filename))
    .sort((left, right) => left.filename.localeCompare(right.filename))
    .map((item, index) => ({
      id: `supplemental-client-${index + 1}`,
      n: formatClientNameFromLogoFilename(item.filename),
      s: "Industrial",
      y: "",
      c: "",
      l: item.src,
    }));
}

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
  const supplementalClients = useMemo(() => getSupplementalClients(), []);
  const clients = useMemo(() => {
    const backendClients =
      Array.isArray(content?.clients) && content.clients.length ? content.clients : null;

    const baseClients = !backendClients
      ? fallbackClients
      : backendClients.map((client, index) => {
          const name = String(client.name ?? "").trim();
          const companyLogo = resolveMediaUrl(client.companyLogo ?? "");

          return {
            id: client.id ?? `client-${index}`,
            n: normalizeSingleLineText(name, `Client ${index + 1}`),
            s: normalizeSingleLineText(client.category, "Industrial"),
            y: normalizeSingleLineText(client.year),
            c: normalizeSingleLineText(client.capacity),
            l: companyLogo,
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
      mergedClients.push(client);
    });

    return mergedClients;
  }, [content, supplementalClients]);

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
