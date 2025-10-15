import { createContext, useContext, useState, ReactNode } from "react";
import { ValueI } from "../db/interfaces";

interface ValueContextType {
    currentValue: ValueI | null;
    setCurrentValue: (value: ValueI | null) => void;
}

const ValueContext = createContext<ValueContextType | null>(null);

export const ValueProvider = ({ children }: { children: ReactNode }) => {
    const [currentValue, setCurrentValue] = useState<ValueI | null>(null);

    return (
        <ValueContext.Provider value={{ currentValue, setCurrentValue }}>
            {children}
        </ValueContext.Provider>
    );
};

export const useValue = () => {
    const context = useContext(ValueContext);
    if (!context) {
        throw new Error("useValue must be used within a ValueProvider");
    }
    return context;
};
