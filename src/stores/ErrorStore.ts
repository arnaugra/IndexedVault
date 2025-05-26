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

/**
 * Generates a generic error message for unexpected operations.
 * This function is used to create a standardized error message when an unexpected error occurs during operations such as saving data, loading configuration, etc.
 * @param message - A description of the operation that caused the error, e.g., "saving data", "loading configuration".
 * @example "An unexpected error occurred while [message]"
 */
const genericError = (message: string) => {
    useErrorStore.getState().addError({
        id: Math.random(),
        message: `An unexpected error occurred while ${message}`,
        type: ErrorsTypes.error,
        timestamp: Date.now(),
    });
}

export default useErrorStore;
export type { ErrorsType };
export { ErrorsTypes, genericError };
