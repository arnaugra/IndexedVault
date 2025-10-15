import { createContext, useContext, useState, ReactNode } from "react";
import { SectionI } from "../db/interfaces";

interface SectionContextType {
    currentSection: SectionI | null;
    setCurrentSection: (section: SectionI | null) => void;
}

const SectionContext = createContext<SectionContextType | null>(null);

export const SectionProvider = ({ children }: { children: ReactNode }) => {
    const [currentSection, setCurrentSection] = useState<SectionI | null>(null);

    return (
        <SectionContext.Provider value={{ currentSection, setCurrentSection }}>
            {children}
        </SectionContext.Provider>
    );
};

export const useSection = () => {
    const context = useContext(SectionContext);
    if (!context) {
        throw new Error("useSection must be used within a SectionProvider");
    }
    return context;
};
