const servicePanelConfig = [
  {
    key: "solar-rooftop",
    label: "SOLAR ROOFTOP SOLUTIONS",
    panelId: "panel0",
  },
  {
    key: "ground-mount",
    label: "GROUND MOUNT SOLAR PLANTS",
    panelId: "panel1",
  },
  {
    key: "om",
    label: "SOLAR OPERATIONS & MAINTENANCE",
    panelId: "panel2",
  },
  {
    key: "hvac",
    label: "HVAC & PHARMACEUTICAL CLEAN ROOMS",
    panelId: "panel3",
  },
  {
    key: "automation",
    label: "ELECTRIFICATION, AUTOMATION & ENERGY AUDITS",
    panelId: "panel4",
  },
];

export const servicesPagePanelKeys = [
  "solar-rooftop",
  "ground-mount",
  "hvac",
  "automation",
];

export const operationsMaintenancePanelKey = "om";

const serviceConfigByKey = new Map(
  servicePanelConfig.map((config, index) => [
    config.key,
    { ...config, sourceIndex: index },
  ])
);

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
    .replace(/(\d+)\s*[â€“â€”-]\s*(\d+)/g, "$1 to $2")
    .replace(/([A-Za-z])\s*[â€“â€”-]\s*([A-Za-z])/g, (match, start, end) =>
      start.length === 1 && end.length === 1 ? `${start} to ${end}` : `${start} ${end}`
    )
    .replace(/(\d+)-(?=[A-Za-z])/g, "$1 ")
    .replace(/([A-Za-z])-(?=[A-Za-z])/g, "$1 ")
    .replace(/\s+[â€“â€”-]\s+/g, ", ")
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

function stripPanelTagPrefix(value = "") {
  return String(value ?? "")
    .replace(/^\s*\d+\s*(?:[\u2012-\u2015-]+|[âÃ¢€"'`]+)?\s*/u, "")
    .trim();
}

function cleanPanelTags(root, panelId) {
  if (!root) {
    return;
  }

  const panelLabel = servicePanelConfig.find((config) => config.panelId === panelId)?.label ?? "";

  root.querySelectorAll(".panel-tag").forEach((node) => {
    node.textContent = (node.textContent ?? "")
      .replace(/^\s*\d+\s*[â€“â€”-]\s*/, "")
      .trim();
  });
  root.querySelectorAll(".panel-tag").forEach((node) => {
    const cleanedText = stripPanelTagPrefix(node.textContent ?? "");
    node.textContent = cleanedText || panelLabel;
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
    .services-shell { background: var(--off-white); min-height: 100vh; font-family: "Inter", sans-serif; }
    .services-shell .services-section { padding-top: 80px; }
    .services-shell .panel-cta { text-decoration: none; }
    .services-shell * {
      font-family: inherit;
    }
    .services-shell .material-symbols-outlined {
      font-family: "Material Symbols Outlined";
      font-weight: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-smoothing: antialiased;
      font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
    }
    .services-shell h1,
    .services-shell h2,
    .services-shell h3,
    .services-shell h4,
    .services-shell h5,
    .services-shell h6,
    .services-shell .sub-title,
    .services-shell .panel-metric .m-val,
    .services-shell .card h3,
    .services-shell .step-num,
    .services-shell .step-content h4,
    .services-shell .full-card h3,
    .services-shell .accent-card h3,
    .services-shell .ref-card .client,
    .services-shell .faq-q span {
      font-family: "Plus Jakarta Sans", sans-serif;
    }
    .services-shell .panel-tag {
      display: inline-block;
      margin-bottom: 18px;
      padding: 6px 14px;
      border: 1px solid rgba(110, 231, 183, 0.4);
      border-radius: 999px;
      background: rgba(42, 175, 111, 0.18);
      color: #6ee7b7;
      font-family: "Inter", sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.18em;
      line-height: 1.2;
      text-transform: uppercase;
    }
    .services-shell .service-intro-copy {
      display: grid;
      gap: 14px;
    }
    .services-shell .content-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }
    .services-shell .card,
    .services-shell .service-media-card,
    .services-shell .service-pillar {
      border: 1px solid rgba(15, 23, 42, 0.08);
      background: #ffffff;
      box-shadow: var(--shadow-sm);
    }
    .services-shell .card {
      border-radius: 24px;
      padding: 24px 24px 22px;
    }
    .services-shell .card h3 {
      margin-bottom: 10px;
      color: #091322;
    }
    .services-shell .card p {
      margin: 0;
      color: #5f6775;
      line-height: 1.7;
    }
    .services-shell .service-media-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
      margin-bottom: 28px;
    }
    .services-shell .service-media-card {
      overflow: hidden;
      border-radius: 24px;
    }
    .services-shell .service-media-card img {
      display: block;
      width: 100%;
      height: 240px;
      object-fit: cover;
    }
    .services-shell .service-media-caption {
      display: grid;
      gap: 4px;
      padding: 16px 18px 18px;
    }
    .services-shell .service-media-caption strong,
    .services-shell .service-pillar h3 {
      font-family: "Plus Jakarta Sans", sans-serif;
      color: #091322;
    }
    .services-shell .service-media-caption strong {
      font-size: 15px;
      font-weight: 700;
    }
    .services-shell .service-media-caption span {
      font-size: 13px;
      color: #5f6775;
      line-height: 1.6;
    }
    .services-shell .service-pillar-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }
    .services-shell .service-pillar {
      padding: 20px 22px;
      border-radius: 22px;
    }
    .services-shell .service-pillar h3 {
      margin-bottom: 8px;
      font-size: 16px;
      font-weight: 700;
    }
    .services-shell .service-pillar p {
      margin: 0;
      color: #5f6775;
      line-height: 1.7;
    }
    .services-shell .service-area-tabs {
      display: grid;
      gap: 20px;
      margin-bottom: 32px;
    }
    .services-shell .service-area-tab-list {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
    }
    .services-shell .service-area-tab {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 16px 18px;
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 20px;
      background: #ffffff;
      color: #0f172a;
      text-align: left;
      cursor: pointer;
      transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
      box-shadow: var(--shadow-sm);
    }
    .services-shell .service-area-tab:hover {
      transform: translateY(-2px);
      border-color: rgba(0, 89, 162, 0.18);
      box-shadow: var(--shadow-md);
    }
    .services-shell .service-area-tab.active {
      border-color: rgba(0, 89, 162, 0.22);
      background: linear-gradient(135deg, #ffffff 0%, #eef6ff 100%);
      box-shadow: 0 16px 32px rgba(0, 89, 162, 0.12);
    }
    .services-shell .service-area-tab-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: #e8f2ff;
      color: #0059a2;
      flex-shrink: 0;
    }
    .services-shell .service-area-tab-icon svg {
      width: 22px;
      height: 22px;
      display: block;
    }
    .services-shell .service-area-tab span:last-child {
      font-family: "Plus Jakarta Sans", sans-serif;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.45;
    }
    .services-shell .service-area-panels {
      position: relative;
    }
    .services-shell .service-area-panel {
      display: none;
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 26px;
      padding: 28px 28px 24px;
      box-shadow: var(--shadow-sm);
    }
    .services-shell .service-area-panel.active {
      display: block;
    }
    .services-shell .service-area-panel-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }
    .services-shell .service-area-panel-header .card-icon {
      margin-bottom: 0;
      flex-shrink: 0;
    }
    .services-shell .service-area-panel-header h3 {
      margin: 0;
      color: #091322;
      font-family: "Plus Jakarta Sans", sans-serif;
      font-size: 23px;
      font-weight: 800;
      line-height: 1.15;
    }
    .services-shell .service-area-panel p + p {
      margin-top: 14px;
    }
    .services-shell .service-area-panel-svg {
      width: 24px;
      height: 24px;
      display: block;
      color: #0059a2;
    }
    .services-shell .service-area-panel .tag {
      padding: 7px 12px;
      font-size: 10.5px;
      font-family: "Inter", sans-serif;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    @media (max-width: 768px) {
      .services-shell .services-section { 
        padding-top: 60px; 
        padding-left: 20px; 
        padding-right: 20px; 
        padding-bottom: 80px;
        max-width: 100%;
      }
      .services-shell .panel-hero {
        grid-template-columns: 1fr !important;
        gap: 32px !important;
        padding: 40px 20px !important;
      }
      .services-shell .panel-hero h2 {
        font-size: clamp(1.3rem, 5vw, 2rem) !important;
      }
      .services-shell .panel-hero p { font-size: 14px; }
      .services-shell .panel-cta {
        font-size: 12px;
        padding: 10px 18px;
      }
      .services-shell .panel-metrics {
        padding: 20px !important;
      }
      .services-shell .panel-metric {
        padding: 12px 0 !important;
      }
      .services-shell .panel-metric .m-val {
        font-size: 1.3rem !important;
      }
      .services-shell .content-grid {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
      }
      .services-shell .content-grid.three {
        grid-template-columns: 1fr !important;
      }
      .services-shell .card {
        padding: 20px !important;
      }
      .services-shell .card h3 {
        font-size: 15px;
      }
      .services-shell .card p { font-size: 13px; }
      .services-shell .ref-projects {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
      }
      .services-shell .ref-projects.ref-projects-compact {
        grid-template-columns: 1fr !important;
      }
      .services-shell .ref-projects.ref-projects-compact .ref-card {
        grid-column: span 1 !important;
      }
      .services-shell .two-col {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
      }
      .services-shell .tech-benefits-list {
        grid-template-columns: 1fr !important;
        gap: 8px 16px !important;
      }
      .services-shell .engineering-list ul {
        grid-template-columns: 1fr !important;
        gap: 8px 16px !important;
      }
      .services-shell .scope-list ul {
        grid-template-columns: 1fr !important;
        gap: 8px 16px !important;
      }
      .services-shell .service-media-grid,
      .services-shell .service-pillar-grid {
        grid-template-columns: 1fr !important;
      }
      .services-shell .service-area-tab-list {
        grid-template-columns: 1fr 1fr !important;
      }
      .services-shell .service-area-tab {
        padding: 14px 16px;
      }
      .services-shell .service-area-panel {
        padding: 22px 20px 20px !important;
      }
      .services-shell .service-area-panel-header {
        align-items: flex-start;
      }
      .services-shell .service-area-panel-header h3 {
        font-size: 19px;
      }
      .services-shell .service-media-card img {
        height: 220px !important;
      }
    }
    @media (max-width: 480px) {
      .services-shell {
        font-size: 14px;
      }
      .services-shell .services-section { 
        padding-top: 100px; 
        padding-left: 16px; 
        padding-right: 16px; 
        padding-bottom: 60px;
      }
      .services-shell .panel-hero {
        padding: 28px 16px !important;
        gap: 24px !important;
      }
      .services-shell .panel-hero::before,
      .services-shell .panel-hero::after {
        display: none !important;
      }
      .services-shell .panel-hero h2 {
        font-size: clamp(1.2rem, 5vw, 1.6rem) !important;
        margin-bottom: 14px !important;
      }
      .services-shell .panel-hero p {
        font-size: 13px;
        margin-bottom: 20px;
        line-height: 1.6;
      }
      .services-shell .panel-cta {
        font-size: 11px;
        padding: 9px 14px !important;
      }
      .services-shell .panel-metrics {
        padding: 16px !important;
      }
      .services-shell .panel-metric .m-val {
        font-size: 1.1rem !important;
      }
      .services-shell .panel-metric .m-lbl {
        font-size: 9.5px !important;
      }
      .services-shell .card {
        padding: 16px !important;
      }
      .services-shell .card h3 {
        font-size: 14px;
        margin-bottom: 8px;
      }
      .services-shell .card p {
        font-size: 12.5px;
        line-height: 1.6;
      }
      .services-shell .full-card {
        padding: 16px !important;
      }
      .services-shell .full-card h3 {
        font-size: 15px;
      }
      .services-shell .full-card p {
        font-size: 12.5px;
      }
      .services-shell .ref-projects {
        gap: 10px !important;
      }
      .services-shell .ref-card {
        padding: 14px 16px !important;
      }
      .services-shell .ref-card .client {
        font-size: 12px;
      }
      .services-shell .ref-card .detail {
        font-size: 11px;
      }
      .services-shell .sub-title {
        font-size: 16px;
      }
      .services-shell .sub-title::after {
        display: none;
      }
      .services-shell .accent-card {
        padding: 18px 16px !important;
      }
      .services-shell .accent-card h3 {
        font-size: 15px;
      }
      .services-shell .accent-card p {
        font-size: 12.5px;
      }
      .services-shell .tech-benefits-box {
        padding: 16px 16px !important;
      }
      .services-shell .tech-benefits-list li {
        font-size: 12px;
      }
      .services-shell .engineering-list {
        padding: 16px 16px !important;
      }
      .services-shell .engineering-list li {
        font-size: 12px;
      }
      .services-shell .scope-list {
        padding: 16px 16px !important;
      }
      .services-shell .scope-list li {
        font-size: 12px;
      }
      .services-shell .card {
        padding: 16px !important;
        border-radius: 18px;
      }
      .services-shell .service-media-card {
        border-radius: 18px;
      }
      .services-shell .service-media-card img {
        height: 190px !important;
      }
      .services-shell .service-media-caption {
        padding: 14px 14px 16px !important;
      }
      .services-shell .service-media-caption strong {
        font-size: 14px;
      }
      .services-shell .service-media-caption span {
        font-size: 12px;
      }
      .services-shell .service-pillar {
        padding: 16px !important;
        border-radius: 18px;
      }
      .services-shell .service-area-tab-list {
        grid-template-columns: 1fr !important;
      }
      .services-shell .service-area-tab-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
      }
      .services-shell .service-area-tab span:last-child {
        font-size: 12px;
      }
      .services-shell .service-area-panel-header h3 {
        font-size: 17px;
      }
      .services-shell .service-area-panel p {
        font-size: 12.5px !important;
      }
      .services-shell .service-area-panel .tag {
        font-size: 10px;
      }
      .services-shell .service-pillar h3 {
        font-size: 14px;
      }
      .services-shell .service-pillar p {
        font-size: 12px;
      }
      .services-shell .faq-q {
        padding: 12px 0 !important;
      }
      .services-shell .faq-q span {
        font-size: 13px;
      }
      .services-shell .faq-a p {
        font-size: 12px;
      }
      .services-shell .step {
        gap: 12px !important;
        padding: 12px 0 !important;
      }
      .services-shell .step-num {
        width: 32px !important;
        height: 32px !important;
        font-size: 11px !important;
      }
      .services-shell .step-content h4 {
        font-size: 13px;
      }
      .services-shell .step-content p {
        font-size: 12px;
      }
    }
  `;

  return `${cleaned}\n${overrides}`;
}

export function parseServicesSource(source) {
  const emptyPanels = new Map(
    servicePanelConfig.map((config) => [
      config.panelId,
      { id: config.panelId, html: "" },
    ])
  );

  if (typeof DOMParser === "undefined") {
    return { styles: sanitizeStyle(""), panelsById: emptyPanels };
  }

  const doc = new DOMParser().parseFromString(source, "text/html");
  const styleText = doc.querySelector("style")?.textContent ?? "";
  const panelsById = new Map(
    Array.from(doc.querySelectorAll(".tab-panel")).map((panel, index) => {
      const id = panel.getAttribute("id") || `panel-${index}`;
      const clonedPanel = panel.cloneNode(true);
      cleanPanelTags(clonedPanel, id);
      normalizeTextTree(clonedPanel);

      return [id, { id, html: stripInlineHandlers(clonedPanel.innerHTML) }];
    })
  );

  emptyPanels.forEach((value, key) => {
    if (!panelsById.has(key)) {
      panelsById.set(key, value);
    }
  });

  return {
    styles: sanitizeStyle(styleText),
    panelsById,
  };
}

export function getServicePanels(parsedContent, keys) {
  return keys
    .map((key) => {
      const config = serviceConfigByKey.get(key);
      if (!config) {
        return null;
      }

      const panel = parsedContent?.panelsById?.get(config.panelId);
      if (!panel) {
        return null;
      }

      return {
        ...panel,
        key,
        label: config.label,
      };
    })
    .filter(Boolean);
}

export function getServiceTabIndexFromSearch(visibleKeys) {
  if (typeof window === "undefined") {
    return 0;
  }

  const tabValue = new URLSearchParams(window.location.search).get("tab");
  if (!tabValue) {
    return 0;
  }

  const numeric = Number.parseInt(tabValue, 10);
  if (Number.isFinite(numeric)) {
    if (numeric >= 0 && numeric < visibleKeys.length) {
      return numeric;
    }

    const mappedKey = servicePanelConfig[numeric]?.key;
    const mappedVisibleIndex =
      mappedKey ? visibleKeys.findIndex((key) => key === mappedKey) : -1;

    if (mappedVisibleIndex >= 0) {
      return mappedVisibleIndex;
    }

    return Math.min(Math.max(numeric, 0), visibleKeys.length - 1);
  }

  const normalizedValue = tabValue.toLowerCase();
  const matchedIndex = visibleKeys.findIndex((key) => {
    const config = serviceConfigByKey.get(key);
    return (
      normalizedValue === key ||
      normalizedValue === slugify(key) ||
      normalizedValue === slugify(config?.label || "")
    );
  });

  return matchedIndex >= 0 ? matchedIndex : 0;
}

export function updateServiceSearch(index, visibleKeys = servicesPagePanelKeys) {
  if (typeof window === "undefined") {
    return;
  }

  const nextKey = visibleKeys[index] ?? visibleKeys[0] ?? "solar-rooftop";
  const nextSearch = `?tab=${encodeURIComponent(nextKey)}`;
  if (window.location.search !== nextSearch) {
    window.history.replaceState(null, "", `${window.location.pathname}${nextSearch}`);
  }
}
