import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { themeSystem } from "./theme.ts";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import { ActiveSheetProvider } from "./contexts/active-sheet-context.tsx";
import { ProfessorProvider } from "./contexts/professor-context";
import { StudentProvider } from "./contexts/student-context";
import BackgroundProvider from "./components/BackgroundProvider";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <ChakraProvider value={themeSystem}>
          <ProfessorProvider>
            <StudentProvider>
              <ActiveSheetProvider>
                <BackgroundProvider>
                  <App />
                </BackgroundProvider>
              </ActiveSheetProvider>
            </StudentProvider>
          </ProfessorProvider>
        </ChakraProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
);
