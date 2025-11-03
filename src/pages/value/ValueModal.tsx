import { useCallback, useEffect, useState } from "react";
import { ValueTypes } from "../../stores/ValueStore";
import useValuesStore from "../../stores/ValuesStore";
import useEncryptStore from "../../stores/EncryptStore";
import { Value } from "../../db/Value";
import ModalComponent from "../../components/ModalComponent";
import InputField from "../../components/InputField";
import { decrypt, encrypt, encryptErrors } from "../../utils/encrypt";
import EditIcon from "../../svg/EditIcon";
import { UUID } from "../../types/fields";
import { useValue } from "../../contexts/ValueContext";

const valueBase = {
    name: "",
    nameError: false,
    value: "",
    valueError: false,
    type: ValueTypes.TEXT,
    expirationDate: undefined as string | undefined,
    encryptionError: false,
    encryptionKeyError: false,
}

function ValueModal(props: {section_uuid: UUID}) {
    const { setValues, openNewValue, setOpenNewValue, valueIdToEdit, setValueIdToEdit } = useValuesStore();
    const { encryptionKey } = useEncryptStore();

    const { setCurrentValue } = useValue();
    const [localValue, setLocalValue] = useState(valueBase);

    const closeValueModal = () => {
        setValueIdToEdit(undefined);
        setCurrentValue(null);
        setLocalValue(valueBase);
        setOpenNewValue(false);
    }

    // init
    const init = async () => {
        if (valueIdToEdit) {
            const value = await Value.getByUuid(valueIdToEdit!);
            const finalValue = await inputValue(value?.value as string, value?.type as ValueTypes);
            setLocalValue({
                name: value?.name ?? "",
                nameError: false,
                value: finalValue.ok ? finalValue.value : "",
                valueError: false,
                type: value?.type as ValueTypes ?? ValueTypes.TEXT,
                expirationDate: value?.expirationDate ?? undefined,
                encryptionError: false,
                encryptionKeyError: finalValue.ok === false && finalValue.error === encryptErrors.DECRYPTION_FAILED,
            });
            
        }
    }

    const inputValue = useCallback( async (value: string, type: ValueTypes): Promise<
        { ok:true, value: string} |
        { ok: false, error: encryptErrors }
    > => {
        if (type === ValueTypes.PASSWORD && encryptionKey) {
            const decryptedValue = await decrypt(value, encryptionKey);
            
            return decryptedValue === undefined
                ? { ok: false, error: encryptErrors.DECRYPTION_FAILED }
                : decryptedValue;
        }
        return { ok: true, value };
    }, [encryptionKey]);

    useEffect(() => {
        if (!openNewValue) {
            setLocalValue(valueBase);
            return;
        }    
        init();
    }, [valueIdToEdit]);

    const handleValueInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalValue((prev) => ({ ...prev, [name]: value }));   
    }

    const saveValue = async () => {
        const errors: Partial<typeof localValue> = {}

        if (!localValue.name) errors.nameError = true;
        if (!localValue.value) errors.valueError = true;
        if (localValue.type === ValueTypes.PASSWORD && encryptionKey === null) errors.encryptionError = true;

        setLocalValue((prev) => ({
            ...prev,
            ...errors 
        }));

        if (Object.keys(errors).length > 0) return;

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
                sectionUUID: props.section_uuid,
                sectionId: -1,
                name: localValue.name,
                value: finalValue,
                type: localValue.type,
                expirationDate: localValue.expirationDate,
                order: await Value.count() + 1,
            });
        }

        setLocalValue(valueBase);
        setValues(props.section_uuid);
        setCurrentValue(null);
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
                    <p className="text-error">Encryption key is required for password values.</p>
                )}
                
                {localValue.encryptionKeyError && (
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
