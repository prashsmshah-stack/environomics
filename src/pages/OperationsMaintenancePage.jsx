import { useEffect, useMemo, useRef, useState } from "react";
import servicesSource from "../content/services_1.html?raw";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import {
  getServicePanels,
  operationsMaintenancePanelKey,
  parseServicesSource,
} from "../lib/servicesContent";

const omGalleryImages = [
  {
    src: "/imgs/om/om-gallery-01.jpeg",
    alt: "Solar O&M site image 1",
  },
  {
    src: "/imgs/om/om-gallery-02.jpeg",
    alt: "Solar O&M site image 2",
  },
  {
    src: "/imgs/om/om-gallery-03.jpeg",
    alt: "Solar O&M site image 3",
  },
  {
    src: "/imgs/om/om-gallery-04.jpeg",
    alt: "Solar O&M site image 4",
  },
  {
    src: "/imgs/om/om-gallery-05.jpeg",
    alt: "Solar O&M site image 5",
  },
  {
    src: "/imgs/om/om-gallery-06.jpeg",
    alt: "Solar O&M site image 6",
  },
  {
    src: "/imgs/om/om-gallery-07.jpeg",
    alt: "Solar O&M site image 7",
  },
  {
    src: "/imgs/om/om-gallery-08.jpeg",
    alt: "Solar O&M site image 8",
  },
  {
    src: "/imgs/om/om-gallery-09.jpeg",
    alt: "Solar O&M site image 9",
  },
  {
    src: "/imgs/om/om-gallery-10.jpeg",
    alt: "Solar O&M site image 10",
  },
  {
    src: "/imgs/om/om-gallery-11.jpeg",
    alt: "Solar O&M site image 11",
  },
  {
    src: "/imgs/om/om-gallery-12.jpeg",
    alt: "Solar O&M site image 12",
  },
];

const omGalleryStyles = `
  .services-shell .om-cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
  }
  .services-shell .panel-cta.om-gallery-cta {
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.22);
    color: #ffffff;
  }
  .services-shell .panel-cta.om-gallery-cta:hover {
    background: rgba(255,255,255,0.2);
  }
  .services-shell .om-gallery-wrap {
    margin-top: 40px;
    border-radius: 32px;
    border: 1px solid rgba(209, 213, 219, 0.9);
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
    padding: 28px;
  }
  .services-shell .om-gallery-header {
    margin-bottom: 22px;
  }
  .services-shell .om-gallery-title {
    margin: 0;
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: clamp(1.65rem, 2.8vw, 2.5rem);
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.03em;
    color: #0d1b2a;
  }
  .services-shell .om-gallery-description {
    margin: 12px 0 0;
    max-width: 760px;
    font-family: "Inter", sans-serif;
    font-size: 1rem;
    line-height: 1.7;
    color: #4c596b;
  }
  .services-shell .om-gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }
  .services-shell .om-gallery-card {
    display: block;
    overflow: hidden;
    border-radius: 22px;
    border: 1px solid rgba(226, 232, 240, 0.95);
    background: #ffffff;
    box-shadow: 0 12px 36px rgba(15, 23, 42, 0.07);
    transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
  }
  .services-shell .om-gallery-card:hover {
    transform: translateY(-6px);
    border-color: rgba(21, 114, 200, 0.28);
    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
  }
  .services-shell .om-gallery-card img {
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    display: block;
  }
  @media (max-width: 1024px) {
    .services-shell .om-gallery-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 768px) {
    .services-shell .om-gallery-wrap {
      margin-top: 28px;
      padding: 20px;
      border-radius: 24px;
    }
    .services-shell .om-cta-row {
      gap: 10px;
    }
    .services-shell .om-gallery-grid {
      grid-template-columns: 1fr;
    }
  }
`;

function enhanceOperationsMaintenancePanelHtml(panelHtml) {
  if (typeof DOMParser === "undefined" || !panelHtml) {
    return panelHtml;
  }

  const doc = new DOMParser().parseFromString(`<div class="panel-shell">${panelHtml}</div>`, "text/html");
  const container = doc.querySelector(".panel-shell");
  const cta = container?.querySelector(".panel-hero-content .panel-cta");

  if (!container || !cta || container.querySelector(".om-gallery-cta")) {
    return panelHtml;
  }

  const ctaRow = doc.createElement("div");
  ctaRow.className = "om-cta-row";

  cta.parentNode.insertBefore(ctaRow, cta);
  ctaRow.appendChild(cta);

  const galleryButton = doc.createElement("button");
  galleryButton.className = "panel-cta om-gallery-cta";
  galleryButton.type = "button";
  galleryButton.setAttribute("data-om-gallery-toggle", "true");
  galleryButton.innerHTML =
    'View Solar O&amp;M Images <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
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
  const galleryRef = useRef(null);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);

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

  useEffect(() => {
    if (!isGalleryVisible || !galleryRef.current) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [isGalleryVisible]);

  const handlePanelClick = (event) => {
    const galleryCta = event.target.closest(".om-gallery-cta");
    if (galleryCta) {
      event.preventDefault();

      if (isGalleryVisible) {
        galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        setIsGalleryVisible(true);
      }
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

            {isGalleryVisible ? (
              <section ref={galleryRef} className="om-gallery-wrap animate-fade-in-up">
                <div className="om-gallery-header">
                  <h2 className="om-gallery-title">Latest Solar O&amp;M Images</h2>
                  <p className="om-gallery-description">
                    A live look at the newest operations and maintenance site images added for the
                    Environomics solar O&amp;M portfolio.
                  </p>
                </div>

                <div className="om-gallery-grid">
                  {omGalleryImages.map((image, index) => (
                    <a
                      key={image.src}
                      href={image.src}
                      target="_blank"
                      rel="noreferrer"
                      className="om-gallery-card"
                      aria-label={`Open Solar O&M image ${index + 1}`}
                    >
                      <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                    </a>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
