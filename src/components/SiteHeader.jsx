import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import logo from "../../imgs/LOGO (1).png";
import serviceImage1 from "../../imgs/S1.png";
import serviceImage2 from "../../imgs/S2.png";
import serviceImage4 from "../../imgs/HVAC IMAGE.jpeg";
import { usePublicContent } from "../context/PublicContentContext";
import { resolveMediaUrl } from "../lib/api";

const navItems = [
  { key: "home", label: "Home", href: "/" },
  { key: "about", label: "About Us", href: "/about" },
  { key: "services", label: "Services", href: "/services" },
  { key: "projects", label: "Our Projects", href: "/projects" },
  { key: "om", label: "Solar O&M", href: "/om" },
  { key: "clients", label: "Our Clients", href: "/clients" },
  { key: "testimonials", label: "Testimonials", href: "/testimonials" },
  { key: "innovation", label: "Innovation & R&D", href: "/innovation" },
];

const servicesMenu = [
  {
    title: "Solar Rooftop Solutions",
    description:
      "Engineering led rooftop EPC for commercial and industrial facilities with high yield design, fast payback, and long term monitoring.",
    href: "/services?tab=0",
    image: serviceImage1,
    imageAlt: "Solar rooftop solutions",
  },
  {
    title: "Ground Mount Solar Plants",
    description:
      "MW scale ground mounted plants optimized for land use, grid integration, and dependable generation across captive and IPP models.",
    href: "/services?tab=1",
    image: serviceImage2,
    imageAlt: "Ground mount solar plants",
  },
  {
    title: "HVAC & Pharmaceutical Clean Rooms",
    description:
      "Cleanroom HVAC engineering with GMP aligned design, validation, and airflow control for precision manufacturing.",
    href: "/services?tab=2",
    image: serviceImage4,
    imageAlt: "HVAC and pharmaceutical clean rooms",
  },
  {
    title: "Electrification, Automation & Energy Audits",
    description:
      "Industrial electrification, automation retrofits, and energy audits to reduce losses and improve operational efficiency.",
    href: "/services?tab=3",
    image: null,
    imageAlt: "",
  },
];

const routeKeys = {
  "/": "home",
  "/home": "home",
  "/about": "about",
  "/services": "services",
  "/projects": "projects",
  "/om": "om",
  "/clients": "clients",
  "/testimonials": "testimonials",
  "/innovation": "innovation",
  "/contact": "contact",
};

function fallbackLogo(label) {
  const safeLabel = label.replace(/&/g, "&amp;");
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 160">
      <rect width="480" height="160" rx="24" fill="#ffffff"/>
      <rect x="8" y="8" width="464" height="144" rx="18" fill="#0f1c2c"/>
      <text x="34" y="72" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="3">ENVIRONOMICS</text>
      <text x="34" y="112" fill="#93c5fd" font-family="Arial, sans-serif" font-size="14">${safeLabel}</text>
    </svg>
  `)}`;
}

function handleImageError(event, label) {
  const fallback = fallbackLogo(label);
  if (event.currentTarget.src !== fallback) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallback;
  }
}

function getActiveKey() {
  if (typeof window === "undefined") {
    return "home";
  }

  const pathname = window.location.pathname || "/";
  const [route] = pathname.split("?");
  return routeKeys[route] ?? "home";
}

export default function SiteHeader() {
  const { content } = usePublicContent();
  const activeKey = getActiveKey();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const managedLogoSrc =
    resolveMediaUrl(
      content?.settings?.headerLogo ||
        content?.settings?.companyLogo ||
        content?.seo?.schema?.logo
    ) || logo;
  const activeService =
    servicesMenu[Math.min(activeServiceIndex, servicesMenu.length - 1)] ?? servicesMenu[0];

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const originalBodyOverflow = document.body.style.overflow;
    const originalRootOverflow = document.documentElement.style.overflow;

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalRootOverflow;
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalRootOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        setIsMobileServicesOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      setIsMobileServicesOpen(false);
    }
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
  };

  const desktopLinkClass = (isActive) =>
    `font-headline relative inline-flex min-h-[80px] shrink-0 items-center justify-center whitespace-nowrap px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] xl:px-2.5 xl:text-[11px] 2xl:text-[12px] ${
      isActive
        ? "text-primary after:absolute after:bottom-[18px] after:left-1/2 after:h-0.5 after:w-10 after:-translate-x-1/2 after:rounded-full after:bg-primary"
        : "text-slate-500 transition-colors duration-200 hover:text-primary"
    }`;

  const mobileLinkClass = (isActive) =>
    `flex items-center justify-between rounded-2xl border px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.12em] transition-all ${
      isActive
        ? "border-primary bg-primary/5 text-primary"
        : "border-slate-200 bg-white text-slate-700 hover:border-primary/30 hover:bg-slate-50"
    }`;

  const mobileMenuDrawer =
    isMobileMenuOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-x-0 bottom-0 top-20 z-40 bg-slate-950/20 backdrop-blur-[2px] lg:hidden"
            onClick={closeMobileMenu}
          >
            <div
              id="mobile-nav-drawer"
              className="h-full min-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-slate-100 bg-white/95 px-4 py-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:px-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto flex max-w-xl flex-col gap-3 pb-6">
                {navItems.map((item) => {
                  if (item.key !== "services") {
                    return (
                      <a
                        key={item.key}
                        href={item.href}
                        className={mobileLinkClass(activeKey === item.key)}
                        onClick={closeMobileMenu}
                      >
                        <span>{item.label}</span>
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      </a>
                    );
                  }

                  return (
                    <div
                      key={item.key}
                      className={`rounded-[24px] border p-2 transition-all ${
                        activeKey === item.key || isMobileServicesOpen
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <button
                        type="button"
                        aria-expanded={isMobileServicesOpen}
                        className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold uppercase tracking-[0.12em] text-slate-800"
                        onClick={() => setIsMobileServicesOpen((current) => !current)}
                      >
                        <span>Services</span>
                        <span
                          className={`material-symbols-outlined text-xl transition-transform ${
                            isMobileServicesOpen ? "rotate-180 text-primary" : "text-slate-500"
                          }`}
                        >
                          expand_more
                        </span>
                      </button>

                      <div className={`${isMobileServicesOpen ? "mt-1 grid gap-2" : "hidden"}`}>
                        <a
                          href="/services"
                          className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-primary"
                          onClick={closeMobileMenu}
                        >
                          Services Overview
                        </a>
                        {servicesMenu.map((service) => (
                          <a
                            key={service.title}
                            href={service.href}
                            className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 transition-all hover:bg-slate-50 hover:text-primary"
                            onClick={closeMobileMenu}
                          >
                            {service.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}

                <a
                  href="/contact"
                  className="mt-2 inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-4 text-center text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_18px_45px_rgba(21,114,200,0.22)] transition-all hover:bg-primary/90"
                  onClick={closeMobileMenu}
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <nav className="fixed top-0 z-50 flex h-20 w-full items-center border-b border-slate-100 glass-nav shadow-sm">
        <div className="w-full px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <a href="/" className="flex shrink-0 items-center gap-3">
              <img
                src={managedLogoSrc}
                alt="Environomics Logo"
                className="h-12 w-auto object-contain sm:h-14"
                onError={(event) => handleImageError(event, "Environomics Logo")}
              />
            </a>

            <div className="flex shrink-0 items-center gap-2">
              <a
                href="/contact"
                className="hidden rounded-lg bg-primary px-5 py-3 font-label text-sm font-bold text-on-primary shadow-md transition-all hover:bg-primary/90 sm:inline-flex"
              >
                Contact Us
              </a>
              <button
                type="button"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-drawer"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-primary/30 hover:text-primary"
              >
                <span className="material-symbols-outlined text-[24px]">
                  {isMobileMenuOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>

          <div className="hidden w-full grid-cols-[minmax(165px,205px)_minmax(0,1fr)_auto] items-center gap-x-4 xl:gap-x-6 lg:grid">
            <a href="/" className="flex min-h-[80px] items-center justify-start pr-2 xl:pr-4">
              <img
                src={managedLogoSrc}
                alt="Environomics Logo"
                className="h-12 w-auto object-contain xl:h-14"
                onError={(event) => handleImageError(event, "Environomics Logo")}
              />
            </a>

            <div className="flex min-w-0 items-stretch justify-center gap-x-3 xl:gap-x-4 2xl:gap-x-5">
              {navItems.map((item) => {
                if (item.key !== "services") {
                  return (
                    <a
                      key={item.key}
                      href={item.href}
                      className={desktopLinkClass(activeKey === item.key)}
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <div
                    key={item.key}
                    className="group relative flex min-h-[80px] shrink-0 items-center justify-center"
                    onMouseEnter={() => {
                      setIsServicesOpen(true);
                      setActiveServiceIndex(0);
                    }}
                    onMouseLeave={() => {
                      setIsServicesOpen(false);
                      setActiveServiceIndex(0);
                    }}
                  >
                    <a
                      href={item.href}
                      className={desktopLinkClass(activeKey === item.key)}
                      aria-haspopup="true"
                      onClick={(event) => {
                        event.preventDefault();
                        setIsServicesOpen(true);
                        setActiveServiceIndex(0);
                      }}
                    >
                      {item.label}
                    </a>
                    <div
                      className={`absolute left-1/2 top-full mt-0 w-[720px] -translate-x-1/2 rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-300 ease-out ${
                        isServicesOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-4 opacity-0"
                      }`}
                    >
                      <div className="grid grid-cols-[240px_1fr] gap-6">
                        <div className="flex flex-col gap-3">
                          {servicesMenu.map((service, index) => (
                            <a
                              key={service.title}
                              href={service.href}
                              onMouseEnter={() => setActiveServiceIndex(index)}
                              onFocus={() => setActiveServiceIndex(index)}
                              onClick={() => {
                                setIsServicesOpen(false);
                                setActiveServiceIndex(0);
                              }}
                              className={`text-left text-[13px] uppercase tracking-wider transition-all duration-200 ${
                                activeServiceIndex === index
                                  ? "text-primary"
                                  : "text-slate-600 hover:text-primary"
                              }`}
                            >
                              <span className="block rounded-lg px-2 py-2 transition-all duration-200 hover:bg-slate-50">
                                {service.title}
                              </span>
                            </a>
                          ))}
                          <span className="mt-2 h-0.5 w-16 rounded-full bg-growth-green" aria-hidden="true" />
                        </div>
                        <div className="flex h-full min-h-[240px] flex-col rounded-xl border border-slate-100 bg-slate-50 p-5">
                          <div className="mb-5 h-40 overflow-hidden rounded-xl bg-white">
                            {activeService.image ? (
                              <img
                                src={activeService.image}
                                alt={activeService.imageAlt}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="mt-auto">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                              Service Spotlight
                            </span>
                            <h4 className="mt-2 font-headline text-lg text-slate-900">
                              {activeService.title}
                            </h4>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600">
                              {activeService.description}
                            </p>
                            <a
                              href={activeService.href}
                              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary transition-colors hover:text-primary/80"
                            >
                              Explore service
                              <span className="material-symbols-outlined text-base">arrow_forward</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              href="/contact"
              className={`font-label inline-flex items-center justify-self-end rounded-lg px-4 py-3 text-center text-sm font-bold transition-all xl:px-5 ${
                activeKey === "contact"
                  ? "bg-primary text-on-primary shadow-md"
                  : "bg-primary text-on-primary shadow-md hover:bg-primary/90"
              }`}
            >
              Contact Us
            </a>
          </div>
        </div>
      </nav>
      {mobileMenuDrawer}
    </>
  );
}
