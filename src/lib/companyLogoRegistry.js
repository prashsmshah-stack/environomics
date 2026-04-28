import amolMinechemLogo from "../../imgs/amol logo.jpg";
import baxterPharmaLogo from "../../imgs/baxter logo.png";
import bharatBeamsLogo from "../../imgs/bharat beams logo.png";
import buschVacuumLogo from "../../imgs/busch logo.png";
import colgatePalmoliveLogo from "../../imgs/colgate palmolive logo.png";
import dangeeDumsLogo from "../../imgs/Dangee Dums logo.jpeg";
import delhiUniversityLogo from "../../imgs/delhi university logo.png";
import dpsBopalLogo from "../../imgs/DPS School logo.png";
import fujiSilvertechLogo from "../../imgs/fuji logo.png";
import jmcPaperLogo from "../../imgs/JMC Papertech logo.png";
import shreeBhagwatLogo from "../../imgs/Shree Bhagwat Vidyapith Trust Logo.jpeg";
import somanyEvergreenLogo from "../../imgs/somany evergreen logo.png";
import pioneerMagnesiaWorksLogo from "../../imgs/The Pioneer Magnesia Works logo.jpeg";

function normalizeCompanyName(value = "") {
  return String(value ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const companyLogoEntries = [
  ["amol minechem", amolMinechemLogo],
  ["amol minechem ltd", amolMinechemLogo],
  ["amol minechem limited", amolMinechemLogo],
  ["baxter pharma", baxterPharmaLogo],
  ["baxter pharmaceutical", baxterPharmaLogo],
  ["baxter pharmaceuticals", baxterPharmaLogo],
  ["bharat beams", bharatBeamsLogo],
  ["bharat beams pvt ltd", bharatBeamsLogo],
  ["bharat beams private limited", bharatBeamsLogo],
  ["busch vacuum", buschVacuumLogo],
  ["busch vacuum india pvt ltd", buschVacuumLogo],
  ["busch vacuum india private limited", buschVacuumLogo],
  ["colgate palmolive", colgatePalmoliveLogo],
  ["colgate palmolive india ltd", colgatePalmoliveLogo],
  ["colgate palmolive india limited", colgatePalmoliveLogo],
  ["dangee dums", dangeeDumsLogo],
  ["delhi university", delhiUniversityLogo],
  ["dps bopal", dpsBopalLogo],
  ["dps school", dpsBopalLogo],
  ["delhi public school bopal", dpsBopalLogo],
  ["fuji silvertech", fujiSilvertechLogo],
  ["fuji silver tech", fujiSilvertechLogo],
  ["jmc paper", jmcPaperLogo],
  ["jmc papertech", jmcPaperLogo],
  ["jmc papertech private limited", jmcPaperLogo],
  ["shree bhagwat vidyapith trust", shreeBhagwatLogo],
  ["somany evergreen", somanyEvergreenLogo],
  ["somany evergreen knits ltd", somanyEvergreenLogo],
  ["somany evergreen knits limited", somanyEvergreenLogo],
  ["the pioneer magnesia works", pioneerMagnesiaWorksLogo],
];

const companyLogoRegistry = new Map(
  companyLogoEntries.map(([name, src]) => [normalizeCompanyName(name), src])
);

export function getLocalCompanyLogo(name, fallbackSrc = "") {
  return companyLogoRegistry.get(normalizeCompanyName(name)) || fallbackSrc || "";
}

export function hasLocalCompanyLogo(name) {
  return companyLogoRegistry.has(normalizeCompanyName(name));
}
