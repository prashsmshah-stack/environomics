import { buildDefaultContent } from "../data/defaultContent.js";
import { createHttpError } from "../lib/http.js";
import { ensureStore, readStore, writeStore } from "../lib/jsonStore.js";
import { createEntityId, nowIso } from "../utils/id.js";

const arraySections = {
  projects: "project",
  clients: "client",
  testimonials: "testimonial",
  leads: "lead"
};

const singletonSections = new Set(["home", "contact", "seo", "settings"]);

function isPublishedProject(item = {}) {
  const status = String(item?.status ?? "").trim().toLowerCase();
  return !status || status === "published";
}

function filterPublicProjects(items = []) {
  return items.filter(isPublishedProject);
}

function stamp(content) {
  return {
    ...content,
    meta: {
      ...(content.meta ?? {}),
      version: content.meta?.version ?? 1,
      storage: "json-file",
      updatedAt: nowIso()
    }
  };
}

function assertArraySection(section) {
  if (!Object.hasOwn(arraySections, section)) {
    throw createHttpError(404, `Unknown collection: ${section}`);
  }
}

function assertSingletonSection(section) {
  if (!singletonSections.has(section)) {
    throw createHttpError(404, `Unknown section: ${section}`);
  }
}

function publicContentFrom(content) {
  return {
    home: content.home,
    projects: filterPublicProjects(content.projects ?? []),
    clients: content.clients,
    testimonials: content.testimonials,
    contact: content.contact,
    seo: content.seo,
    settings: content.settings,
    meta: content.meta
  };
}

export async function initialize() {
  await ensureStore();
}

export async function getContent() {
  return readStore();
}

export async function getPublicContent() {
  const content = await readStore();
  return publicContentFrom(content);
}

export async function resetContent() {
  const content = stamp(buildDefaultContent());
  await writeStore(content);
  return content;
}

export async function getSingletonSection(section) {
  assertSingletonSection(section);
  const content = await readStore();
  return content[section];
}

export async function updateSingletonSection(section, payload) {
  assertSingletonSection(section);
  const content = await readStore();
  const nextContent = stamp({
    ...content,
    [section]: {
      ...(content[section] ?? {}),
      ...payload
    }
  });

  await writeStore(nextContent);
  return nextContent[section];
}

export async function listCollection(section) {
  assertArraySection(section);
  const content = await readStore();
  return content[section] ?? [];
}

export async function createCollectionItem(section, payload) {
  assertArraySection(section);
  const content = await readStore();
  const nextItem = {
    id: payload.id ?? createEntityId(arraySections[section]),
    ...payload
  };

  const nextContent = stamp({
    ...content,
    [section]: [...(content[section] ?? []), nextItem]
  });

  await writeStore(nextContent);
  return nextItem;
}

export async function updateCollectionItem(section, id, payload) {
  assertArraySection(section);
  const content = await readStore();
  const currentItems = content[section] ?? [];
  const itemExists = currentItems.some((item) => item.id === id);

  if (!itemExists) {
    throw createHttpError(404, `${section.slice(0, -1)} not found`);
  }

  const nextContent = stamp({
    ...content,
    [section]: currentItems.map((item) => (item.id === id ? { ...item, ...payload, id } : item))
  });

  await writeStore(nextContent);
  return nextContent[section].find((item) => item.id === id);
}

export async function deleteCollectionItem(section, id) {
  assertArraySection(section);
  const content = await readStore();
  const currentItems = content[section] ?? [];

  if (!currentItems.some((item) => item.id === id)) {
    throw createHttpError(404, `${section.slice(0, -1)} not found`);
  }

  const nextContent = stamp({
    ...content,
    [section]: currentItems.filter((item) => item.id !== id)
  });

  await writeStore(nextContent);
  return { success: true };
}

export async function reorderCollection(section, { fromIndex, toIndex, orderedIds }) {
  assertArraySection(section);
  const content = await readStore();
  const items = [...(content[section] ?? [])];

  let reordered = items;

  if (Array.isArray(orderedIds) && orderedIds.length === items.length) {
    const itemsById = new Map(items.map((item) => [item.id, item]));
    reordered = orderedIds.map((id) => itemsById.get(id)).filter(Boolean);
  } else {
    const safeFrom = Number(fromIndex);
    const safeTo = Number(toIndex);

    if (Number.isNaN(safeFrom) || Number.isNaN(safeTo)) {
      throw createHttpError(400, "Provide either orderedIds or valid fromIndex/toIndex values.");
    }

    if (safeFrom < 0 || safeFrom >= items.length) {
      throw createHttpError(400, "fromIndex is out of range.");
    }

    const boundedTo = Math.max(0, Math.min(safeTo, items.length - 1));
    const [moved] = reordered.splice(safeFrom, 1);
    reordered.splice(boundedTo, 0, moved);
  }

  const nextContent = stamp({
    ...content,
    [section]: reordered
  });

  await writeStore(nextContent);
  return reordered;
}

export async function getDashboardSummary() {
  const content = await readStore();
  const leads = content.leads ?? [];
  const stageCounts = leads.reduce((result, lead) => {
    const key = lead.stage ?? "New";
    result[key] = (result[key] ?? 0) + 1;
    return result;
  }, {});

  return {
    totals: {
      projects: (content.projects ?? []).length,
      clients: (content.clients ?? []).length,
      testimonials: (content.testimonials ?? []).length,
      leads: leads.length
    },
    leadStages: stageCounts,
    latestLeads: leads.slice(-5).reverse(),
    updatedAt: content.meta?.updatedAt ?? null
  };
}

export async function createPublicLead(payload) {
  const requiredFields = ["name", "company", "email", "phone", "requirement"];

  for (const field of requiredFields) {
    if (!payload[field] || !String(payload[field]).trim()) {
      throw createHttpError(400, `${field} is required.`);
    }
  }

  const nextLead = {
    id: createEntityId("lead"),
    name: String(payload.name).trim(),
    company: String(payload.company).trim(),
    email: String(payload.email).trim(),
    phone: String(payload.phone).trim(),
    requirement: String(payload.requirement).trim(),
    stage: "New",
    createdAt: nowIso()
  };

  await createCollectionItem("leads", nextLead);
  return nextLead;
}

export async function listSocialLinks() {
  const content = await readStore();
  return content.contact?.socials ?? [];
}

export async function createSocialLink(payload) {
  const content = await readStore();
  const nextSocial = {
    id: payload.id ?? createEntityId("social"),
    platform: payload.platform ?? "",
    handle: payload.handle ?? "",
    url: payload.url ?? "",
    logo: payload.logo ?? ""
  };

  const nextContent = stamp({
    ...content,
    contact: {
      ...(content.contact ?? {}),
      socials: [...(content.contact?.socials ?? []), nextSocial]
    }
  });

  await writeStore(nextContent);
  return nextSocial;
}

export async function updateSocialLink(id, payload) {
  const content = await readStore();
  const socials = content.contact?.socials ?? [];

  if (!socials.some((item) => item.id === id)) {
    throw createHttpError(404, "Social link not found");
  }

  const nextContent = stamp({
    ...content,
    contact: {
      ...(content.contact ?? {}),
      socials: socials.map((item) => (item.id === id ? { ...item, ...payload, id } : item))
    }
  });

  await writeStore(nextContent);
  return nextContent.contact.socials.find((item) => item.id === id);
}

export async function deleteSocialLink(id) {
  const content = await readStore();
  const socials = content.contact?.socials ?? [];

  if (!socials.some((item) => item.id === id)) {
    throw createHttpError(404, "Social link not found");
  }

  const nextContent = stamp({
    ...content,
    contact: {
      ...(content.contact ?? {}),
      socials: socials.filter((item) => item.id !== id)
    }
  });

  await writeStore(nextContent);
  return { success: true };
}

export async function reorderSocialLinks({ fromIndex, toIndex, orderedIds }) {
  const content = await readStore();
  const socials = [...(content.contact?.socials ?? [])];

  let reordered = socials;

  if (Array.isArray(orderedIds) && orderedIds.length === socials.length) {
    const itemsById = new Map(socials.map((item) => [item.id, item]));
    reordered = orderedIds.map((id) => itemsById.get(id)).filter(Boolean);
  } else {
    const safeFrom = Number(fromIndex);
    const safeTo = Number(toIndex);

    if (Number.isNaN(safeFrom) || Number.isNaN(safeTo)) {
      throw createHttpError(400, "Provide either orderedIds or valid fromIndex/toIndex values.");
    }

    if (safeFrom < 0 || safeFrom >= socials.length) {
      throw createHttpError(400, "fromIndex is out of range.");
    }

    const boundedTo = Math.max(0, Math.min(safeTo, socials.length - 1));
    const [moved] = reordered.splice(safeFrom, 1);
    reordered.splice(boundedTo, 0, moved);
  }

  const nextContent = stamp({
    ...content,
    contact: {
      ...(content.contact ?? {}),
      socials: reordered
    }
  });

  await writeStore(nextContent);
  return reordered;
}

export async function getRouteSeo(routeKey) {
  const content = await readStore();
  return content.seo?.pages?.[routeKey] ?? null;
}
