import { defineConfig, createSystem, defaultConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: "#eaf4f8" },
          100: { value: "#c5e4ef" },
          200: { value: "#a1d4e5" },
          300: { value: "#7fc2da" },
          400: { value: "#5cb0d0" },
          500: { value: "#399ec6" },
          600: { value: "#327fa0" },
          700: { value: "#275a75" },
          800: { value: "#244a5a" },
          900: { value: "#162a3b" },
        },
        secondary: {
          50: { value: "#e6f8f0" },
          100: { value: "#c1f1e1" },
          200: { value: "#9be9d2" },
          300: { value: "#74e0c2" },
          400: { value: "#50d8b5" },
          500: { value: "#27ae60" },
          600: { value: "#1f8e4c" },
          700: { value: "#176d38" },
          800: { value: "#114d25" },
          900: { value: "#0a3a1a" },
        },
        background: {
          primary: { value: "#162a3b" },
          secondary: { value: "#244a5a" },
          dark: { value: "#0d1a25" },
        },
        text: {
          primary: { value: "#f7fafc" },
          secondary: { value: "#d1e5f0" },
          inverse: { value: "#162a3b" },
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
          850: { value: "#c62828" },
          900: { value: "#8d2b0b" },
        },
      },
    },
  },
});

export const themeSystem = createSystem(defaultConfig, customConfig);
