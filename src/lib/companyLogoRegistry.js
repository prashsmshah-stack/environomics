import akashFashionLogo from "../../imgs/akash-fashion-logo-file_3d02fd9f2d7e.png";
import amolMinechemLogo from "../../imgs/amol logo.jpg";
import aqseptenceLogo from "../../imgs/aqseptence-logo-file_509cbaf36a71.png";
import balkrishnaLogo from "../../imgs/balkrishna-logo-file_4abd20bdea8c.png";
import baxterPharmaLogo from "../../imgs/baxter-pharma.png";
import bharatBeamsLogo from "../../imgs/bharat-beams-logo-file_bd0d1c734d32.png";
import buschVacuumLogo from "../../imgs/busch-vacuum.png";
import colgatePalmoliveLogo from "../../imgs/colgate-palmolive.png";
import ctmTechnicalTextilesLogo from "../../imgs/ctm-technical-textiles-logo-file_f6c0469883d1.png";
import dangeeDumsLogo from "../../imgs/Dangee Dums logo.jpeg";
import delhiUniversityLogo from "../../imgs/delhi-university-logo-file_7c6be9bd037e.png";
import dpsBopalLogo from "../../imgs/dps-bopal-logo-file_0a08270638a7.png";
import fujiSilvertechLogo from "../../imgs/fuji-silvertech.png";
import grgCotspinLogo from "../../imgs/grg-cotspin-logo-file_043e1bdf2bc6.png";
import hondaIndiaLogo from "../../imgs/honda logo.jpeg";
import hysLifecareLogo from "../../imgs/hys-lifecare-logo-file_25823f7f8690.jpg";
import jindalLogo from "../../imgs/jindal-logo-file_bcdd5088a36a.png";
import jmcPaperLogo from "../../imgs/jmc-paper-logo-file_9a5baf8a06b3.png";
import monginisFoodsLogo from "../../imgs/monginis-foods-logo-file_40d1304548f9.png";
import otsukaPharmaceuticalsLogo from "../../imgs/otsuka-pharmaceuticals-logo-file_354705f3c73c.png";
import raghuvirEximLogo from "../../imgs/raghuvir-exim-logo-file_8d24d8396597.png";
import ravirajFoilsLogo from "../../imgs/raviraj-foils-logo.png";
import rohanDyesLogo from "../../imgs/rohan-dyes-rdl-logo-file_47fd7fb33496.png";
import rslDyeChemicalLogo from "../../imgs/rsl-dye-chemical-logo-file_78afe19a0b85.png";
import screenotexLogo from "../../imgs/screenotex-logo-file_24f693b9a209.png";
import shreeBhagwatLogo from "../../imgs/Shree Bhagwat Vidyapith Trust Logo.jpeg";
import siemensEnergyLogo from "../../imgs/siemens-energy-logo-file_168dd66dfbe0.png";
import somanyEvergreenLogo from "../../imgs/somany-evergreen-logo-file_6b618d4ad7ec.png";
import swissLogo from "../../imgs/swiss-logo-file_8766853106b7.png";
import pioneerMagnesiaWorksLogo from "../../imgs/The Pioneer Magnesia Works logo.jpeg";
import welspunGroupLogo from "../../imgs/welspun logo.jpeg";
import westernShellcastLogo from "../../imgs/2024_western_pal_shellcast.png";
import wideangleLogo from "../../imgs/wideangle-logo-file_030cc7809828.png";

function normalizeCompanyName(value = "") {
  return String(value ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const companyLogoAliases = [
  {
    src: akashFashionLogo,
    names: ["akash fashion"],
  },
  {
    src: amolMinechemLogo,
    names: ["amol minechem", "amol minechem ltd", "amol minechem limited"],
  },
  {
    src: aqseptenceLogo,
    names: ["aqseptence", "loyal equipments ltd"],
  },
  {
    src: balkrishnaLogo,
    names: ["balkrishna", "balkrishna industries", "balkrishna industries ltd"],
  },
  {
    src: baxterPharmaLogo,
    names: [
      "baxter pharma",
      "baxter pharmaceutical",
      "baxter pharmaceuticals",
      "baxter pharmaceuticals india private ltd",
      "baxter pharmaceuticals india private limited",
    ],
  },
  {
    src: bharatBeamsLogo,
    names: ["bharat beams", "bharat beams pvt ltd", "bharat beams private limited"],
  },
  {
    src: buschVacuumLogo,
    names: ["busch vacuum", "busch vacuum india pvt ltd", "busch vacuum india private limited"],
  },
  {
    src: colgatePalmoliveLogo,
    names: ["colgate palmolive", "colgate palmolive india ltd", "colgate palmolive india limited"],
  },
  {
    src: ctmTechnicalTextilesLogo,
    names: ["ctm technical textiles", "ctm technical textiles ltd", "ctm technical textiles limited"],
  },
  {
    src: dangeeDumsLogo,
    names: ["dangee dums"],
  },
  {
    src: delhiUniversityLogo,
    names: ["delhi university", "university of delhi"],
  },
  {
    src: dpsBopalLogo,
    names: ["dps bopal", "dps school", "delhi public school bopal"],
  },
  {
    src: fujiSilvertechLogo,
    names: ["fuji silvertech", "fuji silver tech"],
  },
  {
    src: grgCotspinLogo,
    names: ["grg cotspin"],
  },
  {
    src: hondaIndiaLogo,
    names: [
      "honda india",
      "honda motorcycle and scooter india pvt ltd",
      "honda motorcycle and scooter india private limited",
      "honda motorcycles and scooters",
    ],
  },
  {
    src: hysLifecareLogo,
    names: ["hys lifecare", "hys lifecare pvt ltd", "hys lifecare private limited"],
  },
  {
    src: jindalLogo,
    names: ["jindal"],
  },
  {
    src: jmcPaperLogo,
    names: ["jmc paper", "jmc papertech", "jmc papertech private limited"],
  },
  {
    src: monginisFoodsLogo,
    names: ["monginis foods", "monginis"],
  },
  {
    src: otsukaPharmaceuticalsLogo,
    names: [
      "otsuka pharmaceuticals",
      "otsuka pharmaceutical india pvt ltd",
      "otsuka pharmaceutical india private limited",
    ],
  },
  {
    src: pioneerMagnesiaWorksLogo,
    names: ["the pioneer magnesia works", "pioneer magnesia works"],
  },
  {
    src: raghuvirEximLogo,
    names: ["raghuvir exim"],
  },
  {
    src: ravirajFoilsLogo,
    names: ["raviraj foils", "raviraj foils ltd", "raviraj foils limited"],
  },
  {
    src: rohanDyesLogo,
    names: ["rohan dyes", "rohan dyes rdl", "rohan dyes rdil"],
  },
  {
    src: rslDyeChemicalLogo,
    names: ["rsl dye and chemical", "rsl dye chemical"],
  },
  {
    src: screenotexLogo,
    names: ["screenotex"],
  },
  {
    src: shreeBhagwatLogo,
    names: ["shree bhagwat vidyapith trust"],
  },
  {
    src: siemensEnergyLogo,
    names: ["siemens energy"],
  },
  {
    src: somanyEvergreenLogo,
    names: ["somany evergreen", "somany evergreen knits ltd", "somany evergreen knits limited"],
  },
  {
    src: swissLogo,
    names: ["swiss", "swiss pharma", "swiss pharma pvt ltd", "swiss pharma private limited"],
  },
  {
    src: welspunGroupLogo,
    names: ["welspun group", "welspun"],
  },
  {
    src: westernShellcastLogo,
    names: ["western shellcast", "western pal shellcast"],
  },
  {
    src: wideangleLogo,
    names: ["wideangle", "wide angle"],
  },
];

const companyLogoEntries = companyLogoAliases.flatMap(({ src, names }) =>
  names.map((name) => [name, src])
);

const companyLogoRegistry = new Map(
  companyLogoEntries.map(([name, src]) => [normalizeCompanyName(name), src])
);

export function getLocalCompanyLogo(name, fallbackSrc = "") {
  return companyLogoRegistry.get(normalizeCompanyName(name)) || fallbackSrc || "";
}

export function hasLocalCompanyLogo(name) {
  return companyLogoRegistry.has(normalizeCompanyName(name));
}
