/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "solar-blue": "#1572C8",
        "growth-green": "#2AAF6F",
        "deep-navy": "#0D1B2A",
        "cloud-gray": "#F8FAFB",
        "steel-gray": "#6B7A8D",
        primary: "#1572C8",
        "primary-container": "#1572c8",
        secondary: "#006d40",
        "secondary-container": "#7cf7b0",
        navy: "#0D1B2A",
        "deep-red": "#7f1d1d",
        background: "#f8fafb",
        surface: "#ffffff",
        "surface-bright": "#f8fafb",
        "surface-container-low": "#f2f4f5",
        "surface-container": "#eceeef",
        "surface-container-lowest": "#ffffff",
        "outline-variant": "#c1c7d4",
        tertiary: "#4c596b",
        "custom-green": "#2AAF6F",
        "on-primary": "#ffffff",
        "on-background": "#0D1B2A",
        "on-surface": "#0D1B2A",
        "on-surface-variant": "#414752",
      },
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        marquee: "marquee 30s linear infinite",
        "staggered-fade": "slideUpFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        slideUpFade: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
