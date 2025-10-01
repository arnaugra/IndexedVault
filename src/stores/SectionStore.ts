import { create } from 'zustand';
import { UUID } from '../types/fields';

interface SectionStore {
    sectionName?: string;
    sectionDescription?: string;
    sectionUuid?: UUID;
    setSectionName: (name: string | undefined) => void;
    setSectionDescription: (description: string | undefined) => void;
    setSectionUuid: (uuid: UUID | undefined) => void;
}

const useSectionStore = create<SectionStore>((set) => ({
    sectionName: undefined,
    sectionDescription: undefined,
    sectionUuid: undefined,
    setSectionName: (name) => set({ sectionName: name }),
    setSectionDescription: (description) => set({ sectionDescription: description }),
    setSectionUuid: (uuid) => set({ sectionUuid: uuid }),
}));

export default useSectionStore;
