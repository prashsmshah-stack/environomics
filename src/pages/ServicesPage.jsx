import { useEffect, useMemo, useRef, useState } from "react";
import servicesSource from "../content/services_1.html?raw";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

const fallbackLabels = [
  "SOLAR ROOFTOP SOLUTIONS",
  "GROUND MOUNT SOLAR PLANTS",
  "SOLAR OPERATIONS & MAINTENANCE",
  "HVAC & PHARMACEUTICAL CLEAN ROOMS",
  "ELECTRIFICATION, AUTOMATION & ENERGY AUDITS",
];

function slugify(value = "") {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripInlineHandlers(markup = "") {
  return markup
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "");
}

function normalizeVisibleText(value = "") {
  return value
    .replace(/(\d+)\s*[–—-]\s*(\d+)/g, "$1 to $2")
    .replace(/([A-Za-z])\s*[–—-]\s*([A-Za-z])/g, (match, start, end) =>
      start.length === 1 && end.length === 1 ? `${start} to ${end}` : `${start} ${end}`
    )
    .replace(/(\d+)-(?=[A-Za-z])/g, "$1 ")
    .replace(/([A-Za-z])-(?=[A-Za-z])/g, "$1 ")
    .replace(/\s+[–—-]\s+/g, ", ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function normalizeTextTree(root) {
  if (typeof document === "undefined" || !root) {
    return;
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    node.textContent = normalizeVisibleText(node.textContent ?? "");
  });
}

function cleanPanelTags(root) {
  if (!root) {
    return;
  }

  root.querySelectorAll(".panel-tag").forEach((node) => {
    node.textContent = (node.textContent ?? "").replace(/^\s*\d+\s*[–—-]\s*/, "").trim();
  });
}

function sanitizeStyle(styleText = "") {
  let cleaned = styleText.replace(/\r\n/g, "\n");

  cleaned = cleaned.replace(
    /\/\*[^*]*Nav[^*]*\*\/[\s\S]*?(?=\/\*[^*]*Services Section[^*]*\*\/)/i,
    ""
  );
  cleaned = cleaned.replace(/\/\*[^*]*Footer[^*]*\*\/[\s\S]*$/i, "");

  cleaned = cleaned.replace(/(^|\n)\s*nav[^{]*\{[\s\S]*?\}\s*/gi, "");
  cleaned = cleaned.replace(/(^|\n)\s*\.nav-[^{]*\{[\s\S]*?\}\s*/gi, "");
  cleaned = cleaned.replace(/(^|\n)\s*footer[^{]*\{[\s\S]*?\}\s*/gi, "");

  const overrides = `
    .services-shell { background: var(--off-white); min-height: 100vh; }
    .services-shell .services-section { padding-top: 80px; }
    .services-shell .panel-cta { text-decoration: none; }
    .services-shell { font-family: "Inter", sans-serif; }
    .services-shell p,
    .services-shell li,
    .services-shell .panel-hero p,
    .services-shell .panel-metric .m-lbl,
    .services-shell .card p,
    .services-shell .step-content p,
    .services-shell .full-card p,
    .services-shell .accent-card p,
    .services-shell .faq-a p,
    .services-shell .ref-card .detail {
      font-family: "Inter", sans-serif;
    }
    .services-shell h1,
    .services-shell h2,
    .services-shell h3,
    .services-shell h4,
    .services-shell .sub-title,
    .services-shell .panel-tag,
    .services-shell .panel-metric .m-val,
    .services-shell .card h3,
    .services-shell .step-num,
    .services-shell .step-content h4,
    .services-shell .full-card h3,
    .services-shell .accent-card h3,
    .services-shell .ref-card .client,
    .services-shell .faq-q span,
    .services-shell .service-list-item {
      font-family: "Plus Jakarta Sans", sans-serif;
    }
    .services-shell .panel-cta,
    .services-shell .tag,
    .services-shell .ref-card .kw,
    .services-shell .faq-toggle {
      font-family: "Inter", sans-serif;
    }
    .services-shell .panel-tag {
      display: block;
      margin-bottom: 18px;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      color: #6ee7b7;
      font-size: clamp(1.45rem, 2.4vw, 2.15rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.12;
      text-transform: none;
    }
    @media (max-width: 768px) {
      .services-shell .services-section { padding-top: 80px; padding-left: 20px; padding-right: 20px; }
    }
  `;

  return `${cleaned}\n${overrides}`;
}

function parseServicesSource(source) {
  if (typeof DOMParser === "undefined") {
    return { styles: sanitizeStyle(""), labels: fallbackLabels, panels: [] };
  }

  const doc = new DOMParser().parseFromString(source, "text/html");
  const styleText = doc.querySelector("style")?.textContent ?? "";
  const labels = Array.from(doc.querySelectorAll(".service-list-item"))
    .map((node) => normalizeVisibleText(node.textContent?.trim() ?? ""))
    .filter(Boolean);
  const panels = Array.from(doc.querySelectorAll(".tab-panel")).map((panel, index) => {
    const clonedPanel = panel.cloneNode(true);
    cleanPanelTags(clonedPanel);
    normalizeTextTree(clonedPanel);

    return {
      id: panel.getAttribute("id") || `panel-${index}`,
      html: stripInlineHandlers(clonedPanel.innerHTML),
    };
  });

  return {
    styles: sanitizeStyle(styleText),
    labels: labels.length ? labels : fallbackLabels,
    panels,
  };
}

function getTabIndexFromSearch(labels) {
  if (typeof window === "undefined") {
    return 0;
  }
  const tabValue = new URLSearchParams(window.location.search).get("tab");
  if (!tabValue) {
    return 0;
  }
  const numeric = Number.parseInt(tabValue, 10);
  if (Number.isFinite(numeric)) {
    return Math.min(Math.max(numeric, 0), labels.length - 1);
  }
  const slug = tabValue.toLowerCase();
  const index = labels.findIndex((label) => slugify(label) === slug);
  return index >= 0 ? index : 0;
}

function updateSearch(index) {
  if (typeof window === "undefined") {
    return;
  }
  const nextSearch = `?tab=${index}`;
  if (window.location.search !== nextSearch) {
    window.history.replaceState(null, "", `${window.location.pathname}${nextSearch}`);
  }
}

export default function ServicesPage() {
  const { styles, labels, panels } = useMemo(
    () => parseServicesSource(servicesSource),
    []
  );
  const [activeIndex, setActiveIndex] = useState(() => getTabIndexFromSearch(labels));
  const panelsRef = useRef(null);

  useEffect(() => {
    if (!panelsRef.current) {
      return undefined;
    }

    const panel = panelsRef.current.querySelector(".tab-panel.active");
    if (!panel) {
      return undefined;
    }

    const revealTargets = panel.querySelectorAll(
      ".card, .full-card, .ref-card, .step, .accent-card"
    );
    revealTargets.forEach((el) => el.classList.add("reveal"));

    if (typeof IntersectionObserver === "undefined") {
      revealTargets.forEach((el) => el.classList.add("visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealTargets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeIndex, panels.length]);

  const handleTabClick = (index) => {
    setActiveIndex(index);
    updateSearch(index);
    if (panelsRef.current) {
      panelsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePanelClick = (event) => {
    const cta = event.target.closest(".panel-cta");
    if (cta) {
      event.preventDefault();
      window.history.pushState(null, "", "/contact?focus=form");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    const faqButton = event.target.closest(".faq-q");
    if (!faqButton) {
      return;
    }
    event.preventDefault();
    const item = faqButton.closest(".faq-item");
    const panel = faqButton.closest(".tab-panel");
    if (!item || !panel) {
      return;
    }
    const items = panel.querySelectorAll(".faq-item");
    const wasOpen = item.classList.contains("open");
    items.forEach((node) => node.classList.remove("open"));
    if (!wasOpen) {
      item.classList.add("open");
    }
  };

  return (
    <div className="bg-white text-on-surface">
      <style>{styles}</style>
      <SiteHeader />
      <main className="services-shell">
        <section className="services-section">
          <div className="service-list-panel" role="tablist" aria-label="Environomics services">
            {labels.map((label, index) => (
              <button
                key={`${label}-${index}`}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-controls={panels[index]?.id}
                className={`service-list-item ${activeIndex === index ? "active" : ""}`}
                onClick={() => handleTabClick(index)}
              >
                {label}
              </button>
            ))}
            <div className="service-list-bar" />
          </div>

          <div className="tab-panels" ref={panelsRef} onClick={handlePanelClick}>
            {panels.map((panel, index) => (
              <div
                key={panel.id}
                id={panel.id}
                className={`tab-panel ${activeIndex === index ? "active" : ""}`}
                dangerouslySetInnerHTML={{ __html: panel.html }}
              />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
