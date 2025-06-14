import useToastStore, { ToastsTypes, genericError } from "../stores/ErrorStore";
import { createError } from "../utils/error";
import { db } from "./db";
import { ProjectI } from "./interfaces";
import { Model } from "./Model";
import { Section } from "./Section";

const { addToast } = useToastStore.getState()
export class Project extends Model<ProjectI, "id"> {
    constructor() {
        super(db.projects);
    }

    static async create(project: Omit<ProjectI, "id" | "sections">) {
        try {
            const existingProject = await db.projects.where("name").equals(project.name).first();
            if (existingProject) throw new ProjectGetError(`Project with name ${project.name} already exists`);

            const id = await db.projects.add(project);

            addToast({
                id: Math.random(),
                message: "Project created successfully",
                type: ToastsTypes.info,
                timestamp: Date.now()
            });

            return { ...project, id };
        } catch (error) {
            ProjectGetError.errorIsInstanceOf(error, (error) => {
                addToast({
                    id: Math.random(),
                    message: error.message,
                    type: ToastsTypes.error,
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
                addToast({
                    id: Math.random(),
                    message: error.message,
                    type: ToastsTypes.error,
                    timestamp: Date.now()
                });
                throw error;
            });

            genericError("fetching the project");
            throw error;
            
        }
    }

    static async getAll(includeRelations: boolean = false) {
        try {
            const projects = await db.projects.toArray();
            if (!projects) throw new ProjectGetError("No projects found");

            projects.sort((a, b) => (a.order) - (b.order));
            if (includeRelations) {
                for (const project of projects) {
                    project.sections = await Section.getAllForProject(project.id!, includeRelations);
                }
            }
            return projects;

        } catch (error) {
            ProjectGetError.errorIsInstanceOf(error, (error) => {
                addToast({
                    id: Math.random(),
                    message: error.message,
                    type: ToastsTypes.error,
                    timestamp: Date.now()
                });
                throw error;

            });

            genericError("fetching all projects");
            throw error;
            
        }
    }

    static async update(id: number, updates: Partial<ProjectI>) {
        try {
            const updateData = { ...updates };
            delete updateData.sections;
            await db.projects.update(id, updateData);

            addToast({
                id: Math.random(),
                message: "Project updated successfully",
                type: ToastsTypes.info,
                timestamp: Date.now()
            });

            return this.getById(id);
            
        } catch (error) {
            genericError("updating the project");
            throw error;
            
        }
    }

    static async delete(id: number) {
        try {
            const sectionIds = (await db.sections.where("projectId").equals(id).primaryKeys()) as number[];
            for (const sid of sectionIds) {
                await db.sections.delete(sid);
            }

            addToast({
                id: Math.random(),
                message: "Project deleted successfully",
                type: ToastsTypes.info,
                timestamp: Date.now()
            });

            return db.projects.delete(id);

        } catch (error) {
            genericError("deleting the project");
            throw error;
            
        }
    }

    static async count() {
        try {
            return db.projects.count();

        } catch (error) {
            genericError("counting the projects");
            throw error;

        }
    }
}

const ProjectGetError = createError("ProjectGetError");
