import ModalComponent from "../../components/ModalComponent";
import InputField from "../../components/InputField";
import useValueStore, { ValueTypes } from "../../stores/ValueStore";
import useValuesStore from "../../stores/ValuesStore";
import { useEffect, useState } from "react";
import { Value } from "../../db/Value";

function ValueModal (props: {section_id: number}) {
  const [openValue, setOpenValue] = useState(false);

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
  const handleValueType = (e: React.ChangeEvent<HTMLSelectElement>) => setValueType(e.target.value as ValueTypes);

  useEffect(() => {
    setValueValue(undefined);
  }
  , [valueType])

  const valueExpirationDate = useValueStore((state) => state.valueExpirationDate);
  const setValueExpirationDate = useValueStore((state) => state.setValueExpirationDate);
  const handleValueExpirationDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueExpirationDate(e.target.value);
  }

  useEffect(() => {
    setValueName(undefined)
    setValueNameError(false)
    setValueValue(undefined)
    setValueValueError(false)
    setValueType(ValueTypes.TEXT)
    setValueExpirationDate(undefined)
  }
  , [openValue])

  const createNewProject = async () => {
    if (!valueName || !valueValue) {
      if (!valueName) setValueNameError(true);
      if (!valueValue) setValueValueError(true);
      return;
    }

    await Value.create({
      sectionId: props.section_id,
      name: valueName,
      value: valueValue,
      type: valueType,
      expirationDate: valueExpirationDate,
    })

    setValueName(undefined)
    setValueNameError(false)
    setValueValue(undefined)
    setValueValueError(false)
    setValueType(ValueTypes.TEXT)
    setValueExpirationDate(undefined)
    setOpenValue(false)
    setValues(props.section_id);

  }
  return (
      <>
        <button className="btn btn-sm" onClick={()=> setOpenValue(!openValue)}>New value</button>
        <ModalComponent open={openValue} onClose={() => setOpenValue(false)}>
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
      </>
  );
}

export default ValueModal;
