import useToastStore, { ToastsTypes, genericError } from "../stores/ErrorStore";
import { UUID } from "../types/fields";
import { createError } from "../utils/error";
import { db } from "./db";
import { ValueI } from "./interfaces";
import { Model } from "./Model";
import { Section } from "./Section";

const { addToast } = useToastStore.getState();

export class Value extends Model<ValueI, "id"> {
    constructor() {
        super(db.values);
    }
  
    static async create(value: Omit<ValueI, "id">) {
        try {
            const existingValue = await db.values.where("[sectionUUID+name]").equals([value.sectionUUID!, value.name]).first();
            const section = await Section.getByUuid(value.sectionUUID!);
            if (existingValue) {
                throw new ValueGetError(`Value with name "${value.name}" already exists in section ${section.name}`);
            }

            value = {
                ...value,
                sectionId: section?.id!,
                uuid: crypto.randomUUID()
            }

            const id = await db.values.add(value);

            addToast({
                id: Math.random(),
                message: "Value created successfully",
                type: ToastsTypes.info,
                timestamp: Date.now()
            });

            return { ...value, id };

        } catch (error) {
            ValueGetError.errorIsInstanceOf(error, (error) => {
                addToast({
                    id: Math.random(),
                    message: error.message,
                    type: ToastsTypes.error,
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
                addToast({
                    id: Math.random(),
                    message: error.message,
                    type: ToastsTypes.error,
                    timestamp: Date.now()
                });
                throw error;
            });

            genericError("fetching the value");
            throw error;
            
        }
    }

    static async getByUuid(uuid: UUID) {
        try {
            const value = await db.values.where("uuid").equals(uuid).first();
            if (!value) throw new ValueGetError(`Value not found`);
            return value;
        } catch (error) {
            ValueGetError.errorIsInstanceOf(error, (error) => {
                addToast({
                    id: Math.random(),
                    message: error.message,
                    type: ToastsTypes.error,
                    timestamp: Date.now()
                });
                throw error;
            });

            genericError("fetching the value");
            throw error;

        }
    }

    static async getAllForSection(sectionUUID: UUID) {
        try {
            const section = await db.sections.where("uuid").equals(sectionUUID).first();
            if (!section) throw new ValueGetError(`Section with uuid ${sectionUUID} not found`);

            const values = await db.values.where("sectionUUID").equals(section.uuid!).toArray();
            values.sort((a, b) => (a.order) - (b.order));

            return values;
        } catch (error) {
            ValueGetError.errorIsInstanceOf(error, (error) => {
                addToast({
                    id: Math.random(),
                    message: error.message,
                    type: ToastsTypes.error,
                    timestamp: Date.now()
                });
                throw error;
            });

            genericError("fetching values for section");
            throw error;
            
        }
    }

    static async update(uuid: UUID, updates: Partial<ValueI>) {
        try {
            const value = await db.values.where("uuid").equals(uuid).first();
            if (!value) throw new ValueGetError(`Value with uuid ${uuid} not found`);

            await db.values.update(value.id!, updates);

            addToast({
                id: Math.random(),
                message: "Value updated successfully",
                type: ToastsTypes.info,
                timestamp: Date.now()
            });

            return this.getByUuid(value.uuid!);

        } catch (error) {
            genericError("updating the value");
            throw error;

        }
    }

    static async delete(uuid: UUID) {
        try {
            const value = await db.values.where("uuid").equals(uuid).first();
            if (!value) throw new ValueGetError(`Value not found`);

            addToast({
                id: Math.random(),
                message: "Value deleted successfully",
                type: ToastsTypes.info,
                timestamp: Date.now()
            });

            return db.values.delete(value.id!);
        } catch (error) {
            genericError("deleting the value");
            throw error;
        }
    }

    static async count() {
        try {
            return db.projects.count();
        } catch (error) {
            genericError("counting values");
            throw error;
        }
    }

}

const ValueGetError = createError("ValueGetError");