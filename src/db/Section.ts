import useToastStore, { ToastsTypes, genericError } from "../stores/ErrorStore";
import { createError } from "../utils/error";
import { db } from "./db";
import { SectionI } from "./interfaces";
import { Model } from "./Model";
import { Value } from "./Value";

const { addToast } = useToastStore.getState();

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
          addToast({
            id: Math.random(),
            message: error.message,
            type: ToastsTypes.error,
            timestamp: Date.now()
          });
          throw error;
        });

        genericError("creating the section");
        throw error;

      }
    }
  
    static async getById(id: number, includeRelations: boolean = false) {
      try {
        const section = await db.sections.get(id);
        if (!section) throw new SectionGetError(`Section not found`);

        if (includeRelations) section.values = await Value.getAllForSection(id);
        return section;

      } catch (error) {
        SectionGetError.errorIsInstanceOf(error, (error) => {
          addToast({
            id: Math.random(),
            message: error.message,
            type: ToastsTypes.error,
            timestamp: Date.now()
          });
          throw error;
        });

        genericError("fetching the section");
        throw error;
        
      }
    }
  
    static async getAllForProject(projectId: number, includeRelations: boolean = false) {

      try {
        const project = await db.projects.get(projectId);
        if (!project) throw new SectionGetError(`Project with id ${projectId} not found`);

        const sections = await db.sections.where("projectId").equals(projectId).toArray();
        sections.sort((a, b) => (a.order) - (b.order));
        if (includeRelations) {
          for (const section of sections) {
            section.values = await Value.getAllForSection(section.id!);
          }
        }

        return sections; 

      } catch (error) {
        SectionGetError.errorIsInstanceOf(error, (error) => {
          addToast({
            id: Math.random(),
            message: error.message,
            type: ToastsTypes.error,
            timestamp: Date.now()
          });
          throw error;
        });

        genericError("fetching sections for project");
        throw error;	
        
      }
    }
  
    static async update(id: number, updates: Partial<SectionI>) {
      try {
        const updateData = updates;
        delete updateData.values;
        await db.sections.update(id, updateData);
        return this.getById(id);
        
      } catch (error) {
        genericError("updating the section");
        throw error;
        
      }
    }
  
    static async delete(id: number) {
      try {
        const valueIds = (await db.values.where("sectionId").equals(id).primaryKeys()) as number[];
        for (const vid of valueIds) {
          await Value.delete(vid);
        }
        return db.sections.delete(id);
        
      } catch (error) {
        genericError("deleting the section");
        throw error;
        
      }
    }

    static async count() {
      try {
        return db.projects.count();
        
      } catch (error) {
        genericError("counting the sections");
        throw error;
      }
    }
  }

const SectionGetError = createError("SectionGetError");
