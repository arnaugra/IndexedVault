import useEncryptStore from "../stores/EncryptStore";
import ModalComponent from "../components/ModalComponent";
import { useEffect, useRef, useState } from "react";

function EncryptModal() {

    const openModal = useEncryptStore((state) => state.openModal);
    const setOpenModal = useEncryptStore((state) => state.setOpenModal);
    const encryptionKey = useEncryptStore((state) => state.encryptionKey);
    const setEncryptionKey = useEncryptStore((state) => state.setEncryptionKey);
    const saveEncryptionKey = useEncryptStore((state) => state.saveEncryptionKey);
    const deleteEncryptionKey = useEncryptStore((state) => state.deleteEncryptionKey);

    const [inputValue, setInputValue] = useState("");
    const didResetRef = useRef(false);
    const didMountRef = useRef(false);

    useEffect(() => {
        didMountRef.current = true;
        return () => {
            didMountRef.current = false;
        };
    }, []);

    // Efecto para manejar el reseteo cuando el modal se abre/cierra
    useEffect(() => {
        // Solo ejecuta esta lógica después del montaje inicial
        if (!didMountRef.current) return;

        if (openModal && !didResetRef.current) {
            // Usamos un timeout para garantizar que esto ocurra después del ciclo de renderizado
            const timer = setTimeout(() => {
                deleteEncryptionKey();
                didResetRef.current = true;
            }, 0);
            return () => clearTimeout(timer);
        } else if (!openModal) {
            didResetRef.current = false;
            // Limpiar el input cuando se cierra el modal
            setInputValue("");
        }
    }, [openModal]);

    const handleEncryptionInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        console.log("Encryption key:", value);
        setInputValue(value);
        setEncryptionKey(value);
    };

    const handleSaveEncryptionkey = async () => {
        console.log("Saving encryption key:", inputValue);

        setEncryptionKey(inputValue);
        saveEncryptionKey();
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
                <input type="password" className="input" onChange={handleEncryptionInput} value={inputValue ?? ""} />
                <button className="btn btn-sm btn-primary" onClick={handleSaveEncryptionkey}>
                    Encrypt
                </button>
            </div>
        </ModalComponent>
    );
}

export default EncryptModal;
