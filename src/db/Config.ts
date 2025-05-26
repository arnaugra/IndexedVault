import useErrorStore, { ErrorsTypes, genericError } from "../stores/ErrorStore";
import { createError } from "../utils/error";
import { db } from "./db";
import { ConfigI } from "./interfaces";
import { Model } from "./Model";

const { addError } = useErrorStore.getState()

export class Config extends Model<ConfigI, "id"> {
    constructor() {
        super(db.config);
    }

    static async create(value: Omit<ConfigI, "id">) {
        try {
            const existingConfig = await db.config.where("name").equals(value.name).first();

            if (existingConfig && existingConfig.id) {
                return await db.config.update(existingConfig.id, value)
            } else {
                return await db.config.add(value);
            }

        } catch (error) {
            genericError("creating the configuration");
            throw error;

        }
    }

    static async getByName(name: string) {
        try {
            const conf = await db.config.where("name").equals(name).first();
            if (!conf) throw new ConfigGetError(`Configuration with name ${name} not found`);
            return conf;

        } catch (error) {
            ConfigGetError.errorIsInstanceOf(error, (error) => {
                addError({
                    id: Math.random(),
                    message: error.message,
                    type: ErrorsTypes.error,
                    timestamp: Date.now()
                });
                throw error;
            })

            genericError("fetching the configuration");
            throw error;

        }
    }

    static async delete(id: number) {
        try {
            const existingConfig = await db.config.get(id);
            if (!existingConfig) throw new ConfigDeleteError(`Configuration with id ${id} not found`);
            return db.config.delete(id);

        } catch (error) {
            ConfigDeleteError.errorIsInstanceOf(error, (error) => {
                addError({
                    id: Math.random(),
                    message: error.message,
                    type: ErrorsTypes.error,
                    timestamp: Date.now()
                });
                throw error;
            });

            genericError("deleting the configuration");
            throw error;
            
        }
        
    }
}

const ConfigGetError = createError("ConfigGetError");
const ConfigDeleteError = createError("ConfigDeleteError");
