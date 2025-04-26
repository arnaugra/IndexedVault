import { create } from 'zustand';
import { ValueI } from '../db/interfaces';
import { Value } from '../db/Value';

interface ValuesStore {
    values: ValueI[];
    setValues: (section_id: number) => void;
}

const useValuesStore = create<ValuesStore>((set) => ({
    values: [],
    setValues: async (section_id) => {
        const values = await Value.getAllForSection(section_id);
        set({ values });
    },
}));

export default useValuesStore;
