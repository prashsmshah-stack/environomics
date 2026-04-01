import { buildDefaultContent } from "../data/defaultContent.js";
import { closeMysqlPool } from "../lib/mysql.js";
import { initializeContentStorage } from "../services/contentService.js";
import {
  createCollectionItem,
  getContent,
  updateCollectionItem,
} from "../services/contentService.js";

const collectionFields = {
  projects: ["name", "capacity", "description", "status", "direction", "image", "companyLogo"],
  clients: ["name", "category", "year", "capacity", "companyLogo"],
  testimonials: [
    "title",
    "tag",
    "subtitle",
    "capacity",
    "installed",
    "description",
    "image",
  ],
};

function normalizeComparableValue(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

function hasSupportedChanges(existingItem, defaultItem, fields) {
  return fields.some((field) => {
    return (
      normalizeComparableValue(existingItem?.[field]) !==
      normalizeComparableValue(defaultItem?.[field])
    );
  });
}

async function syncCollection(section, defaultItems, currentItems) {
  const fields = collectionFields[section];
  const currentById = new Map((currentItems ?? []).map((item) => [item.id, item]));

  let created = 0;
  let updated = 0;
  let unchanged = 0;

  for (const item of defaultItems) {
    const existing = currentById.get(item.id);

    if (!existing) {
      await createCollectionItem(section, item);
      created += 1;
      continue;
    }

    if (hasSupportedChanges(existing, item, fields)) {
      await updateCollectionItem(section, item.id, item);
      updated += 1;
      continue;
    }

    unchanged += 1;
  }

  return { created, updated, unchanged };
}

async function main() {
  try {
    await initializeContentStorage();

    const defaults = buildDefaultContent();
    const current = await getContent();

    const sections = ["projects", "clients", "testimonials"];
    const results = {};

    for (const section of sections) {
      results[section] = await syncCollection(section, defaults[section], current[section]);
    }

    const refreshed = await getContent();

    for (const section of sections) {
      const counts = {
        defaults: defaults[section].length,
        database: refreshed[section].length,
      };

      console.log(
        `${section}: created=${results[section].created}, updated=${results[section].updated}, unchanged=${results[section].unchanged}, defaults=${counts.defaults}, database=${counts.database}`
      );
    }
  } finally {
    await closeMysqlPool();
  }
}

main().catch((error) => {
  console.error("Failed to sync default content:", error);
  process.exit(1);
});
