import { create } from 'zustand';
import { UUID } from '../types/fields';

interface ValueStore {
    openNewValue: boolean;
    setOpenNewValue: (open: boolean) => void;
    valueIdToEdit?: UUID;
    setValueIdToEdit: (id: UUID | undefined) => void;
}

enum ValueTypes {
    TEXT = "TEXT",
    PASSWORD = "PASSWORD",
    DATE = "DATE",
}

const useValueStore = create<ValueStore>((set) => ({
    openNewValue: false,
    setOpenNewValue: (open) => set({ openNewValue: open }),
    valueIdToEdit: undefined,
    setValueIdToEdit: (id) => set({ valueIdToEdit: id }),
}));

export default useValueStore;
export { ValueTypes };
