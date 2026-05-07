import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchStrapiJson } from "../lib/strapiApi";

const PublicContentContext = createContext({
  content: null,
  status: "loading",
  error: "",
  refresh: async () => {},
});

export function PublicContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setStatus((current) => (current === "success" ? current : "loading"));
    setError("");

    const endpoints = [
      ["homePage", "/api/public/home-page"],
      ["footer", "/api/public/footer"],
      ["contactPage", "/api/public/contact-page"],
      ["clients", "/api/public/clients"],
      ["testimonials", "/api/public/testimonials"],
      ["projects", "/api/public/projects"],
    ];

    const results = await Promise.allSettled(
      endpoints.map(async ([key, path]) => {
        const payload = await fetchStrapiJson(path);
        return [key, payload?.data ?? null];
      })
    );

    const nextContent = {};
    const errors = [];

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        const [key, data] = result.value;
        nextContent[key] = data;
        return;
      }

      errors.push(result.reason instanceof Error ? result.reason.message : "Content request failed.");
    });

    setContent((current) => ({
      ...(current || {}),
      ...nextContent,
      settings: {
        ...(current?.settings || {}),
        headerLogo: current?.settings?.headerLogo || "",
        companyLogo: current?.settings?.companyLogo || "",
      },
      seo: current?.seo || {},
    }));
    setStatus(errors.length === endpoints.length ? "error" : "success");
    setError(errors.join(" | "));
  }, []);

  useEffect(() => {
    let isMounted = true;

    refresh().catch((loadError) => {
      if (!isMounted) {
        return;
      }

      setStatus("error");
      setError(loadError instanceof Error ? loadError.message : "Unable to load backend content.");
    });

    return () => {
      isMounted = false;
    };
  }, [refresh]);

  const value = useMemo(
    () => ({
      content,
      status,
      error,
      refresh,
    }),
    [content, error, refresh, status]
  );

  return <PublicContentContext.Provider value={value}>{children}</PublicContentContext.Provider>;
}

export function usePublicContent() {
  return useContext(PublicContentContext);
}
