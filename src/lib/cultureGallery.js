export const CULTURE_PAGE_PATH = "/culture";

const csrImages = import.meta.glob("../../imgs/CSR/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  import: "default",
});

const tradeShowImages = import.meta.glob("../../imgs/TRADE SHOWS/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  import: "default",
});

const celebrationImages = import.meta.glob("../../imgs/CELEBRATIONS/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  import: "default",
});

const trainingImages = import.meta.glob("../../imgs/TRAINING/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  import: "default",
});

const cultureSectionMetadata = [
  {
    id: "csr",
    title: "CSR",
    icon: "volunteer_activism",
    description:
      "Community initiatives where our team contributes time, resources, and care beyond project sites.",
    modules: csrImages,
  },
  {
    id: "trade-show",
    title: "TRADE SHOW",
    icon: "storefront",
    coverFilename: "WhatsApp Image 2026-04-28 at 1.04.34 PM (2).jpeg",
    description:
      "Industry interactions, client conversations, and technology showcases from our trade show presence.",
    modules: tradeShowImages,
  },
  {
    id: "celebrations",
    title: "CELEBRATIONS",
    icon: "celebration",
    description:
      "Moments that bring the team together, marking milestones, festivals, and shared wins.",
    modules: celebrationImages,
  },
  {
    id: "training",
    title: "TRAINING",
    icon: "school",
    description:
      "Hands-on learning sessions that strengthen safety, execution, and technical discipline.",
    modules: trainingImages,
  },
];

function getAssetFilename(path = "") {
  return path.split("/").pop() ?? "";
}

function getSortedSectionImages(section) {
  return Object.entries(section.modules)
    .map(([path, src], index) => ({
      id: `${section.id}-image-${index + 1}`,
      src,
      filename: getAssetFilename(path),
    }))
    .sort((left, right) => left.filename.localeCompare(right.filename, undefined, { numeric: true }))
    .map((image, index) => ({
      ...image,
      id: `${section.id}-image-${index + 1}`,
      title: `${section.title} Image ${index + 1}`,
      alt: `${section.title} culture image ${index + 1}`,
    }));
}

export const cultureSections = cultureSectionMetadata.map((section) => {
  const images = getSortedSectionImages(section);
  const coverImage =
    images.find((image) => image.filename === section.coverFilename)?.src ?? images[0]?.src ?? "";

  return {
    id: section.id,
    title: section.title,
    icon: section.icon,
    description: section.description,
    coverImage,
    images,
  };
});

export function getCultureSectionById(sectionId = "") {
  return cultureSections.find((section) => section.id === sectionId) ?? null;
}
