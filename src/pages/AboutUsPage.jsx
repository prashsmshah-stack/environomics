import { useEffect } from "react";
import aboutEnvironomicsImage from "../../imgs/700x560.jpg.jpeg";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

const processSteps = [
  {
    number: "01",
    title: "Engineering & Design",
    description:
      "Our Ahmedabad engineering team translates client requirements into code-compliant, accurately sized facility systems. Using PVsyst, ETAP, and AutoCAD MEP, we model full load profiles.",
    delay: "0ms",
  },
  {
    number: "02",
    title: "Procurement & QA",
    description:
      "Our procurement team has built a vetted network of Tier-1 solar module manufacturers, inverter specialists, HVAC OEMs, and electrical integrators.",
    delay: "100ms",
  },
  {
    number: "03",
    title: "Construction & Commissioning",
    description:
      "Site execution teams are IS/IEC safety-compliant. Commissioning covers string-level IV curve testing, insulation resistance, and grid sync.",
    delay: "200ms",
  },
  {
    number: "04",
    title: "After-Sales O&M",
    description:
      "We stay involved after commissioning. Environomics offers structured O&M contracts covering preventive maintenance and remote monitoring.",
    delay: "300ms",
  },
];

const clientLogos = [
  "Honda India",
  "Siemens Energy",
  "Colgate-Palmolive",
  "Baxter Pharmaceutical",
  "Welspun Group",
  "Otsuka Pharmaceuticals",
  "Jindal Group",
];

const domainExpertise = [
  "Solar Rooftop Systems, Commercial & Industrial (30 kWp to 5 MWp)",
  "Ground Mount Solar Power Plants, Captive, IPP & Group Captive",
  "Solar Operations & Maintenance, Any installed asset, any EPC",
  "HVAC Systems & Pharmaceutical Clean Rooms, ISO 14644 / GMP Grade A to D",
  "Compressed Air Systems, Design, optimisation & automation",
  "Electrification, HT/LT substation, cabling, power factor correction",
  "Industrial Automation, PLC & SCADA systems",
  "Energy Audits, BEE certified auditors",
];

const sectorsServed = [
  { icon: "vaccines", label: "Pharmaceuticals & API Manufacturing" },
  { icon: "checkroom", label: "Textiles & Apparel" },
  { icon: "directions_car", label: "Automotive & Auto-Ancillary" },
  { icon: "restaurant", label: "Food & Beverage Processing" },
  { icon: "science", label: "Chemicals & Petrochemicals" },
  { icon: "layers", label: "Glass & Advanced Materials" },
  { icon: "precision_manufacturing", label: "Engineering & Capital Goods" },
  { icon: "school", label: "Educational Institutions & Residential" },
];

const leaders = [
  {
    name: "Parag Shah",
    role: "Managing Partner",
    description:
      "GU graduate in Business, Mechanical & Electrical Engineering. 30+ years of senior leadership in sales, service, project management, and marketing, including 20 years with a US headquartered multinational. Parag has experience across Solar, HVAC, Utilities, and Electrical EPC projects totalling over Rs. 5,000 crores in client investment through his 30+ year career. His experience across both commercial and technical sides of the business is what keeps Environomics on budget and on schedule.",
    image:
      "./imgs/paragshah.jpeg",
  },
  {
    name: "Sampath Kumar",
    role: "Head of Engineering",
    description:
      "M.Tech from BITS Pilani and Senior Scientist at SPRERI. 15+ years of hands-on engineering experience, grounded in academic research and field execution. Sampath leads every technical aspect of Environomics' solar EPC projects - from system design and structural analysis to grid integration and quality assurance. It is his engineering discipline that turns client investment into bankable, reliable energy assets.",
    image:
      "./imgs/founder2.jpeg",
  },
];

function MaterialIcon({ name, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`.trim()}>{name}</span>;
}

function fallbackImage(label, variant = "photo") {
  const safeLabel = label.replace(/&/g, "&amp;");

  if (variant === "logo") {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 160">
        <rect width="480" height="160" rx="24" fill="#ffffff"/>
        <rect x="8" y="8" width="464" height="144" rx="18" fill="#0f1c2c"/>
        <text x="34" y="72" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="3">ENVIRONOMICS</text>
        <text x="34" y="112" fill="#93c5fd" font-family="Arial, sans-serif" font-size="14">Engineering. Procurement. Construction.</text>
      </svg>
    `)}`;
  }

  if (variant === "portrait") {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0f1c2c"/>
            <stop offset="100%" stop-color="#1572C8"/>
          </linearGradient>
        </defs>
        <rect width="800" height="1000" fill="url(#bg)"/>
        <circle cx="400" cy="320" r="120" fill="#dbeafe" opacity="0.85"/>
        <path d="M200 860c36-174 148-256 200-256s164 82 200 256" fill="#dbeafe" opacity="0.85"/>
        <text x="60" y="940" fill="#ffffff" font-family="Arial, sans-serif" font-size="42" font-weight="700">${safeLabel}</text>
      </svg>
    `)}`;
  }

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f1c2c"/>
          <stop offset="100%" stop-color="#1572C8"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)"/>
      <g opacity="0.16" stroke="#dbeafe" stroke-width="2" fill="none">
        <path d="M90 620 L320 380 L470 500 L720 210 L1110 470"/>
        <path d="M120 690 L350 450 L520 560 L780 270 L1140 540"/>
      </g>
      <text x="80" y="120" fill="#ffffff" font-family="Arial, sans-serif" font-size="38" font-weight="700" letter-spacing="4">ENVIRONOMICS</text>
      <text x="80" y="720" fill="#ffffff" font-family="Arial, sans-serif" font-size="54" font-weight="700">${safeLabel}</text>
    </svg>
  `)}`;
}

function handleImageError(event, label, variant = "photo") {
  const fallback = fallbackImage(label, variant);
  if (event.currentTarget.src !== fallback) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallback;
  }
}

export default function AboutUsPage() {
  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll(".reveal"));
    if (!revealElements.length) {
      return undefined;
    }

    const reveal = () => {
      revealElements.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 150) {
          element.classList.add("active");
        }
      });
    };

    reveal();
    window.addEventListener("scroll", reveal);
    return () => window.removeEventListener("scroll", reveal);
  }, []);

  return (
    <div className="scroll-smooth bg-white font-body text-on-surface selection:bg-solar-blue/20">
      <SiteHeader />

      <header className="hero-solar-gradient pt-20">
        <section className="bg-transparent px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="animate-fade-in-up mx-auto max-w-screen-xl text-center">
            <h1 className="optika-bold mb-6 text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">About Us</h1>
            <p className="helixa-regular mx-auto max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl md:text-2xl">
              Engineering Integrity. Proven Execution. Lasting Partnerships.
            </p>
          </div>
        </section>
      </header>

      <div className="page-gradient-wrapper">
        <main>
          <section className="reveal px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <div className="space-y-8">
                <h2 className="optika-bold text-3xl text-deep-navy sm:text-4xl">Company Overview</h2>
                <div className="helixa-regular space-y-6 leading-relaxed text-on-surface-variant">
                  <p className="precise-para-1">
                    <span className="helixa-bold text-deep-navy">Environomics</span> Projects LLP
                    is a specialist EPC (Engineering, Procurement & Construction) company
                    headquartered in Ahmedabad, Gujarat. For over a decade, we have built our
                    reputation on one thing: doing the engineering work properly. Technical depth,
                    delivery discipline, and client relationships that last well beyond handover.
                  </p>
                  <p className="precise-para-2">
                    We operate across the full utility lifecycle: from the first site feasibility
                    study and load-profile modelling through to system commissioning, performance
                    certification, and multi-year operations & maintenance contracts. Our clients
                    span textiles, pharmaceuticals, food & beverage, chemicals, automotive, glass,
                    engineering, and oil & gas, sectors where uptime is non-negotiable and
                    performance has to be proven on the meter, not just stated in a proposal.
                  </p>
                  <p className="precise-para-3">
                    Unlike project brokers or coordination contractors,
                    <span className="helixa-bold text-deep-navy"> Environomics</span> keeps
                    engineering design, procurement, site execution, and O&M in house, so there is
                    one team responsible for the whole project, from the first drawing to the
                    plant&apos;s final year of operation.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[5/4] overflow-hidden rounded-3xl bg-white shadow-2xl">
                  <img
                    src={aboutEnvironomicsImage}
                    alt="Environomics company overview project visual"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-transparent px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="reveal mb-12 text-center">
                <h2 className="optika-bold mb-4 text-3xl text-deep-navy sm:text-4xl">The Environomics EPC Process</h2>
                <div className="mx-auto h-1.5 w-24 rounded-full bg-solar-blue" />
              </div>

              <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4">
                {processSteps.map((step) => (
                  <div
                    key={step.number}
                    className="process-card reveal glass-lift flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 sm:p-8"
                    style={{ transitionDelay: step.delay }}
                  >
                    <div className="mb-6 flex items-center gap-4">
                      <div className="optika-bold flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-solar-blue text-lg text-white">
                        {step.number}
                      </div>
                      <h3 className="optika-bold text-lg text-deep-navy">{step.title}</h3>
                    </div>
                    <p className="helixa-regular flex-grow text-sm leading-relaxed text-on-surface-variant">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-12 overflow-hidden bg-gradient-to-br from-growth-green to-[#238c59] py-16 sm:py-20 lg:py-24">
            <div className="mx-auto mb-10 max-w-7xl px-4 sm:px-6 lg:px-8">
              <h3 className="optika-bold text-center text-sm uppercase tracking-widest text-white/70">
                Trusted by Industry Leaders
              </h3>
            </div>
            <div className="marquee-container relative flex overflow-hidden">
              <div className="flex animate-marquee items-center whitespace-nowrap py-4">
                {[...clientLogos, ...clientLogos].map((client, index) => (
                  <span
                    key={`${client}-${index}`}
                    className="optika-bold mx-10 cursor-default text-2xl text-white transition-colors hover:text-white sm:mx-12 sm:text-3xl md:mx-16 md:text-4xl"
                    style={{ textShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
                  >
                    {client}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      <div className="reverse-page-gradient-wrapper">
        <section className="bg-transparent px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            <div
              className="reveal animate-slide-left animate-staggered-fade glass-lift glass-lift-enhanced hover-glow-green rounded-3xl border border-slate-100 bg-cloud-gray p-6 shadow-sm sm:p-8"
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="optika-bold mb-8 flex items-center gap-4 text-2xl text-deep-navy sm:text-3xl">
                <span className="h-8 w-2 rounded-full bg-growth-green" />
                Domain Expertise
              </h2>
              <ul className="helixa-regular space-y-4 text-sm text-on-surface-variant">
                {domainExpertise.map((item) => (
                  <li
                    key={item}
                    className="list-item-hover flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-white"
                  >
                    <MaterialIcon
                      name="check_circle"
                      className="mt-0.5 !text-[18px] text-growth-green"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="reveal animate-slide-right animate-staggered-fade glass-lift glass-lift-enhanced hover-glow-green rounded-3xl border border-slate-100 bg-cloud-gray p-6 shadow-sm sm:p-8"
              style={{ animationDelay: "0.4s" }}
            >
              <h2 className="optika-bold mb-8 flex items-center gap-4 text-2xl text-deep-navy sm:text-3xl">
                <span className="h-8 w-2 rounded-full bg-growth-green" />
                Sectors Served
              </h2>
              <ul className="helixa-regular space-y-4 text-sm text-on-surface-variant">
                {sectorsServed.map((sector) => (
                  <li
                    key={sector.label}
                    className="list-item-hover flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-white"
                  >
                    <MaterialIcon name={sector.icon} className="!text-[18px] text-growth-green" />
                    {sector.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div className="leadership-green-gradient-wrapper">
        <section className="relative overflow-hidden bg-transparent px-4 pb-20 pt-8 sm:px-6 sm:pb-24 lg:px-8 lg:pb-32">
          <div className="glow-element left-[-5%] top-[-10%] h-[500px] w-[500px] rounded-full bg-solar-blue/20" />
          <div className="glow-element bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-growth-green/20" />
          <div className="glow-element right-[10%] top-[20%] h-[300px] w-[300px] rounded-full bg-solar-blue/10" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="reveal mb-12 text-center sm:mb-16">
              <h2 className="optika-bold mb-6 text-3xl text-deep-navy sm:text-4xl lg:text-5xl">Leadership</h2>
              <div className="mx-auto h-1.5 w-24 rounded-full bg-solar-blue" />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
              {leaders.map((leader, index) => (
                <article
                  key={leader.name}
                  className="leader-card-premium group reveal relative isolate overflow-hidden rounded-[2rem] border border-[#d9e8f7] bg-white shadow-[0_24px_60px_rgba(0,89,162,0.10)]"
                  style={index === 1 ? { transitionDelay: "200ms" } : undefined}
                >
                  <div
                    aria-hidden="true"
                    className="absolute right-6 top-6 flex items-center gap-2"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-solar-blue/35" />
                    <span className="h-2.5 w-2.5 rounded-full bg-growth-green/55" />
                    <span className="h-2.5 w-2.5 rounded-full bg-solar-blue/18" />
                  </div>

                  <div className="relative m-3 rounded-[1.6rem] border border-[#eef4fb] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 sm:p-8">
                    <div className="relative z-10 flex items-center gap-4 pr-16">
                      <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-full border-[7px] border-solar-blue/12 bg-slate-100 shadow-[0_20px_36px_rgba(0,89,162,0.14)] sm:h-40 sm:w-40">
                        <img
                          src={leader.image}
                          alt={leader.name}
                          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          onError={(event) => handleImageError(event, leader.name, "portrait")}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="optika-bold text-2xl leading-tight text-deep-navy sm:text-[2rem]">
                          {leader.name}
                        </h3>
                        <p className="helixa-regular mt-1 text-base text-slate-500 sm:text-lg">
                          {leader.role}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 h-px bg-[linear-gradient(90deg,#0059a2_0%,rgba(0,89,162,0.16)_100%)]" />

                    <div className="relative z-10 mt-7">
                      <p className="helixa-regular text-[15px] leading-8 text-on-surface-variant sm:text-[16px]">
                        {leader.description}
                      </p>
                    </div>

                    <div className="mt-7 h-px bg-[linear-gradient(90deg,#0059a2_0%,rgba(0,89,162,0.16)_100%)]" />

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <span className="helixa-bold text-[11px] uppercase tracking-[0.28em] text-solar-blue">
                        Leadership
                      </span>
                      <span className="helixa-bold text-[11px] uppercase tracking-[0.28em] text-growth-green">
                        Environomics
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
