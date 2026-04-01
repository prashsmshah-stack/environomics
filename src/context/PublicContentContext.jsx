import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getApiUrl } from "../lib/api";
import { subscribeToPublicContentUpdates } from "../lib/publicContentSync";

const PublicContentContext = createContext({
  content: null,
  status: "idle",
  error: "",
  refresh: async () => {},
});

async function fetchPublicContent() {
  const response = await fetch(getApiUrl("/content"));
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message ?? "Could not load website content.");
  }

  return payload?.data ?? null;
}

export function PublicContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadContent() {
      setStatus("loading");
      setError("");

      try {
        const nextContent = await fetchPublicContent();

        if (ignore) {
          return;
        }

        setContent(nextContent);
        setStatus("success");
      } catch (loadError) {
        if (ignore) {
          return;
        }

        setError(loadError.message || "Could not load website content.");
        setStatus("error");
      }
    }

    loadContent();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    const unsubscribe = subscribeToPublicContentUpdates(async () => {
      try {
        const nextContent = await fetchPublicContent();

        if (ignore) {
          return;
        }

        setContent(nextContent);
        setStatus("success");
        setError("");
      } catch (refreshError) {
        if (ignore) {
          return;
        }

        setError(refreshError.message || "Could not refresh website content.");
        setStatus("error");
      }
    });

    return () => {
      ignore = true;
      unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      content,
      status,
      error,
      refresh: async () => {
        try {
          const nextContent = await fetchPublicContent();
          setContent(nextContent);
          setStatus("success");
          setError("");
        } catch (refreshError) {
          setError(refreshError.message || "Could not refresh website content.");
          setStatus("error");
        }
      },
    }),
    [content, error, status]
  );

  return <PublicContentContext.Provider value={value}>{children}</PublicContentContext.Provider>;
}

export function usePublicContent() {
  return useContext(PublicContentContext);
}
