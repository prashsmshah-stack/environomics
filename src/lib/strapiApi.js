const DEFAULT_STRAPI_URL = "http://localhost:1337";

export function getStrapiUrl() {
  return String(import.meta.env.VITE_STRAPI_URL || DEFAULT_STRAPI_URL).replace(/\/+$/, "");
}

export function resolveStrapiMediaUrl(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  if (/^(?:[a-z]+:)?\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  const cleanValue = value.startsWith("/") ? value : `/${value}`;
  return `${getStrapiUrl()}${cleanValue}`;
}

export async function fetchStrapiJson(path, options = {}) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const { headers, method: optionMethod, ...fetchOptions } = options;
  const method = String(optionMethod || "GET").toUpperCase();
  const url = new URL(`${getStrapiUrl()}${cleanPath}`);

  if (method === "GET") {
    url.searchParams.set("_ts", String(Date.now()));
  }

  const response = await fetch(url.toString(), {
    ...fetchOptions,
    method,
    cache: method === "GET" ? "no-store" : options.cache,
    headers: {
      Accept: "application/json",
      ...(headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed with status ${response.status}`);
  }

  return response.json();
}
