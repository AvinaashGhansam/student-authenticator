// theme.ts
import { defineConfig, createSystem, defaultConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: "#e3f2fd" },
          100: { value: "#bbdefb" },
          200: { value: "#90caf9" },
          300: { value: "#64b5f6" },
          400: { value: "#42a5f5" },
          500: { value: "#2196f3" },
          600: { value: "#1e88e5" },
          700: { value: "#1976d2" },
          800: { value: "#1565c0" },
          900: { value: "#0d47a1" },
        },
        secondary: {
          50: { value: "#e0f7fa" },
          100: { value: "#b2ebf2" },
          200: { value: "#80deea" },
          300: { value: "#4dd0e1" },
          400: { value: "#26c6da" },
          500: { value: "#00bcd4" },
          600: { value: "#00acc1" },
          700: { value: "#0097a7" },
          800: { value: "#00838f" },
          900: { value: "#006064" },
        },
        background: {
          primary: { value: "#f7f9fc" },
          secondary: { value: "#edf2f7" },
          dark: { value: "#121212" },
        },
        text: {
          primary: { value: "#1a202c" },
          secondary: { value: "#4a5568" },
          inverse: { value: "#f7fafc" },
        },
        warning: {
          50: { value: "#fffbea" },
          100: { value: "#fff3c4" },
          200: { value: "#fce588" },
          300: { value: "#fadb5f" },
          400: { value: "#f7c948" },
          500: { value: "#f0b429" },
          600: { value: "#de911d" },
          700: { value: "#cb6e17" },
          800: { value: "#b44d12" },
          900: { value: "#8d2b0b" },
        },
      },
    },
  },
});

export const themeSystem = createSystem(defaultConfig, customConfig);
