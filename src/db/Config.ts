import { db } from "./db";
import { ConfigI } from "./interfaces";
import { Model } from "./Model";

export class Config extends Model<ConfigI, "id"> {
    constructor() {
        super(db.config);
    }

    static async create(value: Omit<ConfigI, "id">) {
        const existingConfig = await db.config.where("name").equals(value.name).first();

        if (existingConfig && existingConfig.id) {
            return await db.config.update(existingConfig.id, value)
        } else {
            return await db.config.add(value);
        }

    }

    static async getByName(name: string) {
        return db.config.where("name").equals(name).first();
    }

    static async update(id: number, updates: Partial<ConfigI>) {
        await db.config.update(id, updates);
        return db.config.get(id);
    }

    static async delete(id: number) {
        return db.config.delete(id);
    }
}