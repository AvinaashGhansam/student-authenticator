import React, { createContext, useContext, useState, ReactNode } from "react";

export type Professor = {
  id: string;
  name: string;
  email: string;
  // Add more fields as needed
};

interface ProfessorContextType {
  professor: Professor | null;
  setProfessor: (professor: Professor | null) => void;
}

const ProfessorContext = createContext<ProfessorContextType | undefined>(undefined);

export const ProfessorProvider = ({ children }: { children: ReactNode }) => {
  const [professor, setProfessor] = useState<Professor | null>(null);

  return (
    <ProfessorContext.Provider value={{ professor, setProfessor }}>
      {children}
    </ProfessorContext.Provider>
  );
};

export const useProfessor = () => {
  const context = useContext(ProfessorContext);
  if (!context) {
    throw new Error("useProfessor must be used within a ProfessorProvider");
  }
  return context;
};

