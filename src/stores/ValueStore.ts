import { create } from 'zustand';

interface ValueStore {
    openNewValue: boolean;
    setOpenNewValue: (open: boolean) => void;
    valueIdToEdit?: number;
    setValueIdToEdit: (id: number | undefined) => void;
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
