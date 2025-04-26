import { create } from 'zustand';

interface ProjectStore {
    projectName?: string;
    projectDescription?: string;
    projectNameError: boolean;
    setProjectName: (name: string | undefined) => void;
    setProjectDescription: (description: string | undefined) => void;
    setProjectNameError: (error: boolean) => void;
}

const useProjectStore = create<ProjectStore>((set) => ({
    projectName: undefined,
    projectDescription: undefined,
    projectNameError: false,
    setProjectName: (name) => set({ projectName: name, projectNameError: false }),
    setProjectDescription: (description) => set({ projectDescription: description }),
    setProjectNameError: (error) => set({ projectNameError: error }),
}));

export default useProjectStore;
