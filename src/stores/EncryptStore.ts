import { create } from 'zustand';

interface EncryptStore {
    openModal: boolean;
    setOpenModal: (b: boolean) => void;

    encryptionKey: string | null;
    setEncryptionKey: (key: string) => void;
    saveEncryptionKey: () => void;
    loadEncryptionKey: () => void;
    deleteEncryptionKey: () => void;
}

const useEncryptStore = create<EncryptStore>((set) => ({
    openModal: false,
    setOpenModal: (b) => set({ openModal: b }),
    encryptionKey: null,
    setEncryptionKey: (key) => set({ encryptionKey: key }),
    saveEncryptionKey: () => {
        const key = useEncryptStore.getState().encryptionKey;
        if (key) {
            sessionStorage.setItem("encryptionKey", key);
        }
    },
    loadEncryptionKey: () => {
        const key = sessionStorage.getItem("encryptionKey");
        if (key) {
            set({ encryptionKey: key });
        } else {
            set({ encryptionKey: null });
        }
    },
    deleteEncryptionKey: () => {
        set({ encryptionKey: null });
        sessionStorage.removeItem("encryptionKey");
    },
}));

export default useEncryptStore;
