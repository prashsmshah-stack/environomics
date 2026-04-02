const API_PORT = 3000;
const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1"]);

function trimTrailingSlash(value = "") {
  return String(value).replace(/\/+$/, "");
}

function resolveConfiguredBase(configuredValue) {
  const candidate = String(configuredValue ?? "").trim();
  if (!candidate) {
    return "";
  }

  if (typeof window === "undefined") {
    return trimTrailingSlash(candidate);
  }

  try {
    return trimTrailingSlash(new URL(candidate, window.location.origin).href);
  } catch {
    return trimTrailingSlash(candidate);
  }
}

export function getApiBase() {
  const configuredBase = resolveConfiguredBase(import.meta.env.VITE_API_BASE);
  if (configuredBase) {
    return configuredBase;
  }

  if (typeof window === "undefined") {
    return `http://127.0.0.1:${API_PORT}/api`;
  }

  const { origin, protocol, hostname, port } = window.location;
  const effectivePort = port || (protocol === "https:" ? "443" : "80");

  if (effectivePort === String(API_PORT)) {
    return `${trimTrailingSlash(origin)}/api`;
  }

  if (LOCAL_HOSTNAMES.has(hostname)) {
    return `${protocol}//${hostname}:${API_PORT}/api`;
  }

  return `${trimTrailingSlash(origin)}/api`;
}

export function getApiUrl(path = "") {
  const base = `${trimTrailingSlash(getApiBase())}/`;
  const cleanPath = String(path ?? "").replace(/^\/+/, "");

  return cleanPath ? new URL(cleanPath, base).href : trimTrailingSlash(base);
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

  if (/^\/?uploads\//i.test(value)) {
    return new URL(cleanValue, `${trimTrailingSlash(getApiBase())}/`).href;
  }

  return new URL(cleanValue, `${window.location.origin}/`).href;
}
