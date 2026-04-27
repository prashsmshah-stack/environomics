import { useEffect, useMemo, useRef, useState } from "react";
import servicesSource from "../content/services_1.html?raw";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import {
  getServicePanels,
  getServiceTabIndexFromSearch,
  parseServicesSource,
  servicesPagePanelKeys,
  updateServiceSearch,
} from "../lib/servicesContent";

export default function ServicesPage() {
  const parsedContent = useMemo(() => parseServicesSource(servicesSource), []);
  const panels = useMemo(
    () => getServicePanels(parsedContent, servicesPagePanelKeys),
    [parsedContent]
  );
  const [activeIndex, setActiveIndex] = useState(() =>
    getServiceTabIndexFromSearch(servicesPagePanelKeys)
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
  }, [activeIndex, panels.length]);

  useEffect(() => {
    updateServiceSearch(activeIndex, servicesPagePanelKeys);
  }, [activeIndex]);

  const handlePanelClick = (event) => {
    const serviceAreaTab = event.target.closest("[data-service-area-tab]");
    if (serviceAreaTab) {
      event.preventDefault();

      const nextTabId = serviceAreaTab.getAttribute("data-service-area-tab");
      const panel = serviceAreaTab.closest(".tab-panel");
      if (!nextTabId || !panel) {
        return;
      }

      panel.querySelectorAll("[data-service-area-tab]").forEach((button) => {
        const isActive = button.getAttribute("data-service-area-tab") === nextTabId;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      panel.querySelectorAll("[data-service-area-panel]").forEach((contentPanel) => {
        const isActive = contentPanel.getAttribute("data-service-area-panel") === nextTabId;
        contentPanel.classList.toggle("active", isActive);
      });
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
      <style>{parsedContent.styles}</style>
      <SiteHeader />

      <main className="services-shell">
        <section className="services-section">
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
