import { create } from "zustand";

// TODO: change the error naming to toast

enum ToastsTypes {
    info = "info",
    warning = "warning",
    error = "error",
}

type ToastType = {
    id: number;
    message: string;
    type: ToastsTypes;
    timestamp: number;
};

interface ToastStore {
    toasts: ToastType[];
    addToast: (toast: ToastType) => void;
    removeToast: (index: number) => void;
};

const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (toast) => set((state) => ({ toasts: [...state.toasts, toast] })),
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((toasts) => toasts.id !== id) })),
}));

/**
 * Generates a generic error message for unexpected operations.
 * This function is used to create a standardized error message when an unexpected error occurs during operations such as saving data, loading configuration, etc.
 * @param message - A description of the operation that caused the error, e.g., "saving data", "loading configuration".
 * @example "An unexpected error occurred while [message]"
 */
const genericError = (message: string) => {
    useToastStore.getState().addToast({
        id: Math.random(),
        message: `An unexpected error occurred while ${message}`,
        type: ToastsTypes.error,
        timestamp: Date.now(),
    });
}

export default useToastStore;
export type { ToastType };
export { ToastsTypes, genericError };
