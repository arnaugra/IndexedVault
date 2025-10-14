import { createContext, useContext, useState, ReactNode } from "react";
import { ProjectI } from "../db/interfaces";

interface ProjectContextType {
    currentProject: ProjectI | null;
    setCurrentProject: (project: ProjectI | null) => void;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
    const [currentProject, setCurrentProject] = useState<ProjectI | null>(null);

    return (
        <ProjectContext.Provider value={{ currentProject, setCurrentProject }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProject must be used within a ProjectProvider");
    }
    return context;
};
