import { create } from 'zustand';
import { UUID } from '../types/fields';

interface ProjectStore {
    projectName?: string;
    projectDescription?: string;
    projectUuid?: UUID;
    setProjectName: (name: string | undefined) => void;
    setProjectDescription: (description: string | undefined) => void;
    setProjectUuid: (uuid: UUID | undefined) => void;
}

const useProjectStore = create<ProjectStore>((set) => ({
    projectName: undefined,
    projectDescription: undefined,
    projectUuid: undefined,
    setProjectName: (name) => set({ projectName: name }),
    setProjectDescription: (description) => set({ projectDescription: description }),
    setProjectUuid: (uuid) => set({ projectUuid: uuid }),
}));

export default useProjectStore;
