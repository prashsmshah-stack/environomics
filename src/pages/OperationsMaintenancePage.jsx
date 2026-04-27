import { useEffect, useMemo, useRef } from "react";
import servicesSource from "../content/services_1.html?raw";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import {
  getServicePanels,
  operationsMaintenancePanelKey,
  parseServicesSource,
} from "../lib/servicesContent";
import { OPERATIONS_MAINTENANCE_GALLERY_PATH } from "../lib/operationsMaintenanceGallery";

const operationsMaintenanceServiceIcons = {
  "Scheduled Preventive Maintenance": `
    <svg class="om-service-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14.7 6.1a4.3 4.3 0 0 0-5.65 5.65L4.5 16.3a1.5 1.5 0 0 0 0 2.12l1.08 1.08a1.5 1.5 0 0 0 2.12 0l4.55-4.55a4.3 4.3 0 0 0 5.65-5.65l-2.65 2.65-3.3-.7-.7-3.3 2.65-2.65Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `,
  "Remote Monitoring & Performance Analytics": `
    <svg class="om-service-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
      <path d="M7 16v-4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
      <path d="M12 16V10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
      <path d="M17 16V7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
      <path d="m6 11.5 4-4 3.3 3.3L19 5.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `,
  "Corrective Maintenance & Emergency Response": `
    <svg class="om-service-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m7 7 10 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
      <path d="m17 7-2.6 2.6 2 2L19 9a2.2 2.2 0 0 0-2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="m5 15 4-4 4 4-4 4H7l-2-2v-2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="m8.4 5.1 1.8 1.8-4.9 4.9a2.4 2.4 0 0 1-3.4 0l3.1-3.1a2.4 2.4 0 0 1 3.4-3.4Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `,
  "Annual Performance Audit": `
    <svg class="om-service-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5.2" y="4.8" width="13.6" height="14.4" rx="1.8" stroke="currentColor" stroke-width="1.8"></rect>
      <path d="M9 14.8v-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
      <path d="M12 14.8V9.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
      <path d="M15 14.8v-2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
      <path d="M8.2 8h7.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
    </svg>
  `,
};

const OPERATIONS_MAINTENANCE_EYEBROW_HTML = "Solar Operations &amp;<br />Maintenance";
const OPERATIONS_MAINTENANCE_HEADLINE_HTML =
  "Your Solar Asset Works 365<br />Days a Year. So Do We.";

const operationsMaintenancePageStyles = `
  .services-shell {
    color: #0d1b2a;
  }
  .services-shell .services-section {
    max-width: 1120px;
  }
  .services-shell .panel-hero {
    grid-template-columns: minmax(0, 1fr) minmax(290px, 340px);
    gap: 28px;
    padding: 38px 40px 48px 20px;
    border-radius: 0;
    background: linear-gradient(135deg, #0a4f88 0%, #0a4f88 58%, #0d5a98 100%);
    box-shadow: 0 24px 70px rgba(15, 47, 82, 0.16);
  }
  .services-shell .panel-hero::before {
    top: 0;
    right: 140px;
    width: 240px;
    height: 220px;
    border-radius: 0;
    background: rgba(255, 255, 255, 0.035);
    clip-path: polygon(28% 0, 100% 0, 100% 100%, 0 100%);
  }
  .services-shell .panel-hero::after {
    right: -40px;
    bottom: -86px;
    width: 250px;
    height: 250px;
    background: rgba(21, 114, 200, 0.28);
  }
  .services-shell .panel-hero-content {
    position: relative;
    z-index: 1;
    max-width: 680px;
    padding-top: 2px;
  }
  .services-shell .panel-tag.om-eyebrow {
    display: block;
    max-width: 420px;
    margin: 0 0 20px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #72e7af;
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: clamp(1.9rem, 2.55vw, 2.45rem);
    font-weight: 800;
    line-height: 0.96;
    letter-spacing: -0.03em;
    text-transform: none;
  }
  .services-shell .om-main-heading {
    max-width: 660px;
    margin: 0 0 18px;
    color: #ffffff;
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: clamp(2.05rem, 3vw, 2.75rem);
    font-weight: 800;
    line-height: 1.02;
    letter-spacing: -0.03em;
  }
  .services-shell .panel-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 22px;
    border-radius: 10px;
    background: #2aaf6f;
    color: #ffffff;
    font-family: "Inter", sans-serif;
    font-size: 0.92rem;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: none;
    box-shadow: none;
  }
  .services-shell .panel-cta:not(.om-gallery-cta):hover {
    background: #249a62;
    transform: none;
  }
  .services-shell .panel-metric .m-val {
    color: #ffffff;
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: clamp(1.55rem, 2.2vw, 1.95rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .services-shell .panel-metric .m-lbl {
    color: rgba(190, 206, 225, 0.72);
    font-family: "Inter", sans-serif;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
  }
  .services-shell .panel-metrics {
    padding: 22px 26px 14px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.11) 0%, rgba(255, 255, 255, 0.08) 100%);
    backdrop-filter: blur(2px);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }
  .services-shell .panel-metric {
    padding: 24px 0 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
  .services-shell .panel-metric:first-child {
    padding-top: 6px;
  }
  .services-shell .panel-metric:last-child {
    padding-bottom: 6px;
  }
  .services-shell .om-cta-row {
    display: flex;
    flex-wrap: nowrap;
    gap: 12px;
    align-items: center;
  }
  .services-shell .panel-cta.om-gallery-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 20px;
    border: 1px solid rgba(255, 255, 255, 0.24);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    text-decoration: none;
    font-size: 0.92rem;
    box-shadow: none;
  }
  .services-shell .panel-cta.om-gallery-cta:hover {
    background: rgba(255, 255, 255, 0.16);
    color: #ffffff;
  }
  .services-shell .om-gallery-cta svg {
    width: 18px;
    height: 18px;
  }
  .services-shell .om-service-icon {
    display: block;
    width: 24px;
    height: 24px;
    color: #0059a2;
  }
  .services-shell .sub-title {
    color: #0d1b2a;
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: clamp(1.2rem, 1.5vw, 1.5rem);
    font-weight: 800;
    letter-spacing: -0.025em;
  }
  .services-shell .om-hero-copy {
    max-width: 600px;
    margin-bottom: 28px;
    color: rgba(226, 236, 247, 0.74);
    font-family: "Inter", sans-serif;
    font-size: 0.94rem;
    font-weight: 500;
    line-height: 1.68;
  }
  .services-shell .card h3,
  .services-shell .accent-card h3,
  .services-shell .faq-q span {
    color: #0d1b2a;
    font-family: "Plus Jakarta Sans", sans-serif;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .services-shell .card h3 {
    font-size: 0.96rem;
  }
  .services-shell .card p,
  .services-shell .faq-a p {
    color: #4c596b;
    font-family: "Inter", sans-serif;
    font-size: 0.9rem;
    line-height: 1.68;
  }
  .services-shell .accent-card {
    box-shadow: 0 20px 55px rgba(15, 23, 42, 0.08);
  }
  .services-shell .accent-card h3 {
    color: #ffffff;
    font-size: 1.12rem;
  }
  .services-shell .accent-card p,
  .services-shell .accent-card ul li {
    color: rgba(255, 255, 255, 0.86);
    font-family: "Inter", sans-serif;
    font-size: 0.9rem;
    line-height: 1.68;
  }
  .services-shell .tag {
    font-family: "Inter", sans-serif;
    font-weight: 700;
  }
  .services-shell .faq-q span {
    font-size: 0.94rem;
  }
  @media (max-width: 768px) {
    .services-shell .panel-hero {
      grid-template-columns: 1fr;
      gap: 28px;
      padding: 30px 20px 36px;
      border-radius: 0;
    }
    .services-shell .panel-tag.om-eyebrow {
      max-width: 360px;
      margin-bottom: 18px;
      font-size: clamp(1.65rem, 5.5vw, 2rem);
    }
    .services-shell .om-main-heading {
      max-width: 100%;
      margin-bottom: 18px;
      font-size: clamp(1.85rem, 5.8vw, 2.45rem);
    }
    .services-shell .panel-metrics {
      padding: 18px 20px 14px;
    }
    .services-shell .panel-metric {
      padding: 18px 0 14px;
    }
    .services-shell .panel-metric .m-val {
      font-size: 1.72rem;
    }
    .services-shell .om-cta-row {
      flex-wrap: wrap;
      gap: 10px;
    }
    .services-shell .om-hero-copy,
    .services-shell .card p,
    .services-shell .faq-a p,
    .services-shell .accent-card p,
    .services-shell .accent-card ul li {
      font-size: 0.88rem;
    }
    .services-shell .sub-title {
      font-size: 1.14rem;
    }
  }
  @media (max-width: 480px) {
    .services-shell .panel-cta {
      width: 100%;
      justify-content: center;
      padding: 12px 14px;
      font-size: 0.8rem;
    }
    .services-shell .panel-cta.om-gallery-cta {
      width: 100%;
    }
    .services-shell .panel-tag.om-eyebrow {
      max-width: 300px;
      font-size: 1.52rem;
    }
    .services-shell .om-main-heading {
      font-size: 1.68rem;
      line-height: 0.98;
    }
    .services-shell .om-cta-row {
      gap: 8px;
    }
    .services-shell .panel-metric .m-lbl {
      font-size: 0.68rem;
    }
    .services-shell .om-hero-copy,
    .services-shell .card p,
    .services-shell .faq-a p,
    .services-shell .accent-card p,
    .services-shell .accent-card ul li {
      font-size: 0.84rem;
      line-height: 1.64;
    }
  }
`;

function replaceOperationsMaintenanceServiceIcons(container) {
  if (!container) {
    return;
  }

  const cards = container.querySelectorAll(".content-grid .card");
  cards.forEach((card) => {
    const title = card.querySelector("h3")?.textContent?.trim();
    const icon = card.querySelector(".card-icon");
    const iconMarkup = title ? operationsMaintenanceServiceIcons[title] : "";

    if (icon && iconMarkup) {
      icon.innerHTML = iconMarkup;
    }
  });
}

function enhanceOperationsMaintenancePanelHtml(panelHtml) {
  if (typeof DOMParser === "undefined" || !panelHtml) {
    return panelHtml;
  }

  const doc = new DOMParser().parseFromString(`<div class="panel-shell">${panelHtml}</div>`, "text/html");
  const container = doc.querySelector(".panel-shell");
  const cta = container?.querySelector(".panel-hero-content .panel-cta");
  const panelTag = container?.querySelector(".panel-hero-content .panel-tag");
  const heroTitle = container?.querySelector(".panel-hero-content h2");
  const heroLead = container?.querySelector(".panel-hero-content .om-hero-lead");

  if (!container || !cta || container.querySelector(".om-gallery-cta")) {
    return panelHtml;
  }

  if (panelTag) {
    panelTag.classList.add("om-eyebrow");
    panelTag.innerHTML = OPERATIONS_MAINTENANCE_EYEBROW_HTML;
  }

  if (heroTitle) {
    heroTitle.classList.add("om-main-heading");
    heroTitle.innerHTML = OPERATIONS_MAINTENANCE_HEADLINE_HTML;
  }

  heroLead?.remove();
  replaceOperationsMaintenanceServiceIcons(container);

  const ctaRow = doc.createElement("div");
  ctaRow.className = "om-cta-row";

  cta.parentNode.insertBefore(ctaRow, cta);
  ctaRow.appendChild(cta);

  const galleryButton = doc.createElement("a");
  galleryButton.className = "panel-cta om-gallery-cta";
  galleryButton.href = OPERATIONS_MAINTENANCE_GALLERY_PATH;
  galleryButton.setAttribute("aria-label", "View the Solar O and M image gallery");
  galleryButton.innerHTML =
    'View Solar O&amp;M Images <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2.5"></rect><circle cx="8.5" cy="10" r="1.6"></circle><path d="M6 16l4.2-4.2a1.6 1.6 0 0 1 2.26 0L15 14.3l1.24-1.24a1.6 1.6 0 0 1 2.26 0L21 15.6"></path></svg>';
  ctaRow.appendChild(galleryButton);

  return container.innerHTML;
}

export default function OperationsMaintenancePage() {
  const parsedContent = useMemo(() => parseServicesSource(servicesSource), []);
  const panels = useMemo(
    () =>
      getServicePanels(parsedContent, [operationsMaintenancePanelKey]).map((panel) => ({
        ...panel,
        html: enhanceOperationsMaintenancePanelHtml(panel.html),
      })),
    [parsedContent]
  );
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
    revealTargets.forEach((element) => element.classList.add("reveal"));

    if (typeof IntersectionObserver === "undefined") {
      revealTargets.forEach((element) => element.classList.add("visible"));
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

    revealTargets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [panels.length]);

  const handlePanelClick = (event) => {
    const galleryCta = event.target.closest(".om-gallery-cta");
    if (galleryCta) {
      return;
    }

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
    <div className="bg-white font-body text-on-surface selection:bg-primary/20">
      <style>{`${parsedContent.styles}\n${operationsMaintenancePageStyles}`}</style>
      <SiteHeader />

      <main className="services-shell">
        <section className="services-section">
          <div className="tab-panels" ref={panelsRef} onClick={handlePanelClick}>
            {panels.map((panel) => (
              <div
                key={panel.id}
                id={panel.id}
                className="tab-panel active"
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
