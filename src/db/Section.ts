import useToastStore, { ToastsTypes, genericError } from "../stores/ErrorStore";
import { UUID } from "../types/fields";
import { createError } from "../utils/error";
import { db } from "./db";
import { SectionI } from "./interfaces";
import { Model } from "./Model";
import { Project } from "./Project";
import { Value } from "./Value";

const { addToast } = useToastStore.getState();

export class Section extends Model<SectionI, "id"> {
    constructor() {
        super(db.sections);
    }

    static async create(section: Omit<SectionI, "id" | "values">) {
      try {
        const existingSection = await db.sections.where("[projectUUID+name]").equals([section.projectUUID!, section.name]).first();
        
        const project = await Project.getByUuid(section.projectUUID!);
        if (existingSection) {
          throw new SectionGetError(`Section with name "${section.name}" already exists in project "${project?.name}"`);
        }

        section = {
          ...section,
          projectId: project?.id!,
          uuid: crypto.randomUUID()
        }

        const id = await db.sections.add(section);

        addToast({
          id: Math.random(),
          message: "Section created successfully",
          type: ToastsTypes.info,
          timestamp: Date.now()
        });

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

        if (includeRelations) section.values = await Value.getAllForSection(section.uuid!);
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
  
    static async getByUuid(uuid: UUID, includeRelations: boolean = false) {
      try {
        const section = await db.sections.where("uuid").equals(uuid).first();
        if (!section) throw new SectionGetError(`Section with uuid ${uuid} not found`);

        if (includeRelations) section.values = await Value.getAllForSection(section.uuid!);
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

    static async getAllForProject(projectUUID: UUID, includeRelations: boolean = false) {

      try {
        const project = await Project.getByUuid(projectUUID);
        if (!project) throw new SectionGetError(`Project with uuid ${projectUUID} not found`);

        const sections = await db.sections.where("projectUUID").equals(project.uuid!).toArray();
        sections.sort((a, b) => (a.order) - (b.order));
        if (includeRelations) {
          for (const section of sections) {
            section.values = await Value.getAllForSection(section.uuid!);
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

    static async update(uuid: UUID, updates: Partial<SectionI>) {
      try {
        const section = await db.sections.where("uuid").equals(uuid).first();
        if (!section) throw new SectionGetError(`Section with uuid ${uuid} not found`);

        const updateData = updates;
        delete updateData.values;
        await db.sections.update(section.id!, updateData);

        addToast({
          id: Math.random(),
          message: "Section updated successfully",
          type: ToastsTypes.info,
          timestamp: Date.now()
        });

        return this.getByUuid(section.uuid!);
        
      } catch (error) {
        genericError("updating the section");
        throw error;
        
      }
    }
  
    static async delete(uuid: UUID) {
      try {
        const section = await db.sections.where("uuid").equals(uuid).first();
        if (!section) throw new SectionGetError(`Section  not found`);

        // Deleting all values
        const values = await db.values.where("sectionUUID").equals(uuid).toArray();
        for (const value of values) {
          await db.values.delete(value.id!);
        }

        addToast({
          id: Math.random(),
          message: "Section deleted successfully",
          type: ToastsTypes.info,
          timestamp: Date.now()
        });

        return db.sections.delete(section.id!);

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
