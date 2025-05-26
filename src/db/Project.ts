import useErrorStore, { ErrorsTypes, genericError } from "../stores/ErrorStore";
import { createError } from "../utils/error";
import { db } from "./db";
import { ProjectI } from "./interfaces";
import { Model } from "./Model";
import { Section } from "./Section";

const { addError } = useErrorStore.getState()
export class Project extends Model<ProjectI, "id"> {
    constructor() {
        super(db.projects);
    }

    static async create(project: Omit<ProjectI, "id" | "sections">) {
        try {
            const existingProject = await db.projects.where("name").equals(project.name).first();
            if (existingProject) throw new ProjectGetError(`Project with name ${project.name} already exists`);

            const id = await db.projects.add(project);
            if (!id) throw new ProjectCreateError("Could not create project");

            return { ...project, id };
        } catch (error) {
            ProjectGetError.errorIsInstanceOf(error, (error) => {
                addError({
                    id: Math.random(),
                    message: error.message,
                    type: ErrorsTypes.error,
                    timestamp: Date.now()
                });
                throw error;
            });

            ProjectCreateError.errorIsInstanceOf(error, (error) => {
                addError({
                    id: Math.random(),
                    message: error.message,
                    type: ErrorsTypes.error,
                    timestamp: Date.now()
                });
                throw error;
            });

            genericError("creating the project");
            throw error;
            
        }
    }

    static async getById(id: number, includeRelations: boolean = false) {
        try {
            const project = await db.projects.get(id);
            if (!project) throw new ProjectGetError(`Project with id ${id} not found`);

            if (includeRelations) project.sections = await Section.getAllForProject(project.id!, includeRelations);
            return project;

        } catch (error) {
            ProjectGetError.errorIsInstanceOf(error, (error) => {
                addError({
                    id: Math.random(),
                    message: error.message,
                    type: ErrorsTypes.error,
                    timestamp: Date.now()
                });
                throw error;
            });

            genericError("fetching the project");
            throw error;
            
        }
    }

    static async getAll(includeRelations: boolean = false) {
        const projects = await db.projects.toArray();
        projects.sort((a, b) => (a.order) - (b.order));
        if (includeRelations) {
            for (const project of projects) {
            project.sections = await Section.getAllForProject(project.id!, includeRelations);
            }
        }
        return projects;
    }

    static async update(id: number, updates: Partial<ProjectI>) {
        const updateData = { ...updates };
        delete updateData.sections;
        await db.projects.update(id, updateData);
        return this.getById(id);
    }

    static async delete(id: number) {
        const sectionIds = (await db.sections.where("projectId").equals(id).primaryKeys()) as number[];
        for (const sid of sectionIds) {
            await Section.delete(sid);
        }
        return db.projects.delete(id);
    }

    static async count() {
        return db.projects.count();
    }
}

const ProjectGetError = createError("ProjectGetError");
const ProjectCreateError = createError("ProjectCreateError");
