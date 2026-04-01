import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PublicContentProvider } from "./context/PublicContentContext";
import "../index.css";

async function loadCriticalFonts() {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return;
  }

  const fontLoads = [
    document.fonts.load('800 1em "Plus Jakarta Sans"'),
    document.fonts.load('500 1em "Plus Jakarta Sans"'),
    document.fonts.load('700 1em "Inter"'),
    document.fonts.load('400 1em "Inter"'),
  ];

  await Promise.race([
    Promise.allSettled(fontLoads),
    new Promise((resolve) => window.setTimeout(resolve, 2000)),
  ]);
}

async function bootstrap() {
  await loadCriticalFonts();

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <PublicContentProvider>
        <App />
      </PublicContentProvider>
    </React.StrictMode>
  );
}

bootstrap();

// Register service worker for image caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((err) => {
      console.log('Service Worker registration failed:', err);
    });
  });
}
