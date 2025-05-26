import useErrorStore, { ErrorsTypes, genericError } from "../stores/ErrorStore";
import { createError } from "../utils/error";
import { db } from "./db";
import { ValueI } from "./interfaces";
import { Model } from "./Model";

const { addError } = useErrorStore.getState();

export class Value extends Model<ValueI, "id"> {
    constructor() {
        super(db.values);
    }
  
    static async create(value: Omit<ValueI, "id">) {
        try {
            const existingValue = await db.values.where("[sectionId+name]").equals([value.sectionId, value.name]).first();
            if (existingValue) throw new ValueGetError(`Value with name "${value.name}" already exists in section with ID ${value.sectionId}`);

            const id = await db.values.add(value);
            return { ...value, id };

        } catch (error) {
            ValueGetError.errorIsInstanceOf(error, (error) => {
                addError({
                    id: Math.random(),
                    message: error.message,
                    type: ErrorsTypes.error,
                    timestamp: Date.now()
                });
                throw error;
            });
            genericError("creating the value");
            throw error;
            
        }
    }
  
    static async getById(id: number) {
        try {
            const value = await db.values.get(id);
            if (!value) throw new ValueGetError(`Value not found`);
            return value;
        } catch (error) {
            ValueGetError.errorIsInstanceOf(error, (error) => {
                addError({
                    id: Math.random(),
                    message: error.message,
                    type: ErrorsTypes.error,
                    timestamp: Date.now()
                });
                throw error;
            });

            genericError("fetching the value");
            throw error;
            
        }
    }
  
    static async getAllForSection(sectionId: number) {
        try {
            const section = await db.sections.get(sectionId);
            if (!section) throw new ValueGetError(`Section with id ${sectionId} not found`);

            const values = await db.values.where("sectionId").equals(sectionId).toArray();
            values.sort((a, b) => (a.order) - (b.order));

            return values;
        } catch (error) {
            ValueGetError.errorIsInstanceOf(error, (error) => {
                addError({
                    id: Math.random(),
                    message: error.message,
                    type: ErrorsTypes.error,
                    timestamp: Date.now()
                });
                throw error;
            });

            genericError("fetching values for section");
            throw error;
            
        }
    }
  
    static async update(id: number, updates: Partial<ValueI>) {
        await db.values.update(id, updates);
        return db.values.get(id);
    }
  
    static async delete(id: number) {
        return db.values.delete(id);
    }

    static async count() {
        return db.projects.count();
    }
}

const ValueGetError = createError("ValueGetError");