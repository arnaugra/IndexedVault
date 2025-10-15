import { create } from 'zustand';
import { ValueI } from '../db/interfaces';
import { Value } from '../db/Value';
import { UUID } from '../types/fields';

interface ValuesStore {
    values: ValueI[];
    setValues: (section_uuid: UUID) => void;
    openNewValue: boolean;
    setOpenNewValue: (open: boolean) => void;
    valueIdToEdit?: UUID;
    setValueIdToEdit: (id: UUID | undefined) => void;
}

const useValuesStore = create<ValuesStore>((set) => ({
    values: [],
    setValues: async (section_uuid) => {
        const values = await Value.getAllForSection(section_uuid);
        set({ values });
    },
    openNewValue: false,
    setOpenNewValue: (open) => set({ openNewValue: open }),
    valueIdToEdit: undefined,
    setValueIdToEdit: (id) => set({ valueIdToEdit: id }),
}));

export default useValuesStore;
