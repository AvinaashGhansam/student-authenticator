import { createContext, type ReactNode, useContext, useState } from "react";

type ActiveSheet = {
  sheetId: string | null;
  isActive: boolean;
  secretKey: string | null;
  //TODO:  add: courseTitle, createdAt, expiresAt, etc.
};

type ActiveSheetContextType = {
  activeSheet: ActiveSheet | null;
  setActiveSheet: (sheet: ActiveSheet | null) => void;
};

const ActiveSheetContext = createContext<ActiveSheetContextType | undefined>(
  undefined,
);

export const ActiveSheetProvider = ({ children }: { children: ReactNode }) => {
  const [activeSheet, setActiveSheet] = useState<ActiveSheet | null>(null);

  return (
    <ActiveSheetContext.Provider value={{ activeSheet, setActiveSheet }}>
      {children}
    </ActiveSheetContext.Provider>
  );
};

export const useActiveSheet = () => {
  const context = useContext(ActiveSheetContext);
  if (!context) {
    throw new Error("useActiveSheet must be used within ActiveSheetProvider");
  }
  return context;
};
