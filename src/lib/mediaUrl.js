export function getPayloadApiBase() {
  const configuredUrl =
    import.meta.env.VITE_PAYLOAD_API_URL || import.meta.env.VITE_PUBLIC_CONTENT_API_URL || "";

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:3001/api`;
  }

  return "http://localhost:3001/api";
}

export function getPayloadOrigin() {
  return getPayloadApiBase().replace(/\/api\/?$/, "");
}

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
  const isPayloadMediaUrl = /^\/(?:api\/media\/file|media)\//i.test(cleanValue);
  const origin = isPayloadMediaUrl ? getPayloadOrigin() : window.location.origin;

  return new URL(cleanValue, `${origin}/`).href;
}
