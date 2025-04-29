import useEncryptStore from "../stores/EncryptStore";
import LockOpenIcon from "../svg/LockOpenIcon";
import ModalComponent from "../components/ModalComponent";
import LockCloseIcon from "../svg/LockCloseIcon";
import { useEffect } from "react";

function EncryptModal() {
    const openModal = useEncryptStore((state) => state.openModal);
    const setOpenModal = useEncryptStore((state) => state.setOpenModal);

    const encryptionKey = useEncryptStore((state) => state.encryptionKey);
    const setEncryptionKey = useEncryptStore((state) => state.setEncryptionKey);
    const saveEncryptionkey = useEncryptStore((state) => state.saveEncryptionKey);
    const deleteEncryptionKey = useEncryptStore((state) => state.deleteEncryptionKey);
    const loadEncryptionKey = useEncryptStore((state) => state.loadEncryptionKey);

    useEffect(() => {
        loadEncryptionKey();
    }
    , [loadEncryptionKey]);

    const handleModal = () => {
        setOpenModal(!openModal);
        if (!openModal) {
            deleteEncryptionKey();
        }
    };

    const handleEncryptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEncryptionKey(value);
    }

    const handleSaveEncryptionkey = async () => {
        saveEncryptionkey();
        setOpenModal(false);
    }

    return (
        <>
            <button className="btn btn-circle btn-ghost" onClick={handleModal}>
                {encryptionKey ? <LockCloseIcon className="w-5 text-success" /> : <LockOpenIcon className="w-5 text-error" />}
            </button>
            <ModalComponent open={openModal} onClose={handleModal}>
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold">Decrypt</h2>
                    <p>Decrypt your data with a password.</p>
                    <input type="password" className="input" onChange={handleEncryptionInput} />
                    <button className="btn btn-sm btn-primary" onClick={handleSaveEncryptionkey}>Edit</button>
                </div>

            
            </ModalComponent>
        </>
    )
}

export default EncryptModal;
