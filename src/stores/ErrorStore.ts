import { create } from "zustand";

// TODO: change the error naming to toast

enum ErrorsTypes {
    info = "info",
    warning = "warning",
    error = "error",
}

type ErrorsType = {
    id: number;
    message: string;
    type: ErrorsTypes;
    timestamp: number;
};

interface ErrorStore {
    errors: ErrorsType[];
    addError: (error: ErrorsType) => void;
    removeError: (index: number) => void;
};

const useErrorStore = create<ErrorStore>((set) => ({
    errors: [],
    addError: (error) => set((state) => ({ errors: [...state.errors, error] })),
    removeError: (id) => set((state) => ({ errors: state.errors.filter((error) => error.id !== id) })),
}));

export default useErrorStore;
export type { ErrorsType };
export { ErrorsTypes };
