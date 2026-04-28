export const OPERATIONS_MAINTENANCE_GALLERY_PATH = "/om/gallery";

const operationsMaintenanceGalleryMetadata = [
  {
    fileName: "om-gallery-01.jpeg",
    title: "Wet Testing for Safer Modules",
    description: "Detect leakage. Prevent failures.",
  },
  {
    fileName: "om-gallery-02.jpeg",
    title: "Healthy Panels. Higher Output.",
    description: "Prevent hotspots, extend module life.",
  },
  {
    fileName: "om-gallery-03.jpeg",
    title: "Small Connector. Big Risk.",
    description: "Quality and correct installation are non-negotiable in solar safety.",
  },
  {
    fileName: "om-gallery-04.jpeg",
    title: "Inverter Components",
    description: "Prevent faults with proactive maintenance.",
  },
  {
    fileName: "om-gallery-05.jpeg",
    title: "Clean Fans Reliable Performance.",
    description: "Before-and-after inverter fan cleaning for better cooling and life.",
  },
  {
    fileName: "om-gallery-06.jpeg",
    title: "Smart Laying Safer Power.",
    description: "Correct installation prevents heat build-up.",
  },
  {
    fileName: "om-gallery-07.jpeg",
    title: "Spread the Load. Reduce the Heat.",
    description: "Limited MCCB space. Copper spreaders balance current and reduce heat.",
  },
  {
    fileName: "om-gallery-08.jpeg",
    title: "Ageing Impact on Solar Assets",
    description: "Proactive maintenance extends system life and performance.",
  },
  {
    fileName: "om-gallery-09.jpeg",
    title: "Fix the Loose, Stop the Heat.",
    description: "Proper torque improves safety and life.",
  },
  {
    fileName: "om-gallery-10.jpeg",
    title: "Harmonics Testing",
    description: "Monitoring voltage and current distortion for stable system performance.",
  },
  {
    fileName: "om-gallery-11.jpeg",
    title: "AC Cable Faults",
    description: "From exposed and damaged cables to safe, reliable underground installation.",
  },
  {
    fileName: "om-gallery-12.jpeg",
    title: "Healthy Panels. Higher Output.",
    description: "Prevent hotspots, extend module life.",
  },
];

export const operationsMaintenanceGalleryItems = operationsMaintenanceGalleryMetadata.map(
  ({ fileName, title, description }, index) => ({
    src: `/imgs/om/${fileName}`,
    alt: `${title} - Solar O&M image ${index + 1}`,
    title,
    description,
  })
);
