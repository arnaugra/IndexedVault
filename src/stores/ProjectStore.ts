import { create } from 'zustand';

interface ProjectStore {
    projectName?: string;
    projectDescription?: string;
    setProjectName: (name: string | undefined) => void;
    setProjectDescription: (description: string | undefined) => void;
}

const useProjectStore = create<ProjectStore>((set) => ({
    projectName: undefined,
    projectDescription: undefined,
    setProjectName: (name) => set({ projectName: name }),
    setProjectDescription: (description) => set({ projectDescription: description }),
}));

export default useProjectStore;
