import { useEffect, useState } from "react";
import useValueStore, { ValueTypes } from "../../stores/ValueStore";
import useValuesStore from "../../stores/ValuesStore";
import useEncryptStore from "../../stores/EncryptStore";
import { Value } from "../../db/Value";
import ModalComponent from "../../components/ModalComponent";
import InputField from "../../components/InputField";
import { decrypt, encrypt } from "../../utils/encrypt";
import EditIcon from "../../svg/EditIcon";

const valueBase = {
    name: "",
    nameError: false,
    value: "",
    valueError: false,
    type: ValueTypes.TEXT,
    expirationDate: undefined as string | undefined,
    encryptionError: false,
}

function ValueModal(props: {section_id: number}) {
    const valueIdToEdit = useValueStore((state) => state.valueIdToEdit);

    const openNewValue =useValueStore((state) => state.openNewValue);
    const setOpenNewValue = useValueStore((state) => state.setOpenNewValue);
    const setValueIdToEdit = useValueStore((state) => state.setValueIdToEdit);

    const [localValue, setLocalValue] = useState(valueBase);

    const setValues = useValuesStore((state) => state.setValues);
    const encryptionKey = useEncryptStore((state) => state.encryptionKey);

    const inputValue = async (value: string, type: ValueTypes) => {
        if (type === ValueTypes.PASSWORD && encryptionKey) {
            const decryptedValue = await decrypt(value, encryptionKey);
            return decryptedValue ?? "";
        }
        return value;
    }

    useEffect(() => {
        if (!openNewValue) {
            setLocalValue(valueBase);
            return;
        }
        const init = async () => {
            if (valueIdToEdit) {
                await Value.getById(valueIdToEdit!).then(async (value) => {
                    const finalValue = await inputValue(value?.value as string, value?.type as ValueTypes);
                    setLocalValue({
                        name: value?.name ?? "",
                        nameError: false,
                        value: finalValue,
                        valueError: false,
                        type: value?.type as ValueTypes ?? ValueTypes.TEXT,
                        expirationDate: value?.expirationDate ?? undefined,
                        encryptionError: false,
                    });

                });
            }
        }

        init();
    }, [openNewValue]);

    const closeValueModal = () => {
        setValueIdToEdit(undefined);
        setLocalValue(valueBase);
        setOpenNewValue(false);
    }

    const handleValueInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalValue((prev) => ({ ...prev, [name]: value }));   
    }

    const saveValue = async () => {
        if (!localValue.name) setLocalValue((prev) => ({ ...prev, nameError: true }));
        if (!localValue.value) setLocalValue((prev) => ({ ...prev, valueError: true }));
        if (localValue.type === ValueTypes.PASSWORD && !encryptionKey) setLocalValue((prev) => ({ ...prev, encryptionError: true }));

        if (localValue.nameError || localValue.valueError || (localValue.type === ValueTypes.PASSWORD && localValue.encryptionError)) return;

        let finalValue = localValue.value;
        if (localValue.type === ValueTypes.PASSWORD) {
            const encryptedValue = await encrypt(finalValue, encryptionKey as string);
            finalValue = encryptedValue;
        }
        
        if (valueIdToEdit) {
            await Value.update(valueIdToEdit!, {
                name: localValue.name,
                value: finalValue,
                type: localValue.type,
                expirationDate: localValue.expirationDate,
            });
        } else {
            await Value.create({
                sectionId: props.section_id,
                name: localValue.name,
                value: finalValue,
                type: localValue.type,
                expirationDate: localValue.expirationDate,
                order: await Value.count(),
            });
        }

        setLocalValue(valueBase);
        setValues(props.section_id);
        setValueIdToEdit(undefined);
        setOpenNewValue(false);
    }

    return (
        <>
            <button className="btn btn-sm" onClick={() => setOpenNewValue(true)}>
                <EditIcon className="w-4" />
                New value
            </button>
            <ModalComponent open={openNewValue} onClose={closeValueModal}>
                <div className="flex flex-col gap-4">
                <h2>{valueIdToEdit ? "Edit" : "Create New"} value</h2>

                <div className="flex flex-col gap-2">
                    <div className="join">
                        <InputField label="Name" name="name" width="w-1/3" value={localValue.name} error={localValue.nameError} action={handleValueInput} />
                        <InputField label="Value" name="value" type={localValue.type} width="w-2/3" value={localValue.value} error={localValue.valueError} action={handleValueInput} />
                    </div>

                    <div className="flex gap-3">
                    <label className="form-control w-4/9">
                        <span>Type</span>
                        <select name="type" className="select select-bordered w-full" value={localValue.type} onChange={handleValueInput}>
                        {Object.keys(ValueTypes).map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                        </select>
                    </label>

                    <InputField label="Expiration date" name="expirationDate" type="date" value={localValue.expirationDate} action={handleValueInput} optional />
                    </div>
                </div>

                {localValue.encryptionError && (
                    <p className="text-error">Encryption key is required for password values</p>
                )}
                
                {localValue.encryptionError && (
                    <p className="text-error">Could not decrypt password. Please check your encryption key.</p>
                )}

                <button className="btn btn-sm btn-primary" onClick={saveValue}>
                    {valueIdToEdit ? "Edit" : "Create"}
                </button>
                </div>
            </ModalComponent>
        </>
    );
}

export default ValueModal;
