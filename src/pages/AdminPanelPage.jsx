import { useEffect, useMemo, useState } from "react";
import adminLogo from "../../imgs/Logo White.png";
import loginLogo from "../../imgs/LOGO (1).png";
import { getApiBase, resolveMediaUrl } from "../lib/api";
import { notifyPublicContentUpdated } from "../lib/publicContentSync";

const AUTH_KEY = "environomics-admin-preview-auth";
const AUTH_SESSION_KEY = "environomics-admin-auth-session";
const AUTH_TOKEN_KEY = "environomics-admin-preview-token";
const AUTH_MODE_KEY = "environomics-admin-preview-mode";
const CONTENT_KEY = "environomics-admin-preview-content";
const PROJECTS_PRESET_VERSION = "original-website-projects-v2";
const CLIENTS_PRESET_VERSION = "original-website-clients-v1";
const TESTIMONIALS_PRESET_VERSION = "original-website-testimonials-v1";
const ITEMS_PER_PAGE = 5;

const seoPageConfigs = [
  {
    key: "home",
    label: "Home",
    titlePlaceholder: "Turnkey Solar, HVAC & Industrial EPC in India",
    descriptionPlaceholder:
      "Environomics Projects LLP delivers turnkey EPC solutions across solar power, HVAC, clean rooms, electrification, automation, and industrial utilities in India.",
  },
  {
    key: "about",
    label: "About",
    titlePlaceholder: "About Environomics",
    descriptionPlaceholder:
      "Learn about Environomics Projects LLP, our EPC process, engineering approach, leadership, and experience delivering industrial infrastructure projects across India.",
  },
  {
    key: "services",
    label: "Services",
    titlePlaceholder: "Solar EPC, HVAC and Industrial Utility Services",
    descriptionPlaceholder:
      "Discover Environomics services spanning solar rooftop, ground mount plants, O&M, pharmaceutical clean rooms, electrification, automation, and energy audits.",
  },
  {
    key: "projects",
    label: "Projects",
    titlePlaceholder: "Industrial EPC Projects Portfolio",
    descriptionPlaceholder:
      "Explore Environomics project work across rooftop solar, ground mount systems, industrial HVAC, and utility infrastructure for leading commercial and industrial clients.",
  },
  {
    key: "clients",
    label: "Clients",
    titlePlaceholder: "Clients and Installation Portfolio",
    descriptionPlaceholder:
      "See the clients who trust Environomics for solar EPC, industrial utilities, HVAC, and long-term infrastructure execution across multiple sectors in India.",
  },
  {
    key: "testimonials",
    label: "Testimonials",
    titlePlaceholder: "Client Testimonials",
    descriptionPlaceholder:
      "Read client testimonials and proof points from Environomics solar EPC and industrial infrastructure projects delivered for major brands and manufacturers.",
  },
  {
    key: "innovation",
    label: "Innovation",
    titlePlaceholder: "Innovation and R&D",
    descriptionPlaceholder:
      "Explore Environomics innovation initiatives, proprietary solar engineering work, R&D programs, and industrial infrastructure technology development.",
  },
  {
    key: "contact",
    label: "Contact",
    titlePlaceholder: "Contact Environomics",
    descriptionPlaceholder:
      "Contact Environomics Projects LLP for solar EPC, industrial HVAC, clean rooms, automation, electrification, and feasibility assessments for your facility.",
  },
];

const defaultSeoPages = Object.fromEntries(
  seoPageConfigs.map((page) => [
    page.key,
    {
      title: page.titlePlaceholder,
      description: page.descriptionPlaceholder,
    },
  ])
);

const defaultSeoSchema = {
  organizationName: "Environomics Projects LLP",
  websiteName: "Environomics",
  siteUrl: "https://environomics.in",
  logo: "/imgs/LOGO (1).png",
  defaultImage: "/imgs/hero-2560.jpg",
  sameAs: ["https://www.linkedin.com/company/environomics-projects-llp/"],
};

const sections = [
  { id: "dashboard", label: "Dashboard", icon: "space_dashboard" },
  { id: "leads", label: "Leads", icon: "inbox" },
  { id: "home", label: "Home", icon: "home" },
  { id: "projects", label: "Projects", icon: "workspaces" },
  { id: "clients", label: "Clients", icon: "domain" },
  { id: "testimonials", label: "Testimonials", icon: "format_quote" },
  { id: "contact", label: "Contact", icon: "call" },
  { id: "seo", label: "SEO", icon: "travel_explore" },
  { id: "settings", label: "Settings", icon: "settings" },
];

const leadStages = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
const projectStatuses = ["Draft", "Published"];

function normalizeProjectStatus(value, fallback = "Published") {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "draft") {
    return "Draft";
  }
  if (normalized === "published") {
    return "Published";
  }
  return fallback;
}

const originalProjectDescriptions = {
  "GRG COTSPIN": "2023  TEXTILES  Largest single install. Anchor proof point.",
  "HONDA INDIA": "2023  AUTOMOTIVE  Global brand. Highest name recognition.",
  "OTSUKA PHARMACEUTICALS": "2018  PHARMA  7 yrs live  Longevity proof. Still above P50 in 2025.",
  "WELSPUN GROUP": "2024  TEXTILES  National conglomerate. Scale + recency.",
  "SIEMENS ENERGY": "2023  ENGINEERING  Global MNC. Strongest credibility signal.",
  "BAXTER PHARMA": "2024  PHARMA  Global pharma MNC. GMP-grade proof.",
  "COLGATE-PALMOLIVE": "2025  FMCG  Household global name. FMCG diversity.",
  "AMOL MINECHEM": "2022-23  CHEMICALS  Largest chemicals install. Sector diversity.",
  "RAVIRAJ FOILS": "2022-23  MANUFACTURING  Multi-phase proof. Repeat-client signal.",
  "AKASH FASHION": "2021  TEXTILES  Sub-MW to MW scale. Textiles depth.",
  "MONGINIS FOODS": "2018  FOOD & BEV  Recognisable brand. Food sector coverage.",
  "ROHAN DYES (RDL)": "2020  CHEMICALS  Chemical sector breadth. Steady delivery.",
  "FUJI SILVERTECH": "2025  MANUFACTURING  Most recent. Above yield.",
  "SOMANY EVERGREEN": "2022  TILES / MFG  Known Indian brand. Tiles sector unique.",
  "BUSCH VACUUM": "2020  ENGINEERING  Dual-service (Solar + HVAC).",
};

const defaultProject = {
  name: "GRG COTSPIN",
  capacity: "4,200 kWp Solar",
  description: originalProjectDescriptions["GRG COTSPIN"],
  status: "Published",
  image: "https://www.environomics.net.in/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-14-at-20.10.40_ef099853-1-1024x768-640x480_c.jpg",
  companyLogo: "https://www.environomics.net.in/wp-content/uploads/2025/02/2023_GRG_cotspin.jpeg",
  direction: "left",
};

const emptyProjectDraft = {
  name: "",
  capacity: "",
  description: "",
  status: "Draft",
  image: "",
  companyLogo: "",
  direction: "left",
};

const originalWebsiteProjects = [
  { ...defaultProject },
  {
    name: "HONDA INDIA",
    capacity: "2,500 kWp Solar",
    description: originalProjectDescriptions["HONDA INDIA"],
    status: "Published",
    image: "https://www.environomics.net.in/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-14-at-20.04.21_db116f50-1024x768-640x480.jpg",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2025/02/2023_honda-Photoroom.webp",
    direction: "right",
  },
  {
    name: "OTSUKA PHARMACEUTICALS",
    capacity: "2,024 kWp Solar",
    description: originalProjectDescriptions["OTSUKA PHARMACEUTICALS"],
    status: "Published",
    image: "https://www.environomics.net.in/wp-content/uploads/2024/02/Otsuka06-1024x768-640x480_c.jpg",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/02/otsuka.png",
    direction: "left",
  },
  {
    name: "WELSPUN GROUP",
    capacity: "2,000 kWp Solar",
    description: originalProjectDescriptions["WELSPUN GROUP"],
    status: "Published",
    image: "https://www.environomics.net.in/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-14-at-20.10.41_76ec1bcd-1024x768-640x480_c.jpg",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2025/02/2023_welspun-Photoroom.webp",
    direction: "right",
  },
  {
    name: "SIEMENS ENERGY",
    capacity: "1,300 kWp Solar",
    description: originalProjectDescriptions["SIEMENS ENERGY"],
    status: "Published",
    image: "https://www.environomics.net.in/wp-content/uploads/2024/02/DJI_0314-1-1024x683-640x480_c.jpg",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/02/siemens.jpg",
    direction: "left",
  },
  {
    name: "BAXTER PHARMA",
    capacity: "1,300 kWp Solar",
    description: originalProjectDescriptions["BAXTER PHARMA"],
    status: "Published",
    image: "https://www.environomics.net.in/wp-content/uploads/2024/02/DJI_0310-2-scaled.jpg",
    companyLogo: "",
    direction: "right",
  },
  {
    name: "COLGATE-PALMOLIVE",
    capacity: "250 kWp Solar",
    description: originalProjectDescriptions["COLGATE-PALMOLIVE"],
    status: "Published",
    image: "https://www.environomics.net.in/wp-content/uploads/2024/02/Otsuka05-1024x768-640x480_c.jpg",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2025/02/2025_colgate_palmolive-Photoroom.webp",
    direction: "left",
  },
  {
    name: "AMOL MINECHEM",
    capacity: "1,899 kWp Solar",
    description: originalProjectDescriptions["AMOL MINECHEM"],
    status: "Published",
    image: "https://www.environomics.net.in/wp-content/uploads/2024/02/DJI_0306-1-1-1024x682-640x480_c.jpg",
    companyLogo: "",
    direction: "right",
  },
  {
    name: "RAVIRAJ FOILS",
    capacity: "1,899 kWp Solar",
    description: originalProjectDescriptions["RAVIRAJ FOILS"],
    status: "Published",
    image: "https://www.environomics.net.in/wp-content/uploads/2024/02/DJI_0327-1-scaled.jpg",
    companyLogo: "https://www.ravirajfoils.com/images/logo.png",
    direction: "left",
  },
  {
    name: "AKASH FASHION",
    capacity: "999 kWp Solar",
    description: originalProjectDescriptions["AKASH FASHION"],
    status: "Published",
    image: "https://www.environomics.net.in/wp-content/uploads/2024/02/DJI_0327-2-1024x683-640x480_c.jpg",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/01/akashfashion.png",
    direction: "right",
  },
  {
    name: "MONGINIS FOODS",
    capacity: "780 kWp Solar",
    description: originalProjectDescriptions["MONGINIS FOODS"],
    status: "Published",
    image: "https://www.environomics.net.in/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-14-at-20.20.00_fc6dfe58-1024x768-640x480.jpg",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2025/02/2017_monginis-Photoroom.webp",
    direction: "left",
  },
  {
    name: "ROHAN DYES (RDL)",
    capacity: "325 kWp Solar",
    description: originalProjectDescriptions["ROHAN DYES (RDL)"],
    status: "Published",
    image: "https://www.environomics.net.in/wp-content/uploads/2024/02/DJI_0311-1-1024x682-640x480_c.jpg",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/02/rohan-dyes-rdil-logonew.png",
    direction: "right",
  },
  {
    name: "FUJI SILVERTECH",
    capacity: "528.5 kWp Solar",
    description: originalProjectDescriptions["FUJI SILVERTECH"],
    status: "Published",
    image: "https://www.environomics.net.in/wp-content/uploads/2024/02/DJI_0308-1024x682-640x480_c.jpg",
    companyLogo: "",
    direction: "left",
  },
  {
    name: "SOMANY EVERGREEN",
    capacity: "900 kWp Solar",
    description: originalProjectDescriptions["SOMANY EVERGREEN"],
    status: "Published",
    image: "https://www.environomics.net.in/wp-content/uploads/2024/02/DJI_0309-1024x682-640x480_c.jpg",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/02/Somany-Evergreen.png",
    direction: "right",
  },
  {
    name: "BUSCH VACUUM",
    capacity: "72 kWp Solar + HVAC",
    description: originalProjectDescriptions["BUSCH VACUUM"],
    status: "Published",
    image: "https://www.environomics.net.in/wp-content/uploads/2024/02/20230530_162952-scaled.jpg",
    companyLogo: "",
    direction: "left",
  },
];

const originalWebsiteProjectsByName = new Map(
  originalWebsiteProjects.map((project) => [project.name, project])
);

const defaultClient = {
  name: "GRG Cotspin",
  category: "Textiles",
  year: "2023",
  capacity: "4,200 kWp",
  companyLogo: "https://www.environomics.net.in/wp-content/uploads/2025/02/2023_GRG_cotspin.jpeg",
};

const emptyClientDraft = {
  name: "",
  category: "",
  year: "",
  capacity: "",
  companyLogo: "",
};

const defaultSocialLink = {
  platform: "LinkedIn",
  handle: "@environomics-projects-llp",
  url: "https://www.linkedin.com/company/environomics-projects-llp/",
  logo: "",
};

const emptySocialDraft = {
  platform: "",
  handle: "",
  url: "",
  logo: "",
};

const originalWebsiteClients = [
  { ...defaultClient },
  {
    name: "Honda India",
    category: "Automotive",
    year: "2023",
    capacity: "2,500 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2025/02/2023_honda-Photoroom.webp",
  },
  {
    name: "Welspun Group",
    category: "Textiles",
    year: "2024",
    capacity: "2,000 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2025/02/2023_welspun-Photoroom.webp",
  },
  {
    name: "Otsuka Pharmaceuticals",
    category: "Pharma",
    year: "2018",
    capacity: "2,024 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/02/otsuka.png",
  },
  {
    name: "Baxter Pharmaceutical",
    category: "Pharma",
    year: "2024",
    capacity: "1,300 kWp",
    companyLogo: "/imgs/company-logos/baxter-pharma.png",
  },
  {
    name: "Siemens Energy",
    category: "Engineering",
    year: "2023",
    capacity: "1,300 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/02/siemens.jpg",
  },
  {
    name: "Jindal",
    category: "Steel / Infra",
    year: "2017",
    capacity: "1,000 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/03/OIP-53.jpg",
  },
  {
    name: "Raviraj Foils",
    category: "Manufacturing",
    year: "2022-23",
    capacity: "1,899 kWp",
    companyLogo: "https://www.ravirajfoils.com/images/logo.png",
  },
  {
    name: "Amol Minechem",
    category: "Chemicals",
    year: "2022-23",
    capacity: "1,899 kWp",
    companyLogo: "/imgs/company-logos/amol-minechem.jpg",
  },
  {
    name: "Akash Fashion",
    category: "Textiles",
    year: "2021",
    capacity: "999 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/01/akashfashion.png",
  },
  {
    name: "Somany Evergreen",
    category: "Tiles / MFG",
    year: "2022",
    capacity: "900 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/02/Somany-Evergreen.png",
  },
  {
    name: "Monginis Foods",
    category: "Food & Bev",
    year: "2018",
    capacity: "780 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2025/02/2017_monginis-Photoroom.webp",
  },
  {
    name: "Fuji SilverTech",
    category: "Manufacturing",
    year: "2025",
    capacity: "528.5 kWp",
    companyLogo: "/imgs/company-logos/fuji-silvertech.png",
  },
  {
    name: "Colgate-Palmolive",
    category: "FMCG",
    year: "2025",
    capacity: "250 kWp",
    companyLogo: "/imgs/company-logos/colgate-palmolive.png",
  },
  {
    name: "Rohan Dyes (RDL)",
    category: "Chemicals",
    year: "2020",
    capacity: "325 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/02/rohan-dyes-rdil-logonew.png",
  },
  {
    name: "Balkrishna",
    category: "Manufacturing",
    year: "2019",
    capacity: "325 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/03/logo-3.png",
  },
  {
    name: "Delhi University",
    category: "Education",
    year: "2017",
    capacity: "120 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/03/delhi-university-686256-1.jpg",
  },
  {
    name: "DPS Bopal",
    category: "Education",
    year: "2018",
    capacity: "90 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/03/delhi-public-school-bopal-logo-1.jpg",
  },
  {
    name: "Busch Vacuum",
    category: "Engineering",
    year: "2020",
    capacity: "72 kWp + HVAC",
    companyLogo: "/imgs/company-logos/busch-vacuum.png",
  },
  {
    name: "JMC Paper",
    category: "Paper / MFG",
    year: "2019",
    capacity: "50 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/03/download-8.jpg",
  },
  {
    name: "Aqseptence",
    category: "Water Tech",
    year: "2022-23",
    capacity: "320 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/01/aqseptencelogo.png",
  },
  {
    name: "Screenotex",
    category: "Manufacturing",
    year: "2021",
    capacity: "100 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/01/screen.png",
  },
  {
    name: "CTM Technical Textiles",
    category: "Textiles",
    year: "2022",
    capacity: "390 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/01/CTM-Technical-Textiles-Ltd.jpg",
  },
  {
    name: "RSL Dye & Chemical",
    category: "Chemicals",
    year: "2021",
    capacity: "325 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/01/rdl-logo.png",
  },
  {
    name: "Raghuvir Exim",
    category: "Textiles",
    year: "2018-19",
    capacity: "195 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2025/02/2019_REL.webp",
  },
  {
    name: "Swiss",
    category: "Manufacturing",
    year: "2021",
    capacity: "200 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/02/swiss.png",
  },
  {
    name: "Wideangle",
    category: "Engineering",
    year: "2017",
    capacity: "120 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/02/wideangle.jpg",
  },
  {
    name: "Western Shellcast",
    category: "Manufacturing",
    year: "2024",
    capacity: "400 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2025/02/2024_western_pal_shellcast.webp",
  },
  {
    name: "HYS Lifecare",
    category: "Healthcare",
    year: "2019",
    capacity: "90 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/03/hys.jpg",
  },
  {
    name: "Bharat Beams",
    category: "Manufacturing",
    year: "2018",
    capacity: "100 kWp",
    companyLogo: "https://www.environomics.net.in/wp-content/uploads/2024/03/bharat-beams-private-limited-120x120-1.jpg",
  },
];

const defaultTestimonial = {
  title: "Siemens Energy",
  tag: "Heavy Engineering",
  subtitle: "Procurement Manager",
  capacity: "1,300 kWp",
  installed: "2023",
  description:
    "Siemens Energy chose Environomics for a 1,300 kWp plant. High technical competence demonstrated through complex grid synchronization.",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuARxk8ADAlMFXx1_XzykiIURdmsCuKigrN7TPedb0Axs5e01oXwTZAGjKhcsqpc5mYsIsT0NMMWGqu8trCdTWGQjB62JKMsEvIgKEpprQVhmFH8syxxvMQreQffwkFsjFNEWGAGJ2PzfRQ-jG314613mt69gmN5tVgGkJgNvykdtVLWmpqeDedLKWnYOgNdA11yy1x-lQ_XH5iDSU7DGR9WZNW71EHQnW2Th0mnMo7OsmtWBGzcVRm_sZxL3V3qlbwk6s_G7NKyP68",
};

const emptyTestimonialDraft = {
  title: "",
  tag: "",
  subtitle: "",
  capacity: "",
  installed: "",
  description: "",
  image: "",
};

const originalWebsiteTestimonials = [
  {
    title: "Colgate-Palmolive",
    tag: "Global FMCG",
    subtitle: "Operations Head",
    capacity: "250 kWp",
    installed: "2025",
    description:
      "A global FMCG brand trusted Environomics with its energy infrastructure. Professional execution and high attention to detail.",
    image: "/imgs/projects/colgate-palmolive.jpg",
  },
  {
    title: "Baxter Pharmaceutical",
    tag: "Life Sciences",
    subtitle: "Plant Director",
    capacity: "1,300 kWp",
    installed: "2024",
    description:
      "Baxter Pharmaceutical needed a pharma-grade install with strict hygiene protocols. Environomics delivered it on schedule and exceeded our expectations.",
    image: "/imgs/projects/baxter-pharma.jpg",
  },
  {
    title: "Fuji SilverTech",
    tag: "Precast Engineering",
    subtitle: "Project Lead",
    capacity: "528.5 kWp",
    installed: "2025",
    description:
      "Fuji SilverTech delivered 528.5 kWp on time and above the modelled yield. The real time monitoring system is excellent.",
    image: "/imgs/projects/fuji-silvertech.jpg",
  },
  { ...defaultTestimonial },
  {
    title: "Honda India",
    tag: "Automotive",
    subtitle: "Engineering Head",
    capacity: "2,500 kWp",
    installed: "2023",
    description:
      "Honda India demands perfection. 2,500 kWp system delivered on time. The performance stability has been critical for our operations.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDav4tQEK2a2RUCp3ixxqlUpj-IIXYIXRs8U4FWzzImUhSkULpPDfZrWkLeWtTUer6_28gHtenaSKgmGz5A3KA_Fj-7C3OOtN9wnxT2AcrCveJ1pBKxDxDQtRNyXmNC1Hm_Ju9Pl-u2mfL8mS79nrdYperp-3CI4A43uTytnUYXJQyNfxFn2vMtz4tq8dihPcTbElQ3lMQzGw3uGw6VPLGg03IQ_ZYIJIf4KE3Ltew7O-wlUn-7qs6uuNLQIbUeEr0eeBnfyPDMPHM",
  },
  {
    title: "Welspun Group",
    tag: "Textiles & Steel",
    subtitle: "Group Operations",
    capacity: "2,000 kWp",
    installed: "2024",
    description:
      "One of Environomics' largest installations delivered 2,000 kWp for Welspun Group. It is a flagship in scale and reliability for our manufacturing hub.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAfS0Q52AlpCsTv09DwjadsivCDWpP1Lia_9Wly7kfJcnjq0i2X1Q-Qx3er7OpAqeGqmsaxe1SDmP4VzfoCy2swRDdbIudXYgnFkN3zhPZ0OkXZcPz4ZdwH69FFctSNtlVYTHe_CKewEb-dw5cngJtuigjTwVOUGynQRuN-00BlZsp_TpfLOMMQOy9tYMUotERIKzdca-dOZ_72PrY9k_v8cRAZ0ENxcb51CK_Tj07dovnnIelYEFxwsnae3LCsw3zgW5lR0TX22C0",
  },
  {
    title: "Otsuka Pharmaceuticals",
    tag: "Pharma Legacy",
    subtitle: "Energy Director",
    capacity: "2,024 kWp",
    installed: "2018",
    description:
      "Installed in 2018 for Otsuka Pharmaceuticals. Still running above projection in 2025. A testament to the build quality and engineering.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrJEBvC_ce_UtqJFNGtfmiMZWM_k2cdkXGEpz5-OcDZ5Y3UPgob2Y_XiGsDgi4vCkTAd0b8emF1V7Y7WvnfR1kMks2yYrHj0KNTRAQRwOawd40_XltYAp9oq6VNbsZJYHpKyu3YDw0rCvCo8nt5YkCLiHB9Y-CZg7f6lkxJGyYdOm3ttY6RFRb_AOdat0bajEGT6okmYmwjGjSIBLllOPyfsxr_qk9d3zUGxG0WyMPGNprttZPa2X_Kf4bKiwdTzdH1l-9cuUKDUM",
  },
  {
    title: "Raviraj Foils",
    tag: "Packaging",
    subtitle: "Managing Director",
    capacity: "2,100 kWp",
    installed: "2022",
    description:
      "Scaling solar across multiple phases was delivered on schedule every time. Their multi phase execution strategy minimized downtime.",
    image: "/imgs/projects/raviraj-foils.png",
  },
];

const defaultContent = {
  projectPresetVersion: PROJECTS_PRESET_VERSION,
  clientPresetVersion: CLIENTS_PRESET_VERSION,
  testimonialPresetVersion: TESTIMONIALS_PRESET_VERSION,
  home: {
    title: "India's Trusted\nTurnkey EPC Partner",
    subtitle: "Solar, HVAC & Industrial Utilities",
    ctaPrimary: "Explore Our Projects",
    ctaSecondary: "Get a Free Feasibility Report",
  },
  projects: originalWebsiteProjects,
  clients: originalWebsiteClients,
  leads: [
    {
      id: "lead-1",
      name: "Rohan Mehta",
      company: "Siemens Energy",
      email: "rohan.mehta@siemens-example.com",
      phone: "+91 98765 12001",
      requirement: "1.3 MW rooftop solar feasibility and EPC quote",
      stage: "Qualified",
      createdAt: "2026-03-29T10:15:00+05:30",
    },
    {
      id: "lead-2",
      name: "Asha Patel",
      company: "Baxter Pharma",
      email: "asha.patel@baxter-example.com",
      phone: "+91 98765 12002",
      requirement: "HVAC and clean room upgrade consultation",
      stage: "Proposal Sent",
      createdAt: "2026-03-30T09:00:00+05:30",
    },
    {
      id: "lead-3",
      name: "Kunal Shah",
      company: "Welspun Group",
      email: "kunal.shah@welspun-example.com",
      phone: "+91 98765 12003",
      requirement: "Ground mount solar plant budgetary proposal",
      stage: "Contacted",
      createdAt: "2026-03-30T11:20:00+05:30",
    },
  ],
  testimonials: originalWebsiteTestimonials,
  contact: {
    phone: "09998112299",
    email: "info@environomics.in",
    address: "Ahmedabad, Gujarat, India, 380013",
    linkedin: "https://www.linkedin.com/company/environomics-projects-llp/",
    socials: [{ ...defaultSocialLink }],
  },
  seo: {
    pages: defaultSeoPages,
    schema: defaultSeoSchema,
    homeTitle: defaultSeoPages.home.title,
    homeDescription: defaultSeoPages.home.description,
  },
  settings: {
    footerYear: "2026",
    domain: "https://environomics.in",
    companyLogo: defaultSeoSchema.logo,
    headerLogo: defaultSeoSchema.logo,
  },
};

function normalizeTestimonial(item = {}) {
  if (item.title || item.subtitle || item.tag || item.description || item.image) {
    return {
      ...defaultTestimonial,
      ...item,
    };
  }

  return {
    ...defaultTestimonial,
    title: item.client ?? defaultTestimonial.title,
    description: item.quote ?? defaultTestimonial.description,
  };
}

function normalizeProject(item = {}) {
  const resolvedName = String(item.name ?? item.n ?? "").trim();
  const matchedProject = originalWebsiteProjectsByName.get(resolvedName) ?? defaultProject;

  return {
    ...defaultProject,
    ...matchedProject,
    ...item,
    name: item.name ?? item.n ?? matchedProject.name,
    capacity: item.capacity ?? item.c ?? matchedProject.capacity,
    description: String(item.description ?? item.meta ?? matchedProject.description ?? "").trim(),
    companyLogo: item.companyLogo ?? item.logo ?? item.l ?? matchedProject.companyLogo,
    status: normalizeProjectStatus(item.status, matchedProject.status ?? defaultProject.status),
  };
}

function normalizeClient(item = {}) {
  return {
    ...defaultClient,
    ...item,
    name: item.name ?? item.n ?? defaultClient.name,
    category: item.category ?? item.sector ?? item.s ?? defaultClient.category,
    year: item.year ?? item.y ?? defaultClient.year,
    capacity: item.capacity ?? item.c ?? defaultClient.capacity,
    companyLogo: item.companyLogo ?? item.logo ?? item.l ?? defaultClient.companyLogo,
  };
}

function normalizeSocialLink(item = {}) {
  return {
    ...defaultSocialLink,
    ...item,
    platform: item.platform ?? defaultSocialLink.platform,
    handle: item.handle ?? defaultSocialLink.handle,
    url: item.url ?? defaultSocialLink.url,
    logo: item.logo ?? defaultSocialLink.logo,
  };
}

function normalizeStringList(value, fallback = []) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return fallback;
}

function normalizeSeo(rawSeo = {}) {
  const rawPages = rawSeo.pages ?? {};
  const pages = Object.fromEntries(
    seoPageConfigs.map(({ key }) => {
      const rawPage = rawPages[key] ?? {};
      const fallbackPage = defaultSeoPages[key];

      return [
        key,
        {
          title:
            rawPage.title ??
            (key === "home" ? rawSeo.homeTitle : undefined) ??
            fallbackPage.title,
          description:
            rawPage.description ??
            (key === "home" ? rawSeo.homeDescription : undefined) ??
            fallbackPage.description,
        },
      ];
    })
  );

  return {
    pages,
    schema: {
      ...defaultSeoSchema,
      ...(rawSeo.schema ?? {}),
      sameAs: normalizeStringList(rawSeo.schema?.sameAs, defaultSeoSchema.sameAs),
    },
    homeTitle: pages.home.title,
    homeDescription: pages.home.description,
  };
}

function normalizeContent(rawContent = {}) {
  const hasProjects = Array.isArray(rawContent.projects);
  const hasClients = Array.isArray(rawContent.clients);
  const hasTestimonials = Array.isArray(rawContent.testimonials);
  const rawContact = rawContent.contact ?? {};
  const rawSettings = rawContent.settings ?? {};
  const normalizedSeo = normalizeSeo(rawContent.seo);
  const companyLogo = Object.prototype.hasOwnProperty.call(rawSettings, "companyLogo")
    ? String(rawSettings.companyLogo ?? "").trim()
    : String(normalizedSeo.schema.logo ?? defaultContent.settings.companyLogo ?? "").trim();
  const headerLogo = Object.prototype.hasOwnProperty.call(rawSettings, "headerLogo")
    ? String(rawSettings.headerLogo ?? "").trim()
    : companyLogo;

  return {
    ...defaultContent,
    ...rawContent,
    projectPresetVersion: PROJECTS_PRESET_VERSION,
    clientPresetVersion: CLIENTS_PRESET_VERSION,
    testimonialPresetVersion: TESTIMONIALS_PRESET_VERSION,
    home: { ...defaultContent.home, ...(rawContent.home ?? {}) },
    contact: {
      ...defaultContent.contact,
      ...rawContact,
      socials:
        Array.isArray(rawContact.socials)
          ? rawContact.socials.map(normalizeSocialLink)
          : defaultContent.contact.socials.map(normalizeSocialLink),
    },
    seo: {
      ...normalizedSeo,
      schema: {
        ...normalizedSeo.schema,
        logo: companyLogo,
      },
    },
    settings: {
      ...defaultContent.settings,
      ...rawSettings,
      companyLogo,
      headerLogo,
    },
    projects: hasProjects
      ? rawContent.projects.map(normalizeProject)
      : originalWebsiteProjects.map(normalizeProject),
    leads: Array.isArray(rawContent.leads) ? rawContent.leads : defaultContent.leads,
    clients: hasClients
      ? rawContent.clients.map(normalizeClient)
      : originalWebsiteClients.map(normalizeClient),
    testimonials: hasTestimonials
      ? rawContent.testimonials.map(normalizeTestimonial)
      : originalWebsiteTestimonials.map(normalizeTestimonial),
  };
}

function getTab() {
  if (typeof window === "undefined") return "dashboard";
  const tab = new URLSearchParams(window.location.search).get("tab");
  return sections.some((section) => section.id === tab) ? tab : "dashboard";
}

function getStoredContent() {
  if (typeof window === "undefined") return normalizeContent(defaultContent);
  try {
    const raw = window.localStorage.getItem(CONTENT_KEY);
    return raw ? normalizeContent(JSON.parse(raw)) : normalizeContent(defaultContent);
  } catch {
    return normalizeContent(defaultContent);
  }
}

function saveStoredContent(content) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  }
}

function getStoredAuthSession() {
  const fallbackSession = {
    isAuthenticated: false,
    mode: "preview",
    token: "",
    user: null,
  };

  if (typeof window === "undefined") return fallbackSession;

  try {
    const raw = window.sessionStorage.getItem(AUTH_SESSION_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);
      const isServerSession = parsed?.mode === "server" && Boolean(parsed?.token);
      return {
        ...fallbackSession,
        ...parsed,
        isAuthenticated: isServerSession ? Boolean(parsed?.isAuthenticated) : false,
        mode: isServerSession ? "server" : "preview",
        token: isServerSession ? parsed?.token ?? "" : "",
        user: isServerSession ? parsed?.user ?? null : null,
      };
    }
  } catch {
    return fallbackSession;
  }

  const legacyMode = window.sessionStorage.getItem(AUTH_MODE_KEY);
  const legacyToken = window.sessionStorage.getItem(AUTH_TOKEN_KEY) ?? "";
  const isLegacyServerSession = legacyMode === "server" && Boolean(legacyToken);

  return {
    ...fallbackSession,
    isAuthenticated:
      isLegacyServerSession && window.sessionStorage.getItem(AUTH_KEY) === "true",
    mode: isLegacyServerSession ? "server" : "preview",
    token: isLegacyServerSession ? legacyToken : "",
  };
}

function persistAuthSession(session) {
  if (typeof window === "undefined") return;
  const nextSession = {
    isAuthenticated: Boolean(session?.isAuthenticated),
    mode: session?.mode === "server" ? "server" : "preview",
    token: session?.token ?? "",
    user: session?.user ?? null,
  };

  window.sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(nextSession));
  window.sessionStorage.setItem(AUTH_KEY, nextSession.isAuthenticated ? "true" : "false");
  window.sessionStorage.setItem(AUTH_MODE_KEY, nextSession.mode);

  if (nextSession.token) {
    window.sessionStorage.setItem(AUTH_TOKEN_KEY, nextSession.token);
  } else {
    window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

function clearStoredAuth() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(AUTH_SESSION_KEY);
  window.sessionStorage.removeItem(AUTH_KEY);
  window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
  window.sessionStorage.removeItem(AUTH_MODE_KEY);
}

function getAdminApiBase() {
  return getApiBase();
}

async function apiRequest(path, { token, headers, ...options } = {}) {
  const response = await fetch(`${getAdminApiBase()}${path}`, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message ?? `Request failed with status ${response.status}.`);
  }

  return payload;
}

function isDataUrl(value) {
  return typeof value === "string" && value.startsWith("data:");
}

function sanitizeUploadName(value) {
  return (
    String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "upload"
  );
}

function getUploadExtension(mimeType = "") {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";
    default:
      return "bin";
  }
}

async function uploadMediaValue(value, filenameBase, token) {
  if (!isDataUrl(value)) {
    return value;
  }

  const dataResponse = await fetch(value);
  const blob = await dataResponse.blob();
  const formData = new FormData();
  const extension = getUploadExtension(blob.type);

  formData.append("file", blob, `${sanitizeUploadName(filenameBase)}.${extension}`);

  const payload = await apiRequest("/admin/uploads", {
    method: "POST",
    token,
    body: formData,
  });

  return payload?.data?.url ?? value;
}

function readImageFileAsDataUrl(file, onLoad) {
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      onLoad(reader.result);
    }
  };
  reader.readAsDataURL(file);
}

async function prepareSectionItemForSave(section, item, token) {
  if (section === "projects") {
    return {
      ...item,
      image: await uploadMediaValue(item.image, `${item.name || "project"}-image`, token),
      companyLogo: await uploadMediaValue(
        item.companyLogo,
        `${item.name || "project"}-logo`,
        token
      ),
    };
  }

  if (section === "clients") {
    return {
      ...item,
      companyLogo: await uploadMediaValue(
        item.companyLogo,
        `${item.name || "client"}-logo`,
        token
      ),
    };
  }

  if (section === "testimonials") {
    return {
      ...item,
      image: await uploadMediaValue(item.image, `${item.title || "testimonial"}-image`, token),
    };
  }

  return item;
}

function getSeoPayload(seo, settings = {}) {
  const settingsLogo = Object.prototype.hasOwnProperty.call(settings, "companyLogo")
    ? String(settings.companyLogo ?? "").trim()
    : String(seo.schema?.logo ?? "").trim();
  const pages = Object.fromEntries(
    seoPageConfigs.map(({ key }) => [
      key,
      {
        title: String(seo.pages[key]?.title ?? "").trim(),
        description: String(seo.pages[key]?.description ?? "").trim(),
      },
    ])
  );

  return {
    homeTitle: pages.home.title,
    homeDescription: pages.home.description,
    pages,
    schema: {
      organizationName: String(seo.schema.organizationName ?? "").trim(),
      websiteName: String(seo.schema.websiteName ?? "").trim(),
      siteUrl: String(seo.schema.siteUrl ?? "").trim(),
      logo: isDataUrl(settingsLogo) ? String(seo.schema.logo ?? "").trim() : settingsLogo,
      defaultImage: String(seo.schema.defaultImage ?? "").trim(),
      sameAs: normalizeStringList(seo.schema.sameAs),
    },
  };
}

function getCollectionPayload(section, item) {
  if (section === "projects") {
    return {
      name: String(item.name ?? "").trim(),
      capacity: String(item.capacity ?? "").trim(),
      description: String(item.description ?? item.meta ?? "").trim(),
      status: normalizeProjectStatus(item.status, defaultProject.status),
      direction: item.direction === "right" ? "right" : "left",
      image: String(item.image ?? "").trim(),
      companyLogo: String(item.companyLogo ?? "").trim(),
    };
  }

  if (section === "clients") {
    return {
      name: String(item.name ?? "").trim(),
      category: String(item.category ?? "").trim(),
      year: String(item.year ?? "").trim(),
      capacity: String(item.capacity ?? "").trim(),
      companyLogo: String(item.companyLogo ?? "").trim(),
    };
  }

  return {
    title: String(item.title ?? "").trim(),
    tag: String(item.tag ?? "").trim(),
    subtitle: String(item.subtitle ?? "").trim(),
    capacity: String(item.capacity ?? "").trim(),
    installed: String(item.installed ?? "").trim(),
    description: String(item.description ?? "").trim(),
    image: String(item.image ?? "").trim(),
  };
}

function getContactPayload(contact) {
  return {
    phone: String(contact.phone ?? "").trim(),
    email: String(contact.email ?? "").trim(),
    address: String(contact.address ?? "").trim(),
    linkedin: String(contact.linkedin ?? "").trim(),
  };
}

function getSingletonPayload(section, value) {
  if (section === "home") {
    return {
      title: String(value.title ?? "").trim(),
      subtitle: String(value.subtitle ?? "").trim(),
      ctaPrimary: String(value.ctaPrimary ?? "").trim(),
      ctaSecondary: String(value.ctaSecondary ?? "").trim(),
    };
  }

  if (section === "settings") {
    return {
      footerYear: String(value.footerYear ?? "").trim(),
      companyLogo: String(value.companyLogo ?? "").trim(),
      headerLogo: String(value.headerLogo ?? "").trim(),
    };
  }

  return {};
}

function getSocialPayload(item) {
  return {
    platform: String(item.platform ?? "").trim(),
    handle: String(item.handle ?? "").trim(),
    url: String(item.url ?? "").trim(),
    logo: String(item.logo ?? "").trim(),
  };
}

function areEqualPayloads(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function formatLeadTimestamp(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  autoComplete,
  trailingAction = null,
  placeholder,
}) {
  const className =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10";

  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${className} resize-y`}
        />
      ) : (
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            placeholder={placeholder}
            className={`${className} ${trailingAction ? "pr-24" : ""}`}
          />
          {trailingAction ? (
            <div className="absolute inset-y-0 right-3 flex items-center">{trailingAction}</div>
          ) : null}
        </div>
      )}
    </label>
  );
}

function TestimonialPreviewCard({ testimonial }) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-sky-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="relative h-44 overflow-hidden sm:h-52">
        <img src={resolveMediaUrl(testimonial.image) || testimonial.image} alt={`${testimonial.title} facility`} className="h-full w-full object-cover" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-800 shadow-sm backdrop-blur">
          {testimonial.tag}
        </span>
      </div>
      <div className="space-y-6 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-headline text-2xl font-extrabold text-slate-900">{testimonial.title}</h3>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
              {testimonial.subtitle}
            </p>
          </div>
          <div className="flex shrink-0 gap-0.5 text-yellow-400">
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index} className="material-symbols-outlined !text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Capacity</p>
            <p className="mt-1 font-headline text-lg font-extrabold text-slate-900">{testimonial.capacity}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Installed</p>
            <p className="mt-1 font-headline text-lg font-extrabold text-slate-900">{testimonial.installed}</p>
          </div>
        </div>

        <p className="text-base italic leading-8 text-slate-600">&quot;{testimonial.description}&quot;</p>
        <a href="/contact" className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-[0.16em] text-primary">
          Read full case study
          <span className="material-symbols-outlined !text-base">arrow_forward</span>
        </a>
      </div>
    </article>
  );
}

function ClientPreviewCard({ client }) {
  const meta = [client.year, client.capacity].filter(Boolean).join(" · ");
  const initials = client.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-5">
      <div className="flex min-h-[250px] flex-col items-center justify-center rounded-[24px] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8fd_100%)] px-5 py-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
          {client.companyLogo ? (
            <img src={resolveMediaUrl(client.companyLogo) || client.companyLogo} alt={`${client.name} logo`} className="h-full w-full object-contain p-3" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 font-headline text-2xl font-extrabold uppercase tracking-[0.08em] text-slate-500">
              {initials || "CL"}
            </div>
          )}
        </div>

        <h3 className="mt-6 font-headline text-xl font-extrabold uppercase tracking-[0.04em] text-primary">
          {client.name}
        </h3>

        <span className="mt-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
          {client.category}
        </span>

        {meta ? <p className="mt-4 text-sm font-medium text-slate-500">{meta}</p> : null}
      </div>
    </article>
  );
}

function PaginationControls({
  label,
  page,
  totalPages,
  totalItems,
  onPageChange,
}) {
  const start = totalItems ? (page - 1) * ITEMS_PER_PAGE + 1 : 0;
  const end = totalItems ? Math.min(page * ITEMS_PER_PAGE, totalItems) : 0;

  return (
    <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label} pagination
        </p>
        <p className="mt-1 text-sm font-medium text-slate-600">
          Showing {start}-{end} of {totalItems} {label.toLowerCase()}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-45"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1;
          const isActive = pageNumber === page;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`inline-flex h-11 min-w-11 items-center justify-center rounded-2xl px-3 text-sm font-bold transition-all ${
                isActive
                  ? "bg-primary text-white shadow-[0_12px_28px_rgba(21,114,200,0.22)]"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-primary/30 hover:text-primary"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-45"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function FormModal({
  title,
  description,
  submitLabel,
  submitDisabled = false,
  onClose,
  onSubmit,
  children,
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[30px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Add New Entry</p>
            <h3 className="mt-2 font-headline text-2xl font-extrabold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition-all hover:border-primary/30 hover:text-primary"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
          {children}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-700 transition-all hover:border-primary/30 hover:text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitDisabled}
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_14px_32px_rgba(21,114,200,0.24)] transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.28)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-400">Confirmation</p>
        <h3 className="mt-2 font-headline text-2xl font-extrabold text-slate-900">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-700 transition-all hover:border-primary/30 hover:text-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-rose-700 transition-all hover:bg-rose-100"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function LeadsChart({ leads }) {
  const counts = leadStages.map((stage) => ({
    stage,
    count: leads.filter((lead) => lead.stage === stage).length,
  }));
  const maxCount = Math.max(...counts.map((item) => item.count), 1);

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Lead Funnel</p>
          <h3 className="mt-2 font-headline text-xl font-extrabold text-slate-900">Leads by stage</h3>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Total Leads</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{leads.length}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {counts.map((item) => (
          <div key={item.stage} className="grid grid-cols-[120px_minmax(0,1fr)_36px] items-center gap-3">
            <span className="text-sm font-semibold text-slate-600">{item.stage}</span>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#1572C8_0%,#2AAF6F_100%)]"
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-right text-sm font-bold text-slate-900">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadStageBadge({ stage }) {
  const theme =
    stage === "Won"
      ? "bg-emerald-50 text-emerald-700"
      : stage === "Lost"
        ? "bg-rose-50 text-rose-700"
        : stage === "Proposal Sent"
          ? "bg-amber-50 text-amber-700"
          : stage === "Qualified"
            ? "bg-sky-50 text-sky-700"
            : stage === "Contacted"
              ? "bg-violet-50 text-violet-700"
              : "bg-slate-100 text-slate-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${theme}`}>
      {stage}
    </span>
  );
}

function LeadCards({
  leads,
  editable = false,
  onStageChange,
  onDelete,
}) {
  if (!leads.length) {
    return (
      <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
        <p className="text-sm font-semibold text-slate-500">No leads available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead, index) => (
        <div key={lead.id ?? `${lead.email}-${index}`} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <h4 className="font-headline text-lg font-extrabold text-slate-900">{lead.name}</h4>
                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {lead.company}
                </span>
                <LeadStageBadge stage={lead.stage} />
              </div>
              <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">{lead.requirement}</p>
              <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:gap-4">
                <span>{lead.email}</span>
                <span>{lead.phone}</span>
                <span>{formatLeadTimestamp(lead.createdAt)}</span>
              </div>
            </div>

            {editable ? (
              <div className="flex flex-col gap-3 sm:flex-row xl:w-[320px] xl:justify-end">
                <label className="min-w-[180px]">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Lead Stage
                  </span>
                  <select
                    value={lead.stage}
                    onChange={(event) => onStageChange?.(lead, event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  >
                    {leadStages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => onDelete?.(lead)}
                  className="inline-flex items-center justify-center gap-1.5 self-end rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-rose-700 transition-all hover:bg-rose-50 sm:self-auto"
                >
                  <span className="material-symbols-outlined !text-sm">delete</span>
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function updateField(setContent, section, field, value) {
  setContent((current) => ({
    ...current,
    [section]: { ...current[section], [field]: value },
  }));
}

function updateSeoPageField(setContent, pageKey, field, value) {
  setContent((current) => {
    const nextPages = {
      ...current.seo.pages,
      [pageKey]: {
        ...current.seo.pages[pageKey],
        [field]: value,
      },
    };

    return {
      ...current,
      seo: {
        ...current.seo,
        pages: nextPages,
        homeTitle: nextPages.home.title,
        homeDescription: nextPages.home.description,
      },
    };
  });
}

function updateSeoSchemaField(setContent, field, value) {
  setContent((current) => ({
    ...current,
    seo: {
      ...current.seo,
      schema: {
        ...current.seo.schema,
        [field]: value,
      },
    },
  }));
}

function updateSettingsCompanyLogo(setContent, value) {
  setContent((current) => ({
    ...current,
    settings: {
      ...current.settings,
      companyLogo: value,
    },
    seo: {
      ...current.seo,
      schema: {
        ...current.seo.schema,
        logo: value,
      },
    },
  }));
}

function updateSettingsHeaderLogo(setContent, value) {
  setContent((current) => ({
    ...current,
    settings: {
      ...current.settings,
      headerLogo: value,
    },
  }));
}

function updateListItem(setContent, section, index, field, value) {
  setContent((current) => ({
    ...current,
    [section]: current[section].map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item
    ),
  }));
}

function addListItem(setContent, section, newItem) {
  setContent((current) => ({
    ...current,
    [section]: [...current[section], newItem],
  }));
}

function removeListItem(setContent, section, index) {
  setContent((current) => ({
    ...current,
    [section]: current[section].filter((_, itemIndex) => itemIndex !== index),
  }));
}

function moveListItem(setContent, section, fromIndex, toIndex) {
  setContent((current) => {
    const items = [...current[section]];

    if (!items.length || fromIndex < 0 || fromIndex >= items.length) {
      return current;
    }

    const boundedIndex = Math.max(0, Math.min(toIndex, items.length - 1));

    if (fromIndex === boundedIndex) {
      return current;
    }

    const [movedItem] = items.splice(fromIndex, 1);
    items.splice(boundedIndex, 0, movedItem);

    return {
      ...current,
      [section]: items,
    };
  });
}

function updateNestedListItem(setContent, section, listField, index, field, value) {
  setContent((current) => ({
    ...current,
    [section]: {
      ...current[section],
      [listField]: current[section][listField].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    },
  }));
}

function addNestedListItem(setContent, section, listField, newItem) {
  setContent((current) => ({
    ...current,
    [section]: {
      ...current[section],
      [listField]: [...current[section][listField], newItem],
    },
  }));
}

function removeNestedListItem(setContent, section, listField, index) {
  setContent((current) => ({
    ...current,
    [section]: {
      ...current[section],
      [listField]: current[section][listField].filter((_, itemIndex) => itemIndex !== index),
    },
  }));
}

function ReorderTable({
  title,
  description,
  items,
  columns,
  onMove,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDrop = (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    onMove(draggedIndex, targetIndex);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Entry Table</p>
        <h3 className="mt-1 font-headline text-xl font-extrabold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Order
              </th>
              {columns.map((column) => (
                <th
                  key={column.header}
                  className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500"
                >
                  {column.header}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Move
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <tr
                key={`${title}-${index}`}
                draggable
                onDragStart={() => setDraggedIndex(index)}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOverIndex(index);
                }}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                onDrop={() => handleDrop(index)}
                className={`transition-colors ${dragOverIndex === index ? "bg-primary/5" : "bg-white"}`}
              >
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined cursor-grab text-slate-400">
                      drag_indicator
                    </span>
                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-bold text-slate-700">
                      {index + 1}
                    </span>
                  </div>
                </td>
                {columns.map((column) => (
                  <td key={column.header} className="px-4 py-3 text-sm text-slate-700">
                    {column.render(item, index)}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onMove(index, index - 1)}
                      disabled={index === 0}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-all hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Move ${title.toLowerCase()} row ${index + 1} up`}
                    >
                      <span className="material-symbols-outlined !text-base">arrow_upward</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onMove(index, index + 1)}
                      disabled={index === items.length - 1}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-all hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Move ${title.toLowerCase()} row ${index + 1} down`}
                    >
                      <span className="material-symbols-outlined !text-base">arrow_downward</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default function AdminPanelPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getStoredAuthSession().isAuthenticated);
  const [adminToken, setAdminToken] = useState(() => getStoredAuthSession().token);
  const [authMode, setAuthMode] = useState(() => getStoredAuthSession().mode);
  const [authUser, setAuthUser] = useState(() => getStoredAuthSession().user);
  const [content, setContent] = useState(() => getStoredContent());
  const [serverContentSnapshot, setServerContentSnapshot] = useState(null);
  const [message, setMessage] = useState("");
  const [previewUsername, setPreviewUsername] = useState("");
  const [previewPassword, setPreviewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSessionRestoring, setIsSessionRestoring] = useState(() => getStoredAuthSession().mode === "server");
  const [isServerContentLoading, setIsServerContentLoading] = useState(false);
  const [isSectionSaving, setIsSectionSaving] = useState(false);
  const [isSeoLoading, setIsSeoLoading] = useState(false);
  const [isSeoSaving, setIsSeoSaving] = useState(false);
  const [isLeadsLoading, setIsLeadsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [projectsPage, setProjectsPage] = useState(1);
  const [clientsPage, setClientsPage] = useState(1);
  const [testimonialsPage, setTestimonialsPage] = useState(1);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [projectDraft, setProjectDraft] = useState(() => ({ ...emptyProjectDraft }));
  const [clientDraft, setClientDraft] = useState(() => ({ ...emptyClientDraft }));
  const [testimonialDraft, setTestimonialDraft] = useState(() => ({ ...emptyTestimonialDraft }));
  const [socialDraft, setSocialDraft] = useState(() => ({ ...emptySocialDraft }));
  const [deleteDialog, setDeleteDialog] = useState(null);
  const activeTab = getTab();

  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeTab) ?? sections[0],
    [activeTab]
  );
  const totalProjectPages = Math.max(1, Math.ceil(content.projects.length / ITEMS_PER_PAGE));
  const totalClientPages = Math.max(1, Math.ceil(content.clients.length / ITEMS_PER_PAGE));
  const totalTestimonialPages = Math.max(1, Math.ceil(content.testimonials.length / ITEMS_PER_PAGE));
  const projectStartIndex = (projectsPage - 1) * ITEMS_PER_PAGE;
  const clientStartIndex = (clientsPage - 1) * ITEMS_PER_PAGE;
  const testimonialStartIndex = (testimonialsPage - 1) * ITEMS_PER_PAGE;
  const visibleProjects = content.projects.slice(projectStartIndex, projectStartIndex + ITEMS_PER_PAGE);
  const visibleClients = content.clients.slice(clientStartIndex, clientStartIndex + ITEMS_PER_PAGE);
  const visibleTestimonials = content.testimonials.slice(
    testimonialStartIndex,
    testimonialStartIndex + ITEMS_PER_PAGE
  );
  const isSeoConnected = authMode === "server" && Boolean(adminToken);
  const settingsLogoPreview =
    resolveMediaUrl(content.settings.companyLogo || defaultContent.settings.companyLogo) ||
    loginLogo;
  const headerLogoPreview =
    resolveMediaUrl(
      content.settings.headerLogo ||
        content.settings.companyLogo ||
        defaultContent.settings.headerLogo ||
        defaultContent.settings.companyLogo
    ) || loginLogo;
  const sortedLeads = useMemo(
    () =>
      [...content.leads].sort((left, right) => {
        const leftTime = new Date(left.createdAt).getTime();
        const rightTime = new Date(right.createdAt).getTime();
        return rightTime - leftTime;
      }),
    [content.leads]
  );
  const latestLeads = useMemo(() => sortedLeads.slice(0, 5), [sortedLeads]);

  useEffect(() => {
    if (!message) return undefined;
    const timeoutId = window.setTimeout(() => setMessage(""), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  useEffect(() => {
    if (!authError) return undefined;
    const timeoutId = window.setTimeout(() => setAuthError(""), 2800);
    return () => window.clearTimeout(timeoutId);
  }, [authError]);

  useEffect(() => {
    const intervalId = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setProjectsPage((current) => Math.min(current, totalProjectPages));
  }, [totalProjectPages]);

  useEffect(() => {
    setClientsPage((current) => Math.min(current, totalClientPages));
  }, [totalClientPages]);

  useEffect(() => {
    setTestimonialsPage((current) => Math.min(current, totalTestimonialPages));
  }, [totalTestimonialPages]);

  const openProjectModal = () => {
    setProjectDraft({ ...emptyProjectDraft });
    setIsProjectModalOpen(true);
  };

  const openClientModal = () => {
    setClientDraft({ ...emptyClientDraft });
    setIsClientModalOpen(true);
  };

  const openTestimonialModal = () => {
    setTestimonialDraft({ ...emptyTestimonialDraft });
    setIsTestimonialModalOpen(true);
  };

  const openSocialModal = () => {
    setSocialDraft({ ...emptySocialDraft });
    setIsSocialModalOpen(true);
  };

  const requestDelete = (label, onConfirm, description) => {
    setDeleteDialog({ label, onConfirm, description });
  };

  const applyAuthSession = (nextSession) => {
    const normalizedSession = {
      isAuthenticated: Boolean(nextSession?.isAuthenticated),
      mode: nextSession?.mode === "server" ? "server" : "preview",
      token: nextSession?.token ?? "",
      user: nextSession?.user ?? null,
    };

    setIsAuthenticated(normalizedSession.isAuthenticated);
    setAdminToken(normalizedSession.token);
    setAuthMode(normalizedSession.mode);
    setAuthUser(normalizedSession.user);
    persistAuthSession(normalizedSession);
  };

  const resetAuthState = () => {
    clearStoredAuth();
    setAdminToken("");
    setAuthMode("preview");
    setAuthUser(null);
    setIsAuthenticated(false);
  };

  const moveSessionToPreview = () => {
    resetAuthState();
    setServerContentSnapshot(null);
  };

  const isSessionError = (error) => /token|session|expired|invalid/i.test(error?.message ?? "");

  const syncContentFromBackend = (rawContent) => {
    const normalizedContent = normalizeContent(rawContent ?? {});
    setContent(normalizedContent);
    setServerContentSnapshot(normalizedContent);
    saveStoredContent(normalizedContent);
    return normalizedContent;
  };

  const loadServerContent = async ({ silent = false } = {}) => {
    if (!adminToken) {
      return null;
    }

    if (!silent) {
      setIsServerContentLoading(true);
    }

    try {
      const response = await apiRequest("/admin/content", {
        token: adminToken,
      });

      return syncContentFromBackend(response.data ?? {});
    } catch (error) {
      if (isSessionError(error)) {
        moveSessionToPreview();
        if (!silent) {
          setMessage("Backend session expired. Please log in again.");
        }
        return null;
      }

      if (!silent) {
        setMessage(`Backend content load failed: ${error.message}`);
      }

      throw error;
    } finally {
      if (!silent) {
        setIsServerContentLoading(false);
      }
    }
  };

  const syncCollectionSection = async (section) => {
    const previousItems = Array.isArray(serverContentSnapshot?.[section])
      ? serverContentSnapshot[section]
      : [];
    const previousById = new Map(
      previousItems.filter((item) => item?.id).map((item) => [item.id, item])
    );
    const currentItems = Array.isArray(content[section]) ? content[section] : [];
    const currentIds = new Set(currentItems.map((item) => item?.id).filter(Boolean));
    const nextItems = [];

    for (const item of currentItems) {
      const preparedItem = await prepareSectionItemForSave(section, item, adminToken);
      const payload = getCollectionPayload(section, preparedItem);
      const existingItem = item?.id ? previousById.get(item.id) : null;

      if (existingItem) {
        const previousPayload = getCollectionPayload(section, existingItem);

        if (areEqualPayloads(payload, previousPayload)) {
          nextItems.push(existingItem);
          continue;
        }

        const response = await apiRequest(`/admin/${section}/${item.id}`, {
          method: "PATCH",
          token: adminToken,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        nextItems.push(response.data ?? { ...preparedItem, id: item.id });
        continue;
      }

      const response = await apiRequest(`/admin/${section}`, {
        method: "POST",
        token: adminToken,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      nextItems.push(response.data ?? preparedItem);
    }

    for (const previousItem of previousItems) {
      if (previousItem?.id && !currentIds.has(previousItem.id)) {
        await apiRequest(`/admin/${section}/${previousItem.id}`, {
          method: "DELETE",
          token: adminToken,
        });
      }
    }

    const previousOrder = previousItems.map((item) => item?.id).filter(Boolean);
    const nextOrder = nextItems.map((item) => item?.id).filter(Boolean);

    if (nextOrder.length && !areEqualPayloads(previousOrder, nextOrder)) {
      await apiRequest(`/admin/${section}/reorder`, {
        method: "POST",
        token: adminToken,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedIds: nextOrder }),
      });
    }
  };

  const syncSingletonSection = async (section) => {
    const currentSection = content[section] ?? defaultContent[section] ?? {};
    const previousSection = serverContentSnapshot?.[section] ?? defaultContent[section] ?? {};
    const preparedSection =
      section === "settings"
        ? {
            ...currentSection,
            companyLogo: await uploadMediaValue(
              currentSection.companyLogo,
              "company-logo",
              adminToken
            ),
            headerLogo: await uploadMediaValue(
              currentSection.headerLogo,
              "header-logo",
              adminToken
            ),
          }
        : currentSection;
    const currentPayload = getSingletonPayload(section, preparedSection);
    const previousPayload = getSingletonPayload(section, previousSection);

    if (areEqualPayloads(currentPayload, previousPayload)) {
      return;
    }

    await apiRequest(`/admin/${section}`, {
      method: "PUT",
      token: adminToken,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentPayload),
    });
  };

  const syncContactSection = async () => {
    const currentContact = content.contact ?? defaultContent.contact;
    const previousContact = serverContentSnapshot?.contact ?? defaultContent.contact;
    const currentPayload = getContactPayload(currentContact);
    const previousPayload = getContactPayload(previousContact);

    if (!areEqualPayloads(currentPayload, previousPayload)) {
      await apiRequest("/admin/contact", {
        method: "PUT",
        token: adminToken,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentPayload),
      });
    }

    const previousSocials = Array.isArray(previousContact.socials) ? previousContact.socials : [];
    const previousById = new Map(
      previousSocials.filter((item) => item?.id).map((item) => [item.id, item])
    );
    const currentSocials = Array.isArray(currentContact.socials) ? currentContact.socials : [];
    const currentIds = new Set(currentSocials.map((item) => item?.id).filter(Boolean));
    const nextSocials = [];

    for (const social of currentSocials) {
      const preparedSocial = {
        ...social,
        logo: await uploadMediaValue(
          social.logo,
          `${social.platform || "social"}-logo`,
          adminToken
        ),
      };
      const payload = getSocialPayload(preparedSocial);
      const existingSocial = social?.id ? previousById.get(social.id) : null;

      if (existingSocial) {
        const previousSocialPayload = getSocialPayload(existingSocial);

        if (areEqualPayloads(payload, previousSocialPayload)) {
          nextSocials.push(existingSocial);
          continue;
        }

        const response = await apiRequest(`/admin/contact/socials/${social.id}`, {
          method: "PATCH",
          token: adminToken,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        nextSocials.push(response.data ?? { ...preparedSocial, id: social.id });
        continue;
      }

      const response = await apiRequest("/admin/contact/socials", {
        method: "POST",
        token: adminToken,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      nextSocials.push(response.data ?? preparedSocial);
    }

    for (const previousSocial of previousSocials) {
      if (previousSocial?.id && !currentIds.has(previousSocial.id)) {
        await apiRequest(`/admin/contact/socials/${previousSocial.id}`, {
          method: "DELETE",
          token: adminToken,
        });
      }
    }

    const previousOrder = previousSocials.map((item) => item?.id).filter(Boolean);
    const nextOrder = nextSocials.map((item) => item?.id).filter(Boolean);

    if (nextOrder.length && !areEqualPayloads(previousOrder, nextOrder)) {
      await apiRequest("/admin/contact/socials/reorder", {
        method: "POST",
        token: adminToken,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedIds: nextOrder }),
      });
    }
  };

  const handleActiveSectionSave = async () => {
    if (!adminToken) {
      setMessage("Backend login required. Changes are not published until you connect the admin panel.");
      return;
    }

    setIsSectionSaving(true);

    try {
      if (["projects", "clients", "testimonials"].includes(activeTab)) {
        await syncCollectionSection(activeTab);
      } else if (["home", "settings"].includes(activeTab)) {
        await syncSingletonSection(activeTab);
      } else if (activeTab === "contact") {
        await syncContactSection();
      } else {
        setMessage("This section does not have backend sync yet.");
        return;
      }

      const refreshedContent = await loadServerContent({ silent: true });
      if (!refreshedContent) {
        return;
      }
      notifyPublicContentUpdated();
      setMessage(`${activeSection.label} published to the backend and main website.`);
    } catch (error) {
      if (isSessionError(error)) {
        moveSessionToPreview();
        setMessage("Backend session expired. Please log in again to publish changes.");
      } else {
        setMessage(`${activeSection.label} sync failed: ${error.message}`);
      }
    } finally {
      setIsSectionSaving(false);
    }
  };

  useEffect(() => {
    const storedSession = getStoredAuthSession();

    if (
      !storedSession.isAuthenticated ||
      storedSession.mode !== "server" ||
      !storedSession.token
    ) {
      setIsSessionRestoring(false);
      return undefined;
    }

    let ignore = false;

    const restoreSession = async () => {
      setIsSessionRestoring(true);

      try {
        const response = await apiRequest("/auth/me", {
          token: storedSession.token,
        });

        if (ignore) return;

        applyAuthSession({
          isAuthenticated: true,
          mode: "server",
          token: storedSession.token,
          user: response.user ?? storedSession.user,
        });
      } catch (error) {
        if (ignore) return;

        resetAuthState();
        setAuthError(
          error.message === "Failed to fetch"
            ? "Could not restore the backend admin session. Make sure the backend is running, then log in again."
            : "Your backend admin session expired. Please log in again."
        );
      } finally {
        if (!ignore) {
          setIsSessionRestoring(false);
        }
      }
    };

    restoreSession();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || authMode !== "server" || !adminToken) {
      setServerContentSnapshot(null);
      setIsServerContentLoading(false);
      return undefined;
    }

    let ignore = false;

    const syncAllContent = async () => {
      try {
        const syncedContent = await loadServerContent();

        if (ignore || !syncedContent) {
          return;
        }
      } catch {}
    };

    syncAllContent();

    return () => {
      ignore = true;
    };
  }, [adminToken, authMode, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !adminToken || !["dashboard", "leads"].includes(activeTab)) {
      return undefined;
    }

    let ignore = false;

    const loadLeadsFromBackend = async (silent = false) => {
      if (!silent) {
        setIsLeadsLoading(true);
      }

      try {
        const response = await apiRequest("/admin/leads", {
          token: adminToken,
        });

        if (ignore) return;

        setContent((current) => ({
          ...current,
          leads: Array.isArray(response.data) ? response.data : current.leads,
        }));
      } catch (error) {
        if (ignore) return;

        if (/token|session|expired|invalid/i.test(error.message)) {
          applyAuthSession({
            isAuthenticated: true,
            mode: "preview",
            token: "",
            user: authUser,
          });
        } else if (!silent) {
          setMessage(`Lead sync failed: ${error.message}`);
        }
      } finally {
        if (!ignore) {
          setIsLeadsLoading(false);
        }
      }
    };

    loadLeadsFromBackend();
    const intervalId = window.setInterval(() => {
      loadLeadsFromBackend(true);
    }, 15000);

    return () => {
      ignore = true;
      window.clearInterval(intervalId);
    };
  }, [activeTab, adminToken, authUser, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || activeTab !== "seo" || !adminToken) {
      return undefined;
    }

    let ignore = false;

    const loadSeoFromBackend = async () => {
      setIsSeoLoading(true);

      try {
        const response = await apiRequest("/admin/seo", {
          token: adminToken,
        });

        if (ignore) return;

        const nextSeo = normalizeSeo(response.data ?? {});
        const nextLogo = String(nextSeo.schema.logo ?? "").trim();

        setContent((current) => ({
          ...current,
          seo: {
            ...nextSeo,
            schema: {
              ...nextSeo.schema,
              logo: nextLogo,
            },
          },
          settings: {
            ...current.settings,
            companyLogo: nextLogo,
          },
        }));
      } catch (error) {
        if (ignore) return;
        setMessage(`SEO load fallback: ${error.message}`);
      } finally {
        if (!ignore) {
          setIsSeoLoading(false);
        }
      }
    };

    loadSeoFromBackend();

    return () => {
      ignore = true;
    };
  }, [activeTab, adminToken, isAuthenticated]);

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setIsAuthenticating(true);

    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: previewUsername.trim(),
          password: previewPassword,
        }),
      });

      applyAuthSession({
        isAuthenticated: true,
        mode: "server",
        token: response.token ?? "",
        user: response.user ?? null,
      });
      setAuthError("");
      setMessage("Connected to backend admin.");
      return;
    } catch (error) {
      setAuthError(
        error.message === "Failed to fetch"
          ? "Could not reach the backend. Make sure it is running and try again."
          : error.message
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSeoSave = async () => {
    const nextPayload = getSeoPayload(content.seo, content.settings);
    const nextSeo = normalizeSeo(nextPayload);

    if (!adminToken) {
      setMessage("Backend login required. SEO changes are not published until you connect the admin panel.");
      return;
    }

    setIsSeoSaving(true);

    try {
      const response = await apiRequest("/admin/seo", {
        method: "PUT",
        token: adminToken,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nextPayload),
      });
      const syncedSeo = normalizeSeo(response.data ?? nextPayload);
      const syncedLogo = String(syncedSeo.schema.logo ?? "").trim();
      const syncedContent = {
        ...content,
        seo: {
          ...syncedSeo,
          schema: {
            ...syncedSeo.schema,
            logo: syncedLogo,
          },
        },
        settings: {
          ...content.settings,
          companyLogo: syncedLogo,
        },
      };
      setContent(syncedContent);
      saveStoredContent(syncedContent);
      setServerContentSnapshot((current) =>
        current
          ? {
              ...current,
              seo: syncedContent.seo,
              settings: syncedContent.settings,
            }
          : current
      );
      notifyPublicContentUpdated();
      setMessage("SEO saved to backend.");
    } catch (error) {
      if (isSessionError(error)) {
        moveSessionToPreview(authUser);
        setMessage("Backend session expired. Please log in again to publish SEO changes.");
        return;
      }

      setMessage(`SEO sync failed: ${error.message}`);
    } finally {
      setIsSeoSaving(false);
    }
  };

  const handleLeadStageChange = async (lead, nextStage) => {
    if (!lead) return;

    if (!adminToken) {
      setMessage("Backend login required to update lead stages.");
      return;
    }

    try {
      const response = await apiRequest(`/admin/leads/${lead.id}`, {
        method: "PATCH",
        token: adminToken,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stage: nextStage }),
      });

      setContent((current) => ({
        ...current,
        leads: current.leads.map((item) => (item.id === lead.id ? response.data : item)),
      }));
      setMessage(`Lead moved to ${nextStage}.`);
    } catch (error) {
      if (/token|session|expired|invalid/i.test(error.message)) {
        applyAuthSession({
          isAuthenticated: true,
          mode: "preview",
          token: "",
          user: authUser,
        });
      }
      setMessage(`Lead update failed: ${error.message}`);
    }
  };

  const handleLeadDelete = (lead) => {
    if (!lead) return;

    requestDelete(
      "Lead",
      async () => {
        if (!adminToken) {
          const nextContent = {
            ...content,
            leads: content.leads.filter((item) => item.id !== lead.id),
          };
          setContent(nextContent);
          saveStoredContent(nextContent);
          return;
        }

        try {
          await apiRequest(`/admin/leads/${lead.id}`, {
            method: "DELETE",
            token: adminToken,
          });

          setContent((current) => ({
            ...current,
            leads: current.leads.filter((item) => item.id !== lead.id),
          }));
        } catch (error) {
          if (/token|session|expired|invalid/i.test(error.message)) {
            applyAuthSession({
              isAuthenticated: true,
              mode: "preview",
              token: "",
              user: authUser,
            });
          }
          setMessage(`Lead delete failed: ${error.message}`);
        }
      },
      "This lead will be removed from the admin pipeline. Please confirm before we continue."
    );
  };

  if (isSessionRestoring) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#dff1e7_0%,#f5f9fc_35%,#eff5fb_65%,#ffffff_100%)] px-6 py-10">
        <div className="relative z-10 w-full max-w-sm rounded-[32px] border border-slate-200 bg-white/95 p-8 text-center shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
          </div>
          <h1 className="mt-5 font-headline text-2xl font-extrabold text-slate-900">
            Restoring Admin Session
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            We&apos;re verifying your backend session so refreshes stay smooth for future connected admin tabs.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#dff1e7_0%,#f5f9fc_35%,#eff5fb_65%,#ffffff_100%)] px-6 py-10">
        {authError ? (
          <div className="fixed left-1/2 top-6 z-20 -translate-x-1/2 rounded-2xl border border-rose-200 bg-white px-5 py-4 text-sm font-semibold text-rose-700 shadow-[0_20px_45px_rgba(244,63,94,0.18)]">
            {authError}
          </div>
        ) : null}

        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-[8%] top-[12%] h-56 w-56 rounded-full bg-[#1572C8]/10 blur-3xl" />
          <div className="absolute bottom-[10%] right-[10%] h-64 w-64 rounded-full bg-[#2AAF6F]/12 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-sm rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:max-w-md sm:p-7 md:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-[24px] border border-slate-100 bg-slate-50 px-5 py-4 shadow-[0_18px_35px_rgba(15,23,42,0.06)]">
              <img src={loginLogo} alt="Environomics Logo" className="h-14 w-auto object-contain" />
            </div>
            <h1 className="mt-5 font-headline text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Admin Login
            </h1>
          </div>

          <form
            className="mt-7 space-y-4"
            onSubmit={handleAdminLogin}
          >
            <Field
              label="Username"
              value={previewUsername}
              autoComplete="username"
              onChange={(event) => setPreviewUsername(event.target.value)}
            />
            <Field
              label="Password"
              type={showPassword ? "text" : "password"}
              value={previewPassword}
              autoComplete="current-password"
              onChange={(event) => setPreviewPassword(event.target.value)}
              trailingAction={
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold uppercase tracking-[0.08em] text-primary transition-all hover:bg-primary/5"
                >
                  <span className="material-symbols-outlined text-base">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                  {showPassword ? "Hide" : "Show"}
                </button>
              }
            />
            <button
              type="submit"
              disabled={isAuthenticating}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1572C8_0%,#1D8C57_100%)] px-5 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_18px_45px_rgba(21,114,200,0.28)] transition-transform hover:-translate-y-0.5"
            >
              {isAuthenticating ? "Connecting..." : "Enter Admin"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eaf1f7_0%,#f8fbfd_34%,#ffffff_100%)] text-slate-900">
      {isProjectModalOpen ? (
        <FormModal
          title="Add Project"
          description="Fill the project details, project description, and upload the project image plus the client company logo before adding it to the admin list. Draft projects stay hidden until you switch them to Published."
          submitLabel="Add Project"
          submitDisabled={!projectDraft.name.trim()}
          onClose={() => setIsProjectModalOpen(false)}
          onSubmit={(event) => {
            event.preventDefault();
            setContent((current) => ({
              ...current,
              projects: [...current.projects, normalizeProject(projectDraft)],
            }));
            setProjectsPage(Math.ceil((content.projects.length + 1) / ITEMS_PER_PAGE));
            setIsProjectModalOpen(false);
            setProjectDraft({ ...emptyProjectDraft });
            setMessage("Project added. Save changes to sync.");
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Project Name"
              value={projectDraft.name}
              onChange={(event) => setProjectDraft((current) => ({ ...current, name: event.target.value }))}
              placeholder="GRG COTSPIN"
            />
            <Field
              label="Capacity"
              value={projectDraft.capacity}
              onChange={(event) => setProjectDraft((current) => ({ ...current, capacity: event.target.value }))}
              placeholder="4,200 kWp Solar"
            />
            <Field
              label="Description"
              value={projectDraft.description}
              multiline
              onChange={(event) => setProjectDraft((current) => ({ ...current, description: event.target.value }))}
              placeholder="2020  ENGINEERING  Dual-service (Solar + HVAC)."
            />
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</span>
              <select
                value={projectDraft.status}
                onChange={(event) =>
                  setProjectDraft((current) => ({
                    ...current,
                    status: normalizeProjectStatus(event.target.value, emptyProjectDraft.status),
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              >
                {projectStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4 transition-all hover:border-primary/40 hover:bg-white">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Upload Project Image</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-semibold file:text-primary hover:file:bg-primary/15"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === "string") {
                      setProjectDraft((current) => ({ ...current, image: reader.result }));
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
              <p className="mt-2 text-xs text-slate-500">{projectDraft.image ? "Project image ready to add." : "Choose the project image from your device."}</p>
            </label>

            <label className="block rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4 transition-all hover:border-primary/40 hover:bg-white">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Upload Company Logo</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-semibold file:text-primary hover:file:bg-primary/15"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === "string") {
                      setProjectDraft((current) => ({ ...current, companyLogo: reader.result }));
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
              <p className="mt-2 text-xs text-slate-500">{projectDraft.companyLogo ? "Company logo ready to add." : "Choose the client company logo from your device."}</p>
            </label>
          </div>
        </FormModal>
      ) : null}

      {isClientModalOpen ? (
        <FormModal
          title="Add Client"
          description="Fill the company details and upload the logo before adding the client card to the admin list."
          submitLabel="Add Client"
          submitDisabled={!clientDraft.name.trim()}
          onClose={() => setIsClientModalOpen(false)}
          onSubmit={(event) => {
            event.preventDefault();
            setContent((current) => ({
              ...current,
              clients: [...current.clients, normalizeClient(clientDraft)],
            }));
            setClientsPage(Math.ceil((content.clients.length + 1) / ITEMS_PER_PAGE));
            setIsClientModalOpen(false);
            setClientDraft({ ...emptyClientDraft });
            setMessage("Client added. Save changes to sync.");
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Company Name"
              value={clientDraft.name}
              onChange={(event) => setClientDraft((current) => ({ ...current, name: event.target.value }))}
              placeholder="GRG Cotspin"
            />
            <Field
              label="Category"
              value={clientDraft.category}
              onChange={(event) => setClientDraft((current) => ({ ...current, category: event.target.value }))}
              placeholder="Textiles"
            />
            <Field
              label="Year"
              value={clientDraft.year}
              onChange={(event) => setClientDraft((current) => ({ ...current, year: event.target.value }))}
              placeholder="2023"
            />
            <Field
              label="Capacity"
              value={clientDraft.capacity}
              onChange={(event) => setClientDraft((current) => ({ ...current, capacity: event.target.value }))}
              placeholder="4,200 kWp"
            />
          </div>

          <label className="block rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4 transition-all hover:border-primary/40 hover:bg-white">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Upload Company Logo</span>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-semibold file:text-primary hover:file:bg-primary/15"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === "string") {
                    setClientDraft((current) => ({ ...current, companyLogo: reader.result }));
                  }
                };
                reader.readAsDataURL(file);
              }}
            />
            <p className="mt-2 text-xs text-slate-500">{clientDraft.companyLogo ? "Company logo ready to add." : "Choose the client company logo from your device."}</p>
          </label>
        </FormModal>
      ) : null}

      {isTestimonialModalOpen ? (
        <FormModal
          title="Add Testimonial"
          description="Fill the testimonial details and upload the supporting image before adding it to the admin list."
          submitLabel="Add Testimonial"
          submitDisabled={!testimonialDraft.title.trim()}
          onClose={() => setIsTestimonialModalOpen(false)}
          onSubmit={(event) => {
            event.preventDefault();
            setContent((current) => ({
              ...current,
              testimonials: [...current.testimonials, normalizeTestimonial(testimonialDraft)],
            }));
            setTestimonialsPage(Math.ceil((content.testimonials.length + 1) / ITEMS_PER_PAGE));
            setIsTestimonialModalOpen(false);
            setTestimonialDraft({ ...emptyTestimonialDraft });
            setMessage("Testimonial added. Save changes to sync.");
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Title"
              value={testimonialDraft.title}
              onChange={(event) =>
                setTestimonialDraft((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Siemens Energy"
            />
            <Field
              label="Subtitle"
              value={testimonialDraft.subtitle}
              onChange={(event) =>
                setTestimonialDraft((current) => ({ ...current, subtitle: event.target.value }))
              }
              placeholder="Procurement Manager"
            />
            <Field
              label="Tag"
              value={testimonialDraft.tag}
              onChange={(event) =>
                setTestimonialDraft((current) => ({ ...current, tag: event.target.value }))
              }
              placeholder="Heavy Engineering"
            />
            <Field
              label="Installed"
              value={testimonialDraft.installed}
              onChange={(event) =>
                setTestimonialDraft((current) => ({ ...current, installed: event.target.value }))
              }
              placeholder="2023"
            />
            <Field
              label="Capacity"
              value={testimonialDraft.capacity}
              onChange={(event) =>
                setTestimonialDraft((current) => ({ ...current, capacity: event.target.value }))
              }
              placeholder="1,300 kWp"
            />
          </div>

          <label className="block rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4 transition-all hover:border-primary/40 hover:bg-white">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-semibold file:text-primary hover:file:bg-primary/15"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === "string") {
                    setTestimonialDraft((current) => ({ ...current, image: reader.result }));
                  }
                };
                reader.readAsDataURL(file);
              }}
            />
            <p className="mt-2 text-xs text-slate-500">
              {testimonialDraft.image ? "Testimonial image ready to add." : "Choose the testimonial image from your device."}
            </p>
          </label>

          <Field
            label="Description"
            value={testimonialDraft.description}
            multiline
            onChange={(event) =>
              setTestimonialDraft((current) => ({ ...current, description: event.target.value }))
            }
            placeholder="Add the full testimonial copy shown inside the card."
          />
        </FormModal>
      ) : null}

      {isSocialModalOpen ? (
        <FormModal
          title="Add Social Media Link"
          description="Add the platform name, handle, destination link, and an optional logo for the contact page social media section."
          submitLabel="Add Social Link"
          submitDisabled={!socialDraft.platform.trim() || !socialDraft.url.trim()}
          onClose={() => setIsSocialModalOpen(false)}
          onSubmit={(event) => {
            event.preventDefault();
            addNestedListItem(setContent, "contact", "socials", normalizeSocialLink(socialDraft));
            setIsSocialModalOpen(false);
            setSocialDraft({ ...emptySocialDraft });
            setMessage("Social link added. Save changes to sync.");
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Platform"
              value={socialDraft.platform}
              onChange={(event) =>
                setSocialDraft((current) => ({ ...current, platform: event.target.value }))
              }
              placeholder="LinkedIn"
            />
            <Field
              label="Handle"
              value={socialDraft.handle}
              onChange={(event) =>
                setSocialDraft((current) => ({ ...current, handle: event.target.value }))
              }
              placeholder="@environomics-projects-llp"
            />
            <div className="sm:col-span-2">
              <Field
                label="Link URL"
                value={socialDraft.url}
                onChange={(event) =>
                  setSocialDraft((current) => ({ ...current, url: event.target.value }))
                }
                placeholder="https://www.linkedin.com/company/environomics-projects-llp/"
              />
            </div>
          </div>

          <label className="block rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4 transition-all hover:border-primary/40 hover:bg-white">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Upload Social Logo</span>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-semibold file:text-primary hover:file:bg-primary/15"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === "string") {
                    setSocialDraft((current) => ({ ...current, logo: reader.result }));
                  }
                };
                reader.readAsDataURL(file);
              }}
            />
            <p className="mt-2 text-xs text-slate-500">
              {socialDraft.logo ? "Social logo ready to add." : "Choose the platform logo from your device."}
            </p>
          </label>
        </FormModal>
      ) : null}

      {deleteDialog ? (
        <ConfirmModal
          title={`Delete ${deleteDialog.label}?`}
          description={
            deleteDialog.description ??
            `This will permanently remove this ${deleteDialog.label.toLowerCase()} from the admin list. Please confirm before we continue.`
          }
          confirmLabel={`Delete ${deleteDialog.label}`}
          onCancel={() => setDeleteDialog(null)}
          onConfirm={async () => {
            try {
              await Promise.resolve(deleteDialog.onConfirm());
              setMessage(`${deleteDialog.label} deleted.`);
            } finally {
              setDeleteDialog(null);
            }
          }}
        />
      ) : null}

      <div className="mx-auto max-w-[1680px] p-3 lg:p-5">
        <header className="overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#0d1b2a_0%,#15314a_62%,#1b4d73_100%)] text-white shadow-[0_24px_60px_rgba(13,27,42,0.18)]">
          <div className="border-b border-white/10 px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={adminLogo}
                  alt="Environomics Logo"
                  className="h-12 w-auto object-contain"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                    Environomics Admin
                  </p>
                  <h1 className="mt-1 font-headline text-2xl font-extrabold text-white">
                    {activeSection.label}
                  </h1>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${
                      authMode === "server"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {authMode === "server" ? "Backend Session" : "Connection Required"}
                  </span>
                  {authUser?.username ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/65">
                      Signed in as {authUser.username}
                    </p>
                  ) : null}
                </div>
                {message ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                    {message}
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    resetAuthState();
                  }}
                  className="rounded-2xl border border-white/20 px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-white/10"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>

          <nav className="flex gap-3 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
            {sections.map((section) => {
              const isActive = section.id === activeTab;
              return (
                <a
                  key={section.id}
                  href={`/admin?tab=${section.id}`}
                  className={`flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "border-white/30 bg-white text-slate-900 shadow-[0_14px_30px_rgba(255,255,255,0.14)]"
                      : "border-white/12 bg-white/0 text-white/78 hover:border-white/18 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span className={`material-symbols-outlined ${isActive ? "text-primary" : "text-white/55"}`}>
                    {section.icon}
                  </span>
                  <span>{section.label}</span>
                </a>
              );
            })}
          </nav>
        </header>

        <main className="mt-4 min-w-0">
          <div className="rounded-[30px] border border-white/70 bg-white p-4 shadow-[0_24px_55px_rgba(15,23,42,0.08)] sm:p-5 md:p-6 lg:p-7">
            <div className="space-y-6">
              {!["dashboard", "leads"].includes(activeTab) ? (
                <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {activeSection.label} actions
                    </p>
                    <h3 className="mt-2 font-headline text-xl font-extrabold text-slate-900">
                      {activeTab === "seo"
                        ? "Save SEO changes and schema settings"
                        : activeTab === "settings"
                          ? "Save footer year and website logo"
                        : `Save changes for ${activeSection.label.toLowerCase()}`}
                    </h3>
                    {activeTab === "seo" ? (
                      <p className="mt-2 text-sm text-slate-600">
                        {isSeoConnected
                          ? "This tab is connected to the backend and will sync into MySQL when you save."
                          : "Backend login is required to publish SEO changes to the main website."}
                      </p>
                    ) : activeTab === "settings" ? (
                      <p className="mt-2 text-sm text-slate-600">
                        Save Changes publishes the footer year and the main website logo used in
                        the header and structured data. The footer keeps its white logo.
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={
                      activeTab === "seo"
                        ? handleSeoSave
                        : handleActiveSectionSave
                    }
                    disabled={
                      activeTab === "seo"
                        ? isSeoLoading || isSeoSaving
                        : isSectionSaving || isServerContentLoading
                    }
                    className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_32px_rgba(21,114,200,0.24)] transition-all hover:bg-primary/90"
                  >
                    {activeTab === "seo"
                      ? isSeoLoading
                        ? "Loading SEO..."
                        : isSeoSaving
                          ? "Saving SEO..."
                          : "Save SEO"
                      : isSectionSaving
                        ? "Saving..."
                        : adminToken
                          ? "Save Changes"
                          : "Connect Backend"}
                  </button>
                </div>
              ) : null}

              {activeTab === "dashboard" ? (
                <div className="space-y-5">
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_360px]">
                    <LeadsChart leads={content.leads} />

                    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Date and Time</p>
                      <h3 className="mt-2 font-headline text-xl font-extrabold text-slate-900">Live dashboard clock</h3>
                      <div className="mt-6 rounded-[22px] bg-slate-50 p-5">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {currentTime.toLocaleDateString("en-IN", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <p className="mt-3 font-headline text-4xl font-extrabold text-slate-900">
                          {currentTime.toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Open Leads</p>
                          <p className="mt-2 text-2xl font-extrabold text-slate-900">
                            {content.leads.filter((lead) => !["Won", "Lost"].includes(lead.stage)).length}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Won Leads</p>
                          <p className="mt-2 text-2xl font-extrabold text-slate-900">
                            {content.leads.filter((lead) => lead.stage === "Won").length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Latest Leads</p>
                        <h3 className="mt-2 font-headline text-xl font-extrabold text-slate-900">Recent contact requests</h3>
                      </div>
                      <a href="/admin?tab=leads" className="text-sm font-semibold text-primary">
                        Open Leads tab
                      </a>
                    </div>

                    <div className="mt-5">
                      {isLeadsLoading ? (
                        <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
                          <p className="text-sm font-semibold text-slate-500">Loading latest leads...</p>
                        </div>
                      ) : (
                        <LeadCards leads={latestLeads} />
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "leads" ? (
                <div className="space-y-5">
                  <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Lead Management</p>
                      <h3 className="mt-2 font-headline text-xl font-extrabold text-slate-900">All captured inquiries</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Leads from the public Contact Us form will appear here. Update stages or delete entries from this pipeline.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Total Leads</p>
                      <p className="mt-1 text-2xl font-extrabold text-slate-900">{content.leads.length}</p>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Lead Queue</p>
                        <h3 className="mt-2 font-headline text-xl font-extrabold text-slate-900">Manage every inquiry</h3>
                      </div>
                      <p className="text-sm text-slate-500">
                        {authMode === "server"
                          ? "Changes here sync with the backend and database."
                          : "Backend login is required before lead changes can be saved."}
                      </p>
                    </div>

                    <div className="mt-5">
                      {isLeadsLoading ? (
                        <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
                          <p className="text-sm font-semibold text-slate-500">Loading leads...</p>
                        </div>
                      ) : (
                        <LeadCards
                          leads={sortedLeads}
                          editable
                          onStageChange={handleLeadStageChange}
                          onDelete={handleLeadDelete}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "home" ? (
                <div className="grid gap-5 lg:grid-cols-2">
                  <Field label="Hero Title" value={content.home.title} multiline onChange={(event) => updateField(setContent, "home", "title", event.target.value)} />
                  <Field label="Hero Subtitle" value={content.home.subtitle} onChange={(event) => updateField(setContent, "home", "subtitle", event.target.value)} />
                  <Field label="Primary CTA" value={content.home.ctaPrimary} onChange={(event) => updateField(setContent, "home", "ctaPrimary", event.target.value)} />
                  <Field label="Secondary CTA" value={content.home.ctaSecondary} onChange={(event) => updateField(setContent, "home", "ctaSecondary", event.target.value)} />
                </div>
              ) : null}

              {activeTab === "projects" ? (
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div>
                      <h3 className="font-headline text-xl font-extrabold text-slate-900">Manage Projects</h3>
                      <p className="mt-1 text-sm text-slate-600">Add project images, client logos, capacity, description, and publish status. Draft projects stay hidden on the live Projects page until you change them to Published.</p>
                    </div>
                    <button
                      type="button"
                      onClick={openProjectModal}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-primary/90"
                    >
                      <span className="material-symbols-outlined !text-base">add</span>
                      Add Project
                    </button>
                  </div>

                  {visibleProjects.map((project, index) => {
                    const projectIndex = projectStartIndex + index;

                    return (
                    <div key={`${project.name}-${index}`} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
                      <div className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Project {projectIndex + 1}</p>
                          <h4 className="mt-1 font-headline text-lg font-extrabold text-slate-900">{project.name}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            requestDelete("Project", () => removeListItem(setContent, "projects", projectIndex))
                          }
                          disabled={content.projects.length === 1}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.12em] text-rose-700 transition-all hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined !text-base">delete</span>
                          Delete Project
                        </button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <Field label="Project Name" value={project.name} onChange={(event) => updateListItem(setContent, "projects", projectIndex, "name", event.target.value)} />
                        <Field label="Capacity" value={project.capacity} onChange={(event) => updateListItem(setContent, "projects", projectIndex, "capacity", event.target.value)} />
                        <label className="block">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</span>
                          <select
                            value={normalizeProjectStatus(project.status, defaultProject.status)}
                            onChange={(event) =>
                              updateListItem(
                                setContent,
                                "projects",
                                projectIndex,
                                "status",
                                normalizeProjectStatus(event.target.value, defaultProject.status)
                              )
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                          >
                            {projectStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="mt-4">
                        <Field
                          label="Description"
                          value={project.description}
                          multiline
                          onChange={(event) => updateListItem(setContent, "projects", projectIndex, "description", event.target.value)}
                          placeholder="2020  ENGINEERING  Dual-service (Solar + HVAC)."
                        />
                      </div>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <label className="block rounded-[24px] border border-dashed border-slate-300 bg-white p-4 transition-all hover:border-primary/40">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Upload Project Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-semibold file:text-primary hover:file:bg-primary/15"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === "string") {
                                  updateListItem(setContent, "projects", projectIndex, "image", reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                          <p className="mt-2 text-xs text-slate-500">Upload a new image to replace the current project asset.</p>
                        </label>
                        <label className="block rounded-[24px] border border-dashed border-slate-300 bg-white p-4 transition-all hover:border-primary/40">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Upload Company Logo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-semibold file:text-primary hover:file:bg-primary/15"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === "string") {
                                  updateListItem(setContent, "projects", projectIndex, "companyLogo", reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                          <p className="mt-2 text-xs text-slate-500">Upload a logo file instead of entering a URL.</p>
                        </label>
                      </div>
                    </div>
                  );
                  })}

                  <PaginationControls
                    label="Projects"
                    page={projectsPage}
                    totalPages={totalProjectPages}
                    totalItems={content.projects.length}
                    onPageChange={setProjectsPage}
                  />

                  <ReorderTable
                    title="Project Order Table"
                    description="Review every project entry in one place. Drag rows or use the arrows to change the order."
                    items={content.projects}
                    onMove={(fromIndex, toIndex) => moveListItem(setContent, "projects", fromIndex, toIndex)}
                    columns={[
                      {
                        header: "Project",
                        render: (project) => (
                          <span className="font-semibold text-slate-900">{project.name}</span>
                        ),
                      },
                      { header: "Capacity", render: (project) => project.capacity },
                      { header: "Status", render: (project) => project.status },
                    ]}
                  />
                </div>
              ) : null}

              {activeTab === "clients" ? (
                <div className="space-y-5">
                  <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div>
                      <h3 className="font-headline text-xl font-extrabold text-slate-900">Manage Client Cards</h3>
                      <p className="mt-1 text-sm text-slate-600">The admin panel now starts with the original website clients and lets you add logos, company name, category, year, and capacity.</p>
                    </div>
                    <button
                      type="button"
                      onClick={openClientModal}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_32px_rgba(21,114,200,0.24)] transition-all hover:bg-primary/90"
                    >
                      <span className="material-symbols-outlined !text-base">add</span>
                      Add Client
                    </button>
                  </div>

                  {visibleClients.map((client, index) => {
                    const clientIndex = clientStartIndex + index;

                    return (
                    <div key={`${client.name}-${index}`} className="rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Client {clientIndex + 1}</p>
                          <h4 className="mt-1 font-headline text-lg font-extrabold text-slate-900">{client.name || "Untitled client"}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            requestDelete("Client", () => removeListItem(setContent, "clients", clientIndex))
                          }
                          disabled={content.clients.length === 1}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.12em] text-rose-700 transition-all hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined !text-base">delete</span>
                          Delete Client
                        </button>
                      </div>

                      <div className="space-y-5 p-4 sm:p-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Company Name" value={client.name} onChange={(event) => updateListItem(setContent, "clients", clientIndex, "name", event.target.value)} placeholder="GRG Cotspin" />
                          <Field label="Category" value={client.category} onChange={(event) => updateListItem(setContent, "clients", clientIndex, "category", event.target.value)} placeholder="Textiles" />
                          <Field label="Year" value={client.year} onChange={(event) => updateListItem(setContent, "clients", clientIndex, "year", event.target.value)} placeholder="2023" />
                          <Field label="Capacity" value={client.capacity} onChange={(event) => updateListItem(setContent, "clients", clientIndex, "capacity", event.target.value)} placeholder="4,200 kWp" />
                        </div>

                        <label className="block rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4 transition-all hover:border-primary/40 hover:bg-white">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Upload Company Logo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-semibold file:text-primary hover:file:bg-primary/15"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === "string") {
                                  updateListItem(setContent, "clients", clientIndex, "companyLogo", reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                          <p className="mt-2 text-xs text-slate-500">Use this to replace the client logo directly from your device.</p>
                        </label>
                      </div>
                    </div>
                  );
                  })}

                  <PaginationControls
                    label="Clients"
                    page={clientsPage}
                    totalPages={totalClientPages}
                    totalItems={content.clients.length}
                    onPageChange={setClientsPage}
                  />

                  <ReorderTable
                    title="Client Order Table"
                    description="See all client entries together and drag them into the sequence you want."
                    items={content.clients}
                    onMove={(fromIndex, toIndex) => moveListItem(setContent, "clients", fromIndex, toIndex)}
                    columns={[
                      {
                        header: "Client",
                        render: (client) => (
                          <span className="font-semibold text-slate-900">{client.name}</span>
                        ),
                      },
                      { header: "Category", render: (client) => client.category },
                      { header: "Year", render: (client) => client.year },
                      { header: "Capacity", render: (client) => client.capacity },
                    ]}
                  />
                </div>
              ) : null}

              {activeTab === "testimonials" ? (
                <div className="space-y-5">
                  <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div>
                      <h3 className="font-headline text-xl font-extrabold text-slate-900">Manage Testimonial Cards</h3>
                      <p className="mt-1 text-sm text-slate-600">The admin panel now starts with the original website testimonials and uses the same add-popup plus pagination flow as projects and clients.</p>
                    </div>
                    <button
                      type="button"
                      onClick={openTestimonialModal}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_32px_rgba(21,114,200,0.24)] transition-all hover:bg-primary/90"
                    >
                      <span className="material-symbols-outlined !text-base">add</span>
                      Add Testimonial
                    </button>
                  </div>

                  {visibleTestimonials.map((testimonial, index) => {
                    const testimonialIndex = testimonialStartIndex + index;

                    return (
                    <div key={`${testimonial.title}-${testimonialIndex}`} className="rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Testimonial {testimonialIndex + 1}</p>
                          <h4 className="mt-1 font-headline text-lg font-extrabold text-slate-900">{testimonial.title || "Untitled testimonial"}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            requestDelete(
                              "Testimonial",
                              () => removeListItem(setContent, "testimonials", testimonialIndex)
                            )
                          }
                          disabled={content.testimonials.length === 1}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.12em] text-rose-700 transition-all hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined !text-base">delete</span>
                          Delete Testimonial
                        </button>
                      </div>

                      <div className="space-y-5 p-4 sm:p-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Title" value={testimonial.title} onChange={(event) => updateListItem(setContent, "testimonials", testimonialIndex, "title", event.target.value)} placeholder="Siemens Energy" />
                          <Field label="Subtitle" value={testimonial.subtitle} onChange={(event) => updateListItem(setContent, "testimonials", testimonialIndex, "subtitle", event.target.value)} placeholder="Procurement Manager" />
                          <Field label="Tag" value={testimonial.tag} onChange={(event) => updateListItem(setContent, "testimonials", testimonialIndex, "tag", event.target.value)} placeholder="Heavy Engineering" />
                          <Field label="Installed" value={testimonial.installed} onChange={(event) => updateListItem(setContent, "testimonials", testimonialIndex, "installed", event.target.value)} placeholder="2023" />
                          <Field label="Capacity" value={testimonial.capacity} onChange={(event) => updateListItem(setContent, "testimonials", testimonialIndex, "capacity", event.target.value)} placeholder="1,300 kWp" />
                        </div>

                        <label className="block rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4 transition-all hover:border-primary/40 hover:bg-white">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Upload Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-semibold file:text-primary hover:file:bg-primary/15"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === "string") {
                                  updateListItem(setContent, "testimonials", testimonialIndex, "image", reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                          <p className="mt-2 text-xs text-slate-500">Uploads are published to the main website when you save with a backend session.</p>
                        </label>

                        <Field label="Description" value={testimonial.description} multiline onChange={(event) => updateListItem(setContent, "testimonials", testimonialIndex, "description", event.target.value)} placeholder="Add the full testimonial copy shown inside the card." />
                      </div>
                    </div>
                  );
                  })}

                  <PaginationControls
                    label="Testimonials"
                    page={testimonialsPage}
                    totalPages={totalTestimonialPages}
                    totalItems={content.testimonials.length}
                    onPageChange={setTestimonialsPage}
                  />

                  <ReorderTable
                    title="Testimonial Order Table"
                    description="Review all testimonial cards together and drag to reorder them for the admin list."
                    items={content.testimonials}
                    onMove={(fromIndex, toIndex) => moveListItem(setContent, "testimonials", fromIndex, toIndex)}
                    columns={[
                      {
                        header: "Title",
                        render: (testimonial) => (
                          <span className="font-semibold text-slate-900">{testimonial.title}</span>
                        ),
                      },
                      { header: "Tag", render: (testimonial) => testimonial.tag },
                      { header: "Installed", render: (testimonial) => testimonial.installed },
                      { header: "Capacity", render: (testimonial) => testimonial.capacity },
                    ]}
                  />
                </div>
              ) : null}
              {activeTab === "contact" ? (
                <div className="space-y-5">
                  <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                    <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Contact Details
                      </p>
                      <h3 className="mt-1 font-headline text-xl font-extrabold text-slate-900">
                        Core contact information
                      </h3>
                    </div>

                    <div className="space-y-5 p-4 sm:p-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field
                          label="Phone"
                          value={content.contact.phone}
                          placeholder="09998112299"
                          onChange={(event) => updateField(setContent, "contact", "phone", event.target.value)}
                        />
                        <Field
                          label="Email"
                          value={content.contact.email}
                          placeholder="info@environomics.in"
                          onChange={(event) => updateField(setContent, "contact", "email", event.target.value)}
                        />
                        <Field
                          label="LinkedIn URL"
                          value={content.contact.linkedin}
                          placeholder="https://www.linkedin.com/company/environomics-projects-llp/"
                          onChange={(event) => updateField(setContent, "contact", "linkedin", event.target.value)}
                        />
                      </div>

                      <Field
                        label="Address"
                        value={content.contact.address}
                        multiline
                        placeholder="417 Ratna High Street, Naranpura, Ahmedabad, 380013, Gujarat, India"
                        onChange={(event) => updateField(setContent, "contact", "address", event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                    <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Social Media
                        </p>
                        <h3 className="mt-1 font-headline text-xl font-extrabold text-slate-900">
                          Manage social handles
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Add platform names, social handles, destination links, and uploaded logos.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={openSocialModal}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_32px_rgba(21,114,200,0.24)] transition-all hover:bg-primary/90"
                      >
                        <span className="material-symbols-outlined !text-base">add</span>
                        Add Social Link
                      </button>
                    </div>

                    <div className="space-y-4 p-4 sm:p-5">
                      {content.contact.socials.map((social, index) => (
                        <div key={`${social.platform}-${index}`} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                          <div className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Social Link {index + 1}
                              </p>
                              <h4 className="mt-1 font-headline text-lg font-extrabold text-slate-900">
                                {social.platform || "Untitled platform"}
                              </h4>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                requestDelete(
                                  "Social Link",
                                  () => removeNestedListItem(setContent, "contact", "socials", index),
                                  "This will permanently remove this social media entry from the contact section."
                                )
                              }
                              disabled={content.contact.socials.length === 1}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.12em] text-rose-700 transition-all hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined !text-base">delete</span>
                              Delete Social
                            </button>
                          </div>

                          <div className="space-y-5">
                            <div className="grid gap-4 md:grid-cols-2">
                              <Field
                                label="Platform"
                                value={social.platform}
                                placeholder="LinkedIn"
                                onChange={(event) =>
                                  updateNestedListItem(
                                    setContent,
                                    "contact",
                                    "socials",
                                    index,
                                    "platform",
                                    event.target.value
                                  )
                                }
                              />
                              <Field
                                label="Handle"
                                value={social.handle}
                                placeholder="@environomics-projects-llp"
                                onChange={(event) =>
                                  updateNestedListItem(
                                    setContent,
                                    "contact",
                                    "socials",
                                    index,
                                    "handle",
                                    event.target.value
                                  )
                                }
                              />
                            </div>

                            <Field
                              label="Link URL"
                              value={social.url}
                              placeholder="https://www.linkedin.com/company/environomics-projects-llp/"
                              onChange={(event) =>
                                updateNestedListItem(
                                  setContent,
                                  "contact",
                                  "socials",
                                  index,
                                  "url",
                                  event.target.value
                                )
                              }
                            />

                            <label className="block rounded-[24px] border border-dashed border-slate-300 bg-white p-4 transition-all hover:border-primary/40">
                              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Upload Social Logo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-semibold file:text-primary hover:file:bg-primary/15"
                                onChange={(event) => {
                                  const file = event.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    if (typeof reader.result === "string") {
                                      updateNestedListItem(
                                        setContent,
                                        "contact",
                                        "socials",
                                        index,
                                        "logo",
                                        reader.result
                                      );
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }}
                              />
                              <p className="mt-2 text-xs text-slate-500">
                                {social.logo ? "Logo uploaded for this platform." : "Choose a platform logo from your device."}
                              </p>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "seo" ? (
                <div className="space-y-5">
                  <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Page Metadata
                        </p>
                        <h3 className="mt-2 font-headline text-xl font-extrabold text-slate-900">
                          Meta titles and descriptions
                        </h3>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${
                          isSeoConnected
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {isSeoConnected ? "Backend Connected" : "Login Required"}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 xl:grid-cols-2">
                      {seoPageConfigs.map((page) => (
                        <div
                          key={page.key}
                          className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 sm:p-5"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            {page.label} SEO
                          </p>
                          <div className="mt-4 space-y-4">
                            <Field
                              label={`${page.label} Meta Title`}
                              value={content.seo.pages[page.key]?.title ?? ""}
                              onChange={(event) =>
                                updateSeoPageField(setContent, page.key, "title", event.target.value)
                              }
                              placeholder={page.titlePlaceholder}
                            />
                            <Field
                              label={`${page.label} Meta Description`}
                              value={content.seo.pages[page.key]?.description ?? ""}
                              multiline
                              onChange={(event) =>
                                updateSeoPageField(
                                  setContent,
                                  page.key,
                                  "description",
                                  event.target.value
                                )
                              }
                              placeholder={page.descriptionPlaceholder}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Global Schema Settings
                    </p>
                    <h3 className="mt-2 font-headline text-xl font-extrabold text-slate-900">
                      Organization and website schema
                    </h3>

                    <div className="mt-5 grid gap-5 lg:grid-cols-2">
                      <Field
                        label="Organization Name"
                        value={content.seo.schema.organizationName}
                        onChange={(event) =>
                          updateSeoSchemaField(setContent, "organizationName", event.target.value)
                        }
                        placeholder="Environomics Projects LLP"
                      />
                      <Field
                        label="Website Name"
                        value={content.seo.schema.websiteName}
                        onChange={(event) =>
                          updateSeoSchemaField(setContent, "websiteName", event.target.value)
                        }
                        placeholder="Environomics"
                      />
                      <Field
                        label="Site URL"
                        value={content.seo.schema.siteUrl}
                        onChange={(event) =>
                          updateSeoSchemaField(setContent, "siteUrl", event.target.value)
                        }
                        placeholder="https://environomics.in"
                      />
                      <Field
                        label="Default Image Path"
                        value={content.seo.schema.defaultImage}
                        onChange={(event) =>
                          updateSeoSchemaField(setContent, "defaultImage", event.target.value)
                        }
                        placeholder="/imgs/hero-2560.jpg"
                      />
                      <Field
                        label="SameAs Links"
                        value={content.seo.schema.sameAs.join("\n")}
                        multiline
                        onChange={(event) =>
                          updateSeoSchemaField(
                            setContent,
                            "sameAs",
                            normalizeStringList(event.target.value)
                          )
                        }
                        placeholder={
                          "https://www.linkedin.com/company/environomics-projects-llp/\nhttps://www.instagram.com/your-brand/"
                        }
                      />
                      <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 lg:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Website Logo
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          The structured data logo is now managed from the
                          {" "}
                          <span className="font-semibold text-slate-800">Settings</span>
                          {" "}
                          tab. You can also upload a separate header logo there, while the footer
                          keeps its white logo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "settings" ? (
                <div className="space-y-6">
                    <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Brand Settings
                        </p>
                        <h3 className="mt-2 font-headline text-2xl font-extrabold text-slate-900">
                          Footer year, website logo, and header logo
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          Save Changes will publish the footer year, the website logo used for
                          structured data, and an optional separate logo for the main header. The
                          footer keeps its white logo.
                        </p>
                      </div>
                      <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
                        <Field
                          label="Footer Year"
                          value={content.settings.footerYear}
                          onChange={(event) =>
                            updateField(setContent, "settings", "footerYear", event.target.value)
                          }
                        />

                        <label className="block rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4 transition-all hover:border-primary/40 hover:bg-white">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Upload Website Logo
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-semibold file:text-primary hover:file:bg-primary/15"
                            onChange={(event) => {
                              readImageFileAsDataUrl(event.target.files?.[0], (nextValue) => {
                                updateSettingsCompanyLogo(setContent, nextValue);
                              });
                            }}
                          />
                          <p className="mt-2 text-xs text-slate-500">
                            {content.settings.companyLogo
                              ? "A company logo is ready to publish."
                              : "Choose the logo file from your device. PNG, JPG, SVG, and WEBP all work."}
                          </p>
                        </label>

                        <label className="block rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4 transition-all hover:border-primary/40 hover:bg-white">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Upload Header Logo
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-semibold file:text-primary hover:file:bg-primary/15"
                            onChange={(event) => {
                              readImageFileAsDataUrl(event.target.files?.[0], (nextValue) => {
                                updateSettingsHeaderLogo(setContent, nextValue);
                              });
                            }}
                          />
                          <p className="mt-2 text-xs text-slate-500">
                            {content.settings.headerLogo
                              ? "A separate header logo is ready to publish."
                              : "Leave this empty if the header should reuse the website logo."}
                          </p>
                        </label>

                        <div className="grid gap-5 lg:grid-cols-2">
                          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Website Logo Preview
                            </p>
                            <div className="mt-4 flex min-h-[156px] items-center justify-center rounded-[22px] border border-slate-200 bg-white p-6">
                              <img
                                src={settingsLogoPreview || loginLogo}
                                alt="Website logo preview"
                                className="max-h-20 w-auto object-contain"
                              />
                            </div>
                            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <p className="text-sm leading-7 text-slate-600">
                                This logo is used for structured data and also acts as the fallback
                                for the header when no separate header logo is uploaded.
                              </p>
                              <button
                                type="button"
                                onClick={() => updateSettingsCompanyLogo(setContent, "")}
                                disabled={!content.settings.companyLogo}
                                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-700 transition-all hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-45"
                              >
                                Use Default Logo
                              </button>
                            </div>
                          </div>

                          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Header Logo Preview
                            </p>
                            <div className="mt-4 flex min-h-[156px] items-center justify-center rounded-[22px] border border-slate-200 bg-white p-6">
                              <img
                                src={headerLogoPreview || loginLogo}
                                alt="Header logo preview"
                                className="max-h-20 w-auto object-contain"
                              />
                            </div>
                            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <p className="text-sm leading-7 text-slate-600">
                                This logo only affects the main website header. Clear it to reuse
                                the website logo above. The footer still keeps its fixed white logo.
                              </p>
                              <button
                                type="button"
                                onClick={() => updateSettingsHeaderLogo(setContent, "")}
                                disabled={!content.settings.headerLogo}
                                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-700 transition-all hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-45"
                              >
                                Use Website Logo
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                </div>
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
