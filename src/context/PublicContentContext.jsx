import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getPayloadApiBase } from "../lib/mediaUrl";

const PublicContentContext = createContext({
  content: null,
  status: "success",
  error: "",
  refresh: async () => {},
});

export function PublicContentProvider({ children }) {
  const [state, setState] = useState({
    content: null,
    status: "loading",
    error: "",
  });

  async function loadContent({ signal } = {}) {
    const baseUrl = getPayloadApiBase();

    setState((current) => ({
      ...current,
      status: "loading",
      error: "",
    }));

    try {
      const [
        homeResponse,
        servicesHeaderResponse,
        omResponse,
        contactResponse,
        footerResponse,
        projectsResponse,
        clientsResponse,
        testimonialsResponse,
      ] =
        await Promise.all([
          fetch(`${baseUrl}/globals/home-page?depth=2`, { signal }),
          fetch(`${baseUrl}/globals/services-header?depth=2`, { signal }),
          fetch(`${baseUrl}/globals/operations-maintenance-page?depth=2`, { signal }),
          fetch(`${baseUrl}/globals/contact-page?depth=2`, { signal }),
          fetch(`${baseUrl}/globals/footer?depth=2`, { signal }),
          fetch(`${baseUrl}/projects?depth=2&sort=sortOrder&limit=100`, { signal }),
          fetch(`${baseUrl}/clients?depth=2&sort=sortOrder&limit=100`, { signal }),
          fetch(`${baseUrl}/testimonials?depth=2&sort=sortOrder&limit=100`, { signal }),
        ]);

      if (
        !homeResponse.ok ||
        !servicesHeaderResponse.ok ||
        !omResponse.ok ||
        !contactResponse.ok ||
        !footerResponse.ok ||
        !projectsResponse.ok ||
        !clientsResponse.ok ||
        !testimonialsResponse.ok
      ) {
        throw new Error("Unable to load Payload content");
      }

      const [home, servicesHeader, operationsMaintenance, contact, footer, projects, clients, testimonials] = await Promise.all([
        homeResponse.json(),
        servicesHeaderResponse.json(),
        omResponse.json(),
        contactResponse.json(),
        footerResponse.json(),
        projectsResponse.json(),
        clientsResponse.json(),
        testimonialsResponse.json(),
      ]);

      setState({
        content: {
          home: {
            ...home,
            ctaPrimary: home.primaryCtaLabel,
            ctaSecondary: home.secondaryCtaLabel,
          },
          servicesHeader,
          operationsMaintenance,
          contact,
          footer,
          settings: {
            footerYear: footer.year,
          },
          projects: projects.docs ?? [],
          clients: clients.docs ?? [],
          testimonials: testimonials.docs ?? [],
        },
        status: "success",
        error: "",
      });
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      setState({
        content: null,
        status: "success",
        error: error.message || "Payload content unavailable",
      });
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadContent({ signal: controller.signal });

    return () => controller.abort();
  }, []);

  const value = useMemo(
    () => ({
      content: state.content,
      status: state.status,
      error: state.error,
      refresh: () => loadContent(),
    }),
    [state]
  );

  return <PublicContentContext.Provider value={value}>{children}</PublicContentContext.Provider>;
}

export function usePublicContent() {
  return useContext(PublicContentContext);
}
