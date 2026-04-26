export const OPERATIONS_MAINTENANCE_GALLERY_PATH = "/om/gallery";

function buildOperationsMaintenanceGalleryItem(index) {
  const itemNumber = index + 1;
  const paddedItemNumber = String(itemNumber).padStart(2, "0");

  return {
    src: `/imgs/om/om-gallery-${paddedItemNumber}.jpeg`,
    alt: `Solar O&M site image ${itemNumber}`,
    title: `Solar O&M Site Image ${itemNumber}`,
    description:
      "Full image view with dedicated space below for the plant name, maintenance note, project update, or any supporting text you want to show here.",
  };
}

export const operationsMaintenanceGalleryItems = Array.from({ length: 12 }, (_, index) =>
  buildOperationsMaintenanceGalleryItem(index)
);
