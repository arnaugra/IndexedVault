import { db } from "./db";
import { ValueI } from "./interfaces";
import { Model } from "./Model";

export class Value extends Model<ValueI, "id"> {
    constructor() {
        super(db.values);
    }
  
    static async create(value: Omit<ValueI, "id">) {
        const id = await db.values.add(value);
        return { ...value, id };
    }
  
    static async getById(id: number) {
        return db.values.get(id);
    }
  
    static async getAllForSection(sectionId: number) {
        return db.values.where("sectionId").equals(sectionId).toArray();
    }
  
    static async update(id: number, updates: Partial<ValueI>) {
        await db.values.update(id, updates);
        return db.values.get(id);
    }
  
    static async delete(id: number) {
        return db.values.delete(id);
    }
}