import { create } from "zustand";

type ErrorType = {
    id: number;
    message: string;
    type: "error" | "warning" | "info";
    timestamp: number;
};

interface ErrorStore {
    errors: ErrorType[];
    addError: (error: ErrorType) => void;
    removeError: (index: number) => void;
    clearErrors: () => void;
    setError: (error: ErrorType) => void;
    setErrors: (errors: ErrorType[]) => void;
};

const useErrorStore = create<ErrorStore>((set) => ({
    errors: [{
        id: 0,
        message: "Welcome to the app!",
        type: "info",
        timestamp: Date.now()
    }],
    addError: (error) => set((state) => ({ errors: [...state.errors, error] })),
    removeError: (index) => set((state) => ({ errors: state.errors.filter((error) => error.id !== index) })),
    clearErrors: () => set({ errors: [] }),
    setError: (error) => set({ errors: [error] }),
    setErrors: (errors) => set({ errors })
}));

export default useErrorStore;
export type { ErrorType };
