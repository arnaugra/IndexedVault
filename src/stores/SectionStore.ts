import { create } from 'zustand';

interface SectionStore {
    sectionName?: string;
    sectionDescription?: string;
    setSectionName: (name: string | undefined) => void;
    setSectionDescription: (description: string | undefined) => void;
}

const useSectionStore = create<SectionStore>((set) => ({
    sectionName: undefined,
    sectionDescription: undefined,
    setSectionName: (name) => set({ sectionName: name }),
    setSectionDescription: (description) => set({ sectionDescription: description }),
}));

export default useSectionStore;
