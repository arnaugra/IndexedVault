import ModalComponent from "../../components/ModalComponent";
import InputField from "../../components/InputField";
import useValueStore, { ValueTypes } from "../../stores/ValueStore";
import useValuesStore from "../../stores/ValuesStore";
import { useEffect, useState } from "react";
import { Value } from "../../db/Value";
import { ValueI } from "../../db/interfaces";

interface EditValueModalProps {
  open: boolean;
  section_id: number;
  value?: ValueI;
  onClose: () => void;
}

function EditValueModal (props: EditValueModalProps) {
  const [isLoadingExistingValue, setIsLoadingExistingValue] = useState(false);

  const setValues = useValuesStore((state) => state.setValues);

  const valueName = useValueStore((state) => state.valueName);
  const setValueName = useValueStore((state) => state.setValueName);
  const handleValueName = (e: React.ChangeEvent<HTMLInputElement>) => {setValueName(e.target.value); setValueNameError(false);};

  const valueNameError = useValueStore((state) => state.valueNameError);
  const setValueNameError = useValueStore((state) => state.setValueNameError);
  
  const valueValue = useValueStore((state) => state.valueValue);
  const setValueValue = useValueStore((state) => state.setValueValue);
  const handleValueValueInput = (e: React.ChangeEvent<HTMLInputElement>) => setValueValue(e.target.value);

  const valueValueError = useValueStore((state) => state.valueValueError);
  const setValueValueError = useValueStore((state) => state.setValueValueError);

  const valueType = useValueStore((state) => state.valueType);
  const setValueType = useValueStore((state) => state.setValueType);
  const handleValueType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValueType(e.target.value as ValueTypes);
    setValueValue(undefined);
    setValueValueError(false);
  }

  useEffect(() => {
    if (!isLoadingExistingValue) {
      setValueValue(undefined);
    }
  }
  , [valueType, setValueValue, isLoadingExistingValue]);

  const valueExpirationDate = useValueStore((state) => state.valueExpirationDate);
  const setValueExpirationDate = useValueStore((state) => state.setValueExpirationDate);
  const handleValueExpirationDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueExpirationDate(e.target.value);
  }

  useEffect(() => {
    if (props.open && props.value) {
      setIsLoadingExistingValue(true);
      setValueName(props.value.name);
      setValueValue(props.value.value);
      setValueType(props.value.type as ValueTypes);
      setValueExpirationDate(props.value.expirationDate ?? undefined);
      setValueNameError(false);
      setValueValueError(false);

      setTimeout(() => {
        setIsLoadingExistingValue(false);
      }, 100);
    }
  }, [props.open, props.value, setValueName, setValueValue, setValueType, setValueExpirationDate, setValueNameError, setValueValueError, isLoadingExistingValue]);

  const createNewProject = async () => {
    if (!valueName || !valueValue) {
      if (!valueName) setValueNameError(true);
      if (!valueValue) setValueValueError(true);
      return;
    }

    await Value.update(props.value!.id!, {
      sectionId: props.section_id,
      name: valueName,
      value: valueValue as string | boolean,
      type: valueType,
      expirationDate: valueExpirationDate,
    })

    setValueName(undefined)
    setValueNameError(false)
    setValueValue(undefined)
    setValueValueError(false)
    setValueType(ValueTypes.TEXT)
    setValueExpirationDate(undefined)
    setValues(props.section_id);

  }
  return (
      <ModalComponent open={props.open} onClose={props.onClose}>
          <div className="flex flex-col gap-4">
          <h2>Create a new value</h2>

          <div className="flex flex-col gap-2">
            <div className="join">
              <InputField label="Name" name="name" width="w-1/3" value={valueName} error={valueNameError} action={handleValueName} />
              <InputField label="Value" name="value" type={valueType} width="w-2/3" value={valueValue as string} error={valueValueError} action={handleValueValueInput} />
            </div>

            <div className="flex gap-3">
              <label className="form-control w-4/9">
                <span>Type</span>
                <select name="type" className="select select-bordered w-full" value={valueType} onChange={handleValueType}>
                  {
                    Object.keys(ValueTypes).map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))
                  }
                </select>
              </label>

              <InputField label="Expiration date" name="expirationDate" type="date" value={valueExpirationDate} action={handleValueExpirationDate} optional />
            </div>
            
          </div>

          <button className="btn btn-sm btn-primary" onClick={createNewProject}>Edit</button>
          </div>
      </ModalComponent>
  );
}

export default EditValueModal;
