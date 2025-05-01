import { useEffect, useState } from "react";
import useEncryptStore from "../stores/EncryptStore";
import ModalComponent from "../components/ModalComponent";

function EncryptModal() {

    const openModal = useEncryptStore((state) => state.openModal);
    const setOpenModal = useEncryptStore((state) => state.setOpenModal);
    const setEncryptionKey = useEncryptStore((state) => state.setEncryptionKey);
    const saveEncryptionKey = useEncryptStore((state) => state.saveEncryptionKey);
    const deleteEncryptionKey = useEncryptStore((state) => state.deleteEncryptionKey);

    const [inputValue, setInputValue] = useState("");
    
    useEffect(() => {
        if (openModal) {
            deleteEncryptionKey();
        } else {
            setInputValue("");
        }
    }, [openModal]);

    const handleEncryptionInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
    };

    const handleSaveEncryptionkey = async () => {
        setEncryptionKey(inputValue.trim());
        saveEncryptionKey();
        setOpenModal(false);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <ModalComponent open={openModal} onClose={handleCloseModal}>
            <div className="flex flex-col gap-4">
                <h2>Encription Key</h2>
                <div>
                    <p>Enter your encryption key to keep your data safe.</p>
                    <p className="text-sm text-gray-500">Any time you access the site, you will need to enter this key.</p>
                </div>
                    <input type="password" className="input w-full" onChange={handleEncryptionInput} value={inputValue ?? ""} />
                <button className="btn btn-sm btn-primary" onClick={handleSaveEncryptionkey}>
                    Save Encription Key
                </button>
            </div>
        </ModalComponent>
    );
}

export default EncryptModal;
