import { Suspense, lazy, startTransition, useEffect, useState } from "react";
import { usePublicContent } from "./context/PublicContentContext";
import { applyRouteMetadata } from "./seo";

const loadHomePage = () => import("./pages/HomePage");
const loadAboutUsPage = () => import("./pages/AboutUsPage");
const loadContactUsPage = () => import("./pages/ContactUsPage");
const loadProjectsPage = () => import("./pages/ProjectsPage");
const loadProjectCaseStudyPage = () => import("./pages/ProjectCaseStudyPage");
const loadOperationsMaintenancePage = () => import("./pages/OperationsMaintenancePage");
const loadOperationsMaintenanceGalleryPage = () =>
  import("./pages/OperationsMaintenanceGalleryPage");
const loadClientsPage = () => import("./pages/ClientsPage");
const loadTestimonialsPage = () => import("./pages/TestimonialsPage");
const loadInnovationPage = () => import("./pages/InnovationPage");
const loadServicesPage = () => import("./pages/ServicesPage");
const loadPrivacyPolicyPage = () => import("./pages/PrivacyPolicyPage");

const HomePage = lazy(loadHomePage);
const AboutUsPage = lazy(loadAboutUsPage);
const ContactUsPage = lazy(loadContactUsPage);
const ProjectsPage = lazy(loadProjectsPage);
const ProjectCaseStudyPage = lazy(loadProjectCaseStudyPage);
const OperationsMaintenancePage = lazy(loadOperationsMaintenancePage);
const OperationsMaintenanceGalleryPage = lazy(loadOperationsMaintenanceGalleryPage);
const ClientsPage = lazy(loadClientsPage);
const TestimonialsPage = lazy(loadTestimonialsPage);
const InnovationPage = lazy(loadInnovationPage);
const ServicesPage = lazy(loadServicesPage);
const PrivacyPolicyPage = lazy(loadPrivacyPolicyPage);

const routeComponents = {
  "/": HomePage,
  "/home": HomePage,
  "/about": AboutUsPage,
  "/contact": ContactUsPage,
  "/projects": ProjectsPage,
  "/projects/case-study": ProjectCaseStudyPage,
  "/om": OperationsMaintenancePage,
  "/om/gallery": OperationsMaintenanceGalleryPage,
  "/services": ServicesPage,
  "/clients": ClientsPage,
  "/testimonials": TestimonialsPage,
  "/innovation": InnovationPage,
  "/privacy": PrivacyPolicyPage,
};

const routePreloaders = {
  "/": loadHomePage,
  "/home": loadHomePage,
  "/about": loadAboutUsPage,
  "/contact": loadContactUsPage,
  "/projects": loadProjectsPage,
  "/projects/case-study": loadProjectCaseStudyPage,
  "/om": loadOperationsMaintenancePage,
  "/om/gallery": loadOperationsMaintenanceGalleryPage,
  "/services": loadServicesPage,
  "/clients": loadClientsPage,
  "/testimonials": loadTestimonialsPage,
  "/innovation": loadInnovationPage,
  "/privacy": loadPrivacyPolicyPage,
};

function getCleanRoute(pathname = "") {
  const normalizedPath = pathname === "" || pathname === "/home" ? "/" : pathname || "/";
  return routeComponents[normalizedPath] ? normalizedPath : "/";
}

function getQuerySection(search = "") {
  return new URLSearchParams(search).get("section");
}

function getCurrentLocationState() {
  if (typeof window === "undefined") {
    return { pathname: "/", search: "", key: "/" };
  }

  const pathname = window.location.pathname || "/";
  const search = window.location.search || "";
  return {
    pathname,
    search,
    key: `${pathname}${search}`,
  };
}

function updateLocationState(setLocationState) {
  startTransition(() => {
    setLocationState(getCurrentLocationState());
  });
}

function getAnchorFromEventTarget(target) {
  return target instanceof Element ? target.closest("a[href]") : null;
}

function getInternalRouteUrl(anchor) {
  if (typeof window === "undefined" || !anchor) {
    return null;
  }

  const rawHref = anchor.getAttribute("href");
  if (!rawHref || rawHref.startsWith("#")) {
    return null;
  }

  if (anchor.target && anchor.target !== "_self") {
    return null;
  }

  if (anchor.hasAttribute("download")) {
    return null;
  }

  const url = new URL(anchor.href, window.location.origin);
  if (url.origin !== window.location.origin) {
    return null;
  }

  const route = getCleanRoute(url.pathname);
  if (!routeComponents[route]) {
    return null;
  }

  return {
    route,
    search: url.search,
    hash: url.hash,
    href: `${route}${url.search}${url.hash}`,
  };
}

function RouteFallback() {
  return <div className="min-h-screen bg-white" aria-hidden="true" />;
}

export default function App() {
  const { content } = usePublicContent();
  const [locationState, setLocationState] = useState(() => getCurrentLocationState());
  const route = getCleanRoute(locationState.pathname);
  const Page = routeComponents[route] ?? HomePage;

  useEffect(() => {
    const currentLocation = getCurrentLocationState();
    const route = getCleanRoute(currentLocation.pathname);

    if (route !== currentLocation.pathname) {
      window.history.replaceState(null, "", `${route}${currentLocation.search}`);
      updateLocationState(setLocationState);
    }

    const onPopState = () => updateLocationState(setLocationState);

    const onDocumentClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = getAnchorFromEventTarget(event.target);
      const nextLocation = getInternalRouteUrl(anchor);
      if (!nextLocation) {
        return;
      }

      const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (nextLocation.href === currentHref) {
        return;
      }

      event.preventDefault();
      window.history.pushState(null, "", nextLocation.href);
      updateLocationState(setLocationState);
    };

    const preloadLinkedRoute = (event) => {
      const anchor = getAnchorFromEventTarget(event.target);
      const nextLocation = getInternalRouteUrl(anchor);
      if (!nextLocation) {
        return;
      }

      routePreloaders[nextLocation.route]?.();
    };

    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("pointerover", preloadLinkedRoute);
    document.addEventListener("focusin", preloadLinkedRoute);

    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("pointerover", preloadLinkedRoute);
      document.removeEventListener("focusin", preloadLinkedRoute);
    };
  }, []);

  useEffect(() => {
    applyRouteMetadata(route, content);
  }, [content, route]);

  useEffect(() => {
    const section = getQuerySection(locationState.search);

    requestAnimationFrame(() => {
      if (section) {
        const target = document.getElementById(section);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [locationState.key]);

  return (
    <Suspense fallback={<RouteFallback />}>
      <Page key={locationState.key} />
    </Suspense>
  );
}
