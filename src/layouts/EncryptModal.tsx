import useEncryptStore from "../stores/EncryptStore";
import ModalComponent from "../components/ModalComponent";
import { useEffect, useRef } from "react";

function EncryptModal() {
    const openModal = useEncryptStore((state) => state.openModal);
    const setOpenModal = useEncryptStore((state) => state.setOpenModal);

    const encryptionKey = useEncryptStore((state) => state.encryptionKey);
    const setEncryptionKey = useEncryptStore((state) => state.setEncryptionKey);
    const saveEncryptionkey = useEncryptStore((state) => state.saveEncryptionKey);
    const deleteEncryptionKey = useEncryptStore((state) => state.deleteEncryptionKey);

    const didResetRef = useRef(false);

    useEffect(() => {
        if (openModal && !didResetRef.current) {
            deleteEncryptionKey();
            setTimeout(() => setEncryptionKey(""), 0);
            didResetRef.current = true;
        }
    }, [openModal]);

    useEffect(() => {
        if (!openModal) {
            didResetRef.current = false;
        }
    }, [openModal]);

    const handleEncryptionInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEncryptionKey(value);
    };

    const handleSaveEncryptionkey = async () => {
        saveEncryptionkey();
        setOpenModal(false);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <ModalComponent open={openModal} onClose={handleCloseModal}>
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-bold">Decrypt</h2>
                <p>Decrypt your data with a password.</p>
                <input type="password" className="input" onChange={handleEncryptionInput} value={encryptionKey || ""} />
                <button className="btn btn-sm btn-primary" onClick={handleSaveEncryptionkey}>
                    Encrypt
                </button>
            </div>
        </ModalComponent>
    );
}

export default EncryptModal;
