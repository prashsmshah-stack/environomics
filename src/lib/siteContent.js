export const CONTACT_PHONE = "7981758883";
export const CONTACT_EMAILS = [
  "sampath.kumar@epl.net.in",
  "engineering@epl.net.in",
];
export const CONTACT_EMAILS_DISPLAY = CONTACT_EMAILS.join(", ");
export const CATALOGUE_PDF_PATH = "/Environomics_EPC_Catalogue_2025.pdf";
export const DEFAULT_SECONDARY_CTA = "Download Our Catalogue";

const LEGACY_CONTACT_EMAILS = new Set(["info@environomics.in"]);
const LEGACY_CONTACT_PHONE_DIGITS = "09998112299";
const EMAIL_SPLIT_PATTERN = /[\n;,]+/;

function uniqueItems(values) {
  const seen = new Set();
  const items = [];

  for (const value of values) {
    const normalized = String(value ?? "").trim();
    if (!normalized) {
      continue;
    }

    const lookupKey = normalized.toLowerCase();
    if (seen.has(lookupKey)) {
      continue;
    }

    seen.add(lookupKey);
    items.push(normalized);
  }

  return items;
}

export function normalizeContactPhone(value, fallback = CONTACT_PHONE) {
  const trimmed = String(value ?? "").trim();
  const digits = trimmed.replace(/\D+/g, "");

  if (!trimmed || digits === LEGACY_CONTACT_PHONE_DIGITS) {
    return fallback;
  }

  return trimmed;
}

export function parseContactEmails(value, fallback = CONTACT_EMAILS) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    return [...fallback];
  }

  const tokens = trimmed.split(EMAIL_SPLIT_PATTERN).map((item) => item.trim());
  const expanded = [];

  for (const token of tokens.length ? tokens : [trimmed]) {
    if (!token) {
      continue;
    }

    if (LEGACY_CONTACT_EMAILS.has(token.toLowerCase())) {
      expanded.push(...fallback);
      continue;
    }

    expanded.push(token);
  }

  const deduped = uniqueItems(expanded);
  return deduped.length ? deduped : [...fallback];
}

export function formatContactEmails(value, fallback = CONTACT_EMAILS) {
  return parseContactEmails(value, fallback).join(", ");
}

export function getPrimaryContactEmail(value, fallback = CONTACT_EMAILS) {
  return parseContactEmails(value, fallback)[0] ?? fallback[0] ?? "";
}

export function normalizeSecondaryCta(value, fallback = DEFAULT_SECONDARY_CTA) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed || /^get a free feasibility report$/i.test(trimmed)) {
    return fallback;
  }

  return trimmed;
}
