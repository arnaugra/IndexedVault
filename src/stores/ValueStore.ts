import { create } from 'zustand';

interface ValueStore {
    valueName?: string;
    valueNameError: boolean;
    valueValue?: string | boolean;
    valueValueError: boolean;
    valueType: ValueType;
    valueExpirationDate?: string;
    setValueName: (name: string | undefined) => void;
    setValueNameError: (error: boolean) => void;
    setValueValue: (value: string | boolean | undefined) => void;
    setValueValueError: (error: boolean) => void;
    setValueType: (type: ValueType) => void;
    setValueExpirationDate: (date: string | undefined) => void;
}

enum ValueTypes {
    TEXT = "TEXT",
    PASSWORD = "PASSWORD",
    DATE = "DATE",
}

type ValueType = keyof typeof ValueTypes;

const useValueStore = create<ValueStore>((set) => ({
    valueName: undefined,
    valueNameError: false,
    valueValue: undefined,
    valueValueError: false,
    valueType: "TEXT",
    valueExpirationDate: undefined,
    setValueName: (name) => set({ valueName: name, valueNameError: false }),
    setValueNameError: (error) => set({ valueNameError: error }),
    setValueValue: (value) => set({ valueValue: value, valueValueError: false }),
    setValueValueError: (error) => set({ valueValueError: error }),
    setValueType: (type) => set({ valueType: type }),
    setValueExpirationDate: (date) => set({ valueExpirationDate: date })
}));

export default useValueStore;
export { ValueTypes };
