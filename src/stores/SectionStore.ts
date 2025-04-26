import { create } from 'zustand';

interface SectionStore {
    sectionName?: string;
    sectionDescription?: string;
    sectionNameError: boolean;
    setSectionName: (name: string | undefined) => void;
    setSectionDescription: (description: string | undefined) => void;
    setSectionNameError: (error: boolean) => void;
}

const useSectionStore = create<SectionStore>((set) => ({
    sectionName: undefined,
    sectionDescription: undefined,
    sectionNameError: false,
    setSectionName: (name) => set({ sectionName: name, sectionNameError: false }),
    setSectionDescription: (description) => set({ sectionDescription: description }),
    setSectionNameError: (error) => set({ sectionNameError: error }),
}));

export default useSectionStore;
