import ModalComponent from "../../components/ModalComponent";
import InputField from "../../components/InputField";
import { ValueTypes } from "../../stores/ValueStore"; // Eliminamos la importación no utilizada
import useValuesStore from "../../stores/ValuesStore";
import { useEffect, useState, useCallback } from "react";
import { Value } from "../../db/Value";
import { ValueI } from "../../db/interfaces";
import useEncryptStore from "../../stores/EncryptStore";
import { decrypt, encrypt } from "../../utils/encrypt";

interface ValueModalProps {
  section_id: number;
  open?: boolean;
  value?: ValueI;
  onClose?: () => void;
}

function ValueModal(props: ValueModalProps) {
  const { section_id, value, onClose } = props;

  const isEditMode = !!value;
  const [internalOpen, setInternalOpen] = useState(false);
  const modalOpen = props.open !== undefined ? props.open : internalOpen;

  const [formState, setFormState] = useState({
    name: '',
    value: '',
    type: ValueTypes.TEXT,
    expirationDate: undefined as string | undefined,
    nameError: false,
    valueError: false,
    encryptionError: false,
    decryptionError: false,
    isLoading: false
  });

  const setValues = useValuesStore((state) => state.setValues);
  const encryptionKey = useEncryptStore((state) => state.encryptionKey);

  const resetForm = useCallback(() => {
    setFormState({
      name: '',
      value: '',
      type: ValueTypes.TEXT,
      expirationDate: undefined,
      nameError: false,
      valueError: false,
      encryptionError: false,
      decryptionError: false,
      isLoading: false
    });
  }, []);

  const handleChange = useCallback((field: string, value: any) => {
    setFormState(prev => {
      const newState = { ...prev, [field]: value };

      // reset specific errors
      if (field === 'name') newState.nameError = false;
      if (field === 'value') {
        newState.valueError = false;
        newState.encryptionError = false;
      }
      
      // reset value when type changes
      if (field === 'type' && !prev.isLoading) {
        newState.value = '';
        newState.valueError = false;
      }
      
      return newState;
    });
  }, []);

  useEffect(() => {
    const loadEditData = async () => {
      if (isEditMode && modalOpen && value) {
        setFormState(prev => ({
          ...prev,
          isLoading: true
        }));
        
        try {
          let decryptedValue = value.value as string;

          if (value.type === ValueTypes.PASSWORD && encryptionKey) {
            try {
              decryptedValue = await decrypt(decryptedValue as string, encryptionKey as string) as string;
            } catch (error) {
              console.error("Error decrypting value:", error);

              setFormState(prev => ({
                ...prev,
                decryptionError: true,
                isLoading: false
              }));
              return;
            }
          }
          
          setFormState({
            name: value.name,
            value: decryptedValue,
            type: value.type as ValueTypes,
            expirationDate: value.expirationDate ?? undefined,
            nameError: false,
            valueError: false,
            encryptionError: false,
            decryptionError: false,
            isLoading: false
          });
        } catch (error) {
          console.error("Error loading value:", error);
          setFormState(prev => ({
            ...prev,
            isLoading: false
          }));
        }
      }
    };
    
    if (isEditMode && modalOpen && value) {
      loadEditData();
    } else if (!modalOpen) {
      resetForm();
    }
  }, [isEditMode, modalOpen, value, encryptionKey, resetForm]);

  // Guardar valor
  const handleSave = useCallback(async () => {
    const { name, value: valueData, type, expirationDate } = formState;
    const errors = { nameError: false, valueError: false, encryptionError: false };
    
    // Validación
    if (!name) errors.nameError = true;
    if (!valueData) errors.valueError = true;
    if (type === ValueTypes.PASSWORD && !encryptionKey) errors.encryptionError = true;
    
    if (errors.nameError || errors.valueError || errors.encryptionError) {
      setFormState(prev => ({ ...prev, ...errors }));
      return;
    }

    try {
      // Encriptar si es PASSWORD
      let finalValue = valueData;
      if (type === ValueTypes.PASSWORD && encryptionKey) {
        finalValue = await encrypt(valueData, encryptionKey as string); // Forzamos como string para evitar undefined
      }

      // Guardar en base de datos
      if (isEditMode && value) {
        await Value.update(value.id!, {
          sectionId: section_id,
          name,
          value: finalValue,
          type,
          expirationDate,
        });
      } else {
        await Value.create({
          sectionId: section_id,
          name,
          value: finalValue,
          type,
          expirationDate,
        });
      }

      resetForm();
      setValues(section_id);

      if (isEditMode && onClose) {
        onClose();
      } else {
        setInternalOpen(false);
      }
    } catch (error) {
      console.error("Error saving value:", error);
    }
  }, [formState, isEditMode, value, section_id, encryptionKey, resetForm, setValues, onClose]);

  const handleClose = useCallback(() => {
    if (isEditMode && onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  }, [isEditMode, onClose]);

  return (
    <>
      {/* Botón para modo creación */}
      {!isEditMode && (
        <button className="btn btn-sm" onClick={() => setInternalOpen(true)}>
          New value
        </button>
      )}

      {/* Modal */}
      <ModalComponent open={modalOpen} onClose={handleClose}>
        <div className="flex flex-col gap-4">
          <h2>{isEditMode ? "Edit value" : "Create a new value"}</h2>

          <div className="flex flex-col gap-2">
            <div className="join">
              <InputField 
                label="Name" 
                name="name" 
                width="w-1/3" 
                value={formState.name} 
                error={formState.nameError} 
                action={(e) => handleChange('name', e.target.value)} 
              />
              <InputField 
                label="Value" 
                name="value" 
                type={formState.type} 
                width="w-2/3" 
                value={formState.value} 
                error={formState.valueError} 
                action={(e) => handleChange('value', e.target.value)} 
              />
            </div>

            <div className="flex gap-3">
              <label className="form-control w-4/9">
                <span>Type</span>
                <select 
                  name="type" 
                  className="select select-bordered w-full" 
                  value={formState.type} 
                  onChange={(e) => handleChange('type', e.target.value as ValueTypes)}
                >
                  {Object.keys(ValueTypes).map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </label>

              <InputField 
                label="Expiration date" 
                name="expirationDate" 
                type="date" 
                value={formState.expirationDate} 
                action={(e) => handleChange('expirationDate', e.target.value)} 
                optional 
              />
            </div>
          </div>

          {formState.encryptionError && (
            <p className="text-error">Encryption key is required for password values</p>
          )}
          
          {formState.decryptionError && (
            <p className="text-error">Could not decrypt password. Please check your encryption key.</p>
          )}

          <button 
            className="btn btn-sm btn-primary" 
            onClick={handleSave}
            disabled={formState.isLoading || formState.decryptionError}
          >
            {isEditMode ? "Edit" : "Create"}
          </button>
        </div>
      </ModalComponent>
    </>
  );
}

export default ValueModal;
