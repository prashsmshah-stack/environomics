import { useEffect, useState } from "react";
import PageIntro from "../components/PageIntro";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { getLocalCompanyLogo } from "../lib/companyLogoRegistry";
import { fetchStrapiJson, resolveStrapiMediaUrl } from "../lib/strapiApi";

const fallbackClientNames = [
  "GRG Cotspin",
  "Honda India",
  "Welspun Group",
  "Otsuka Pharmaceuticals",
  "Baxter Pharmaceutical",
  "Siemens Energy",
  "Colgate-Palmolive",
  "Amol Minechem",
  "Raviraj Foils",
  "Akash Fashion",
  "Monginis Foods",
  "Fuji Silvertech",
  "Somany Evergreen",
  "Busch Vacuum",
  "Dangee Dums",
  "DPS Bopal",
  "JMC Papertech",
  "Jindal",
];

function getFallbackClients() {
  return fallbackClientNames
    .map((name, index) => ({
      id: `fallback-client-${index + 1}`,
      name,
      logoUrl: getLocalCompanyLogo(name),
      logoAlt: `${name} Logo`,
    }))
    .filter((client) => client.logoUrl);
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
      src={client.logoUrl || logoFallback(client.name)}
      alt={client.logoAlt || client.name}
      className="max-h-[64px] max-w-[160px] object-contain transition duration-300 group-hover:scale-[1.04]"
      loading="lazy"
      decoding="async"
      onError={(event) => handleLogoError(event, client.name)}
    />
  );
}

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [status, setStatus] = useState("loading");

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

  useEffect(() => {
    let isMounted = true;

    async function loadClients() {
      try {
        setStatus("loading");
        const response = await fetchStrapiJson("/api/public/clients");
        const backendClients = Array.isArray(response?.data)
          ? response.data
              .map((client, index) => {
                const name = String(client.name ?? "").trim() || `Client ${index + 1}`;

                return {
                  id: client.id ?? `client-${index}`,
                  name,
                  logoUrl: resolveStrapiMediaUrl(client.logo?.url),
                  logoAlt: String(client.logo?.alternativeText ?? "").trim() || name,
                };
              })
              .filter((client) => client.logoUrl)
          : [];
        const nextClients = backendClients.length ? backendClients : getFallbackClients();

        if (isMounted) {
          setClients(nextClients);
          setStatus("success");
        }
      } catch {
        if (isMounted) {
          setClients(getFallbackClients());
          setStatus("success");
        }
      }
    }

    loadClients();

    return () => {
      isMounted = false;
    };
  }, []);

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

            {clients.length ? (
              <div className="grid grid-cols-2 items-center gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {clients.map((client, index) => (
                  <div
                    key={client.id ?? client.name}
                    className="group flex h-[100px] items-center justify-center opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${0.04 * (index + 1)}s` }}
                    title={client.name}
                  >
                    <Logo client={client} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 px-6 py-12 text-center shadow-sm">
                <p className="helixa-regular text-base text-slate-600">
                  {status === "loading"
                    ? "Loading client logos..."
                    : "Client logos will appear here once they are added in the admin panel."}
                </p>
              </div>
            )}
          </div>
        </section>

      </main>

      <SiteFooter />

      </div>
  );
}
