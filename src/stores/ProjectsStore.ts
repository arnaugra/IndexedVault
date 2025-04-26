import { create } from 'zustand';
import { Project } from '../db/Project';
import { ProjectI } from '../db/interfaces';

interface ProjectsStore {
    projects: ProjectI[];
    setProjects: () => void;
}

const useProjectsStore = create<ProjectsStore>((set) => ({
    projects: [],
    setProjects: async () => {
        const projects = await Project.getAll(true);
        set({ projects });
    },
}));

export default useProjectsStore;
