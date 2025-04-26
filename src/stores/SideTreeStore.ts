import { create } from 'zustand';
import { ProjectI } from '../db/interfaces';
import { Project } from '../db/Project';

interface SideTreeStore {
    tree: ProjectI[];
    setTree: () => void;
}

const useSideTreeStore = create<SideTreeStore>((set) => ({
    tree: [],
    setTree: async () => {
        const tree = await Project.getAll(true);
        set({ tree });
    },
}));

export default useSideTreeStore;
