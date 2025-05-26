import useErrorStore, { ErrorsTypes, genericError } from "../stores/ErrorStore";
import { createError } from "../utils/error";
import { db } from "./db";
import { SectionI } from "./interfaces";
import { Model } from "./Model";
import { Value } from "./Value";

const { addError } = useErrorStore.getState();

export class Section extends Model<SectionI, "id"> {
    constructor() {
        super(db.sections);
    }
  
    static async create(section: Omit<SectionI, "id" | "values">) {
      try {
        const existingSection = await db.sections.where("[projectId+name]").equals([section.projectId, section.name]).first();
        if (existingSection) {
          const project = await db.projects.get(section.projectId);
          throw new SectionGetError(`Section with name "${section.name}" already exists in project "${project?.name}"`);
        }

        const id = await db.sections.add(section);
        return { ...section, id };
        
      } catch (error) {
        SectionGetError.errorIsInstanceOf(error, (error) => {
          addError({
            id: Math.random(),
            message: error.message,
            type: ErrorsTypes.error,
            timestamp: Date.now()
          });
          throw error;
        });

        genericError("creating the section");
        throw error;

      }
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

const SectionGetError = createError("SectionGetError");
