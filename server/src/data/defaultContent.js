import { nowIso } from "../utils/id.js";
import {
  defaultClients,
  defaultProjects,
  defaultTestimonials,
} from "./defaultCatalog.js";

function pageSeo(title, description) {
  return { title, description };
}

export function buildDefaultContent() {
  const timestamp = nowIso();

  return {
    meta: {
      version: 1,
      storage: "json-file",
      updatedAt: timestamp
    },
    home: {
      title: "India's Trusted\nTurnkey EPC Partner",
      subtitle: "Solar, HVAC & Industrial Utilities",
      ctaPrimary: "Explore Our Projects",
      ctaSecondary: "Get a Free Feasibility Report"
    },
    projects: defaultProjects,
    clients: defaultClients,
    testimonials: defaultTestimonials,
    leads: [
      {
        id: "lead_rohan_mehta",
        name: "Rohan Mehta",
        company: "Siemens Energy",
        email: "rohan.mehta@siemens-example.com",
        phone: "+91 98765 12001",
        requirement: "1.3 MW rooftop solar feasibility and EPC quote",
        stage: "Qualified",
        createdAt: "2026-03-29T10:15:00+05:30"
      },
      {
        id: "lead_asha_patel",
        name: "Asha Patel",
        company: "Baxter Pharma",
        email: "asha.patel@baxter-example.com",
        phone: "+91 98765 12002",
        requirement: "HVAC and clean room upgrade consultation",
        stage: "Proposal Sent",
        createdAt: "2026-03-30T09:00:00+05:30"
      }
    ],
    contact: {
      phone: "09998112299",
      email: "info@environomics.in",
      address: "417 Ratna High Street, Naranpura, Ahmedabad, 380013, Gujarat, India",
      linkedin: "https://www.linkedin.com/company/environomics-projects-llp/",
      socials: [
        {
          id: "social_linkedin",
          platform: "LinkedIn",
          handle: "@environomics-projects-llp",
          url: "https://www.linkedin.com/company/environomics-projects-llp/",
          logo: ""
        }
      ]
    },
    seo: {
      pages: {
        home: pageSeo("Turnkey Solar, HVAC & Industrial EPC in India", "Environomics Projects LLP delivers turnkey EPC solutions across solar power, HVAC, clean rooms, electrification, automation, and industrial utilities in India."),
        about: pageSeo("About Environomics", "Learn about Environomics Projects LLP, our EPC process, engineering approach, leadership, and experience delivering industrial infrastructure projects across India."),
        services: pageSeo("Solar EPC, HVAC and Industrial Utility Services", "Discover Environomics services spanning solar rooftop, ground mount plants, O&M, pharmaceutical clean rooms, electrification, automation, and energy audits."),
        projects: pageSeo("Industrial EPC Projects Portfolio", "Explore Environomics project work across rooftop solar, ground mount systems, industrial HVAC, and utility infrastructure for leading commercial and industrial clients."),
        clients: pageSeo("Clients and Installation Portfolio", "See the clients who trust Environomics for solar EPC, industrial utilities, HVAC, and long-term infrastructure execution across multiple sectors in India."),
        testimonials: pageSeo("Client Testimonials", "Read client testimonials and proof points from Environomics solar EPC and industrial infrastructure projects delivered for major brands and manufacturers."),
        innovation: pageSeo("Innovation and R&D", "Explore Environomics innovation initiatives, proprietary solar engineering work, R&D programs, and industrial infrastructure technology development."),
        contact: pageSeo("Contact Environomics", "Contact Environomics Projects LLP for solar EPC, industrial HVAC, clean rooms, automation, electrification, and feasibility assessments for your facility.")
      },
      schema: {
        organizationName: "Environomics Projects LLP",
        websiteName: "Environomics",
        siteUrl: "https://environomics.in",
        logo: "/imgs/LOGO (1).png",
        defaultImage: "/imgs/hero-2560.jpg",
        sameAs: ["https://www.linkedin.com/company/environomics-projects-llp/"]
      }
    },
    settings: {
      footerYear: "2026",
      domain: "https://environomics.in",
      companyLogo: "/imgs/LOGO (1).png",
      headerLogo: "/imgs/LOGO (1).png"
    }
  };
}
