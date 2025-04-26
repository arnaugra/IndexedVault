import { create } from 'zustand';
import { SectionI } from '../db/interfaces';
import { Section } from '../db/Section';

interface SectionsStore {
    sections: SectionI[];
    setSections: (project_id: number) => Promise<void>;
}

const useSectionsStore = create<SectionsStore>((set) => ({
    sections: [],
    setSections: async (project_id) => {
        const sections = await Section.getAllForProject(project_id);
        set({ sections });
    },
}));

export default useSectionsStore;
