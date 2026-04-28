export function resolveMediaUrl(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  if (/^(?:[a-z]+:)?\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  if (typeof window === "undefined") {
    return value;
  }

  const cleanValue = value.startsWith("/") ? value : `/${value}`;

  return new URL(cleanValue, `${window.location.origin}/`).href;
}
