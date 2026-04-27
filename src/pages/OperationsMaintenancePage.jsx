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

const omGalleryStyles = `
  .services-shell .om-cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
  }
  .services-shell .panel-cta.om-gallery-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.22);
    color: #ffffff;
    text-decoration: none;
  }
  .services-shell .panel-cta.om-gallery-cta:hover {
    background: rgba(255,255,255,0.2);
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
  @media (max-width: 768px) {
    .services-shell .om-cta-row {
      gap: 10px;
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

  if (!container || !cta || container.querySelector(".om-gallery-cta")) {
    return panelHtml;
  }

  panelTag?.remove();
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
    <div className="bg-white text-on-surface">
      <style>{`${parsedContent.styles}\n${omGalleryStyles}`}</style>
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
