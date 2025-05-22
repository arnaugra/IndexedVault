import { db } from "./db";
import { SectionI } from "./interfaces";
import { Model } from "./Model";
import { Value } from "./Value";

export class Section extends Model<SectionI, "id"> {
    constructor() {
        super(db.sections);
    }
  
    static async create(section: Omit<SectionI, "id" | "values">) {
      const id = await db.sections.add(section);
      return { ...section, id };
    }
  
    static async getById(id: number, includeRelations: boolean = false) {
      const section = await db.sections.get(id);
      if (section && includeRelations) {
        section.values = await Value.getAllForSection(id);
      }
      return section;
    }
  
    static async getAllForProject(projectId: number, includeRelations: boolean = false) {
      const sections = await db.sections.where("projectId").equals(projectId).toArray();
      sections.sort((a, b) => (a.order) - (b.order));
      if (includeRelations) {
        for (const section of sections) {
          section.values = await Value.getAllForSection(section.id!);
        }
      }
      return sections;
    }
  
    static async update(id: number, updates: Partial<SectionI>) {
      const updateData = updates;
      delete updateData.values;
      await db.sections.update(id, updateData);
      return this.getById(id);
    }
  
    static async delete(id: number) {
      const valueIds = (await db.values.where("sectionId").equals(id).primaryKeys()) as number[];
      for (const vid of valueIds) {
        await Value.delete(vid);
      }
      return db.sections.delete(id);
    }

    static async count() {
        return db.projects.count();
    }
  }