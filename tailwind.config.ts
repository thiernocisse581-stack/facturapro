import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB", // Primary CTA & Active Blue
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },
        surface: {
          50: "#F8FAFC", // Main dashboard background
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        status: {
          paid: {
            bg: "#ECFDF5",
            text: "#059669",
            border: "#A7F3D0",
            dot: "#10B981",
          },
          pending: {
            bg: "#FFFBEB",
            text: "#D97706",
            border: "#FDE68A",
            dot: "#F59E0B",
          },
          overdue: {
            bg: "#FEF2F2",
            text: "#DC2626",
            border: "#FECACA",
            dot: "#EF4444",
          },
          draft: {
            bg: "#F1F5F9",
            text: "#475569",
            border: "#E2E8F0",
            dot: "#94A3B8",
          },
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
        cardHover: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)",
        elevated: "0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)",
        dropdown: "0 10px 38px -10px rgba(22, 23, 24, 0.25), 0 10px 20px -15px rgba(22, 23, 24, 0.15)",
      },
      borderRadius: {
        xl: "0.875rem", // 14px
        "2xl": "1.125rem", // 18px
        "3xl": "1.5rem", // 24px
      },
    },
  },
  plugins: [],
};
export default config;
