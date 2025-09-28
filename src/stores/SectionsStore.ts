import { create } from 'zustand';
import { SectionI } from '../db/interfaces';
import { Section } from '../db/Section';
import { UUID } from '../types/fields';

interface SectionsStore {
    sections: SectionI[];
    setSections: (project_uuid: UUID) => Promise<void>;
}

const useSectionsStore = create<SectionsStore>((set) => ({
    sections: [],
    setSections: async (project_uuid) => {
        const sections = await Section.getAllForProject(project_uuid);
        set({ sections });
    },
}));

export default useSectionsStore;
