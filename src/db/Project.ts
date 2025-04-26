import { db } from "./db";
import { ProjectI } from "./interfaces";
import { Model } from "./Model";
import { Section } from "./Section";

export class Project extends Model<ProjectI, "id"> {
    constructor() {
        super(db.projects);
    }

    static async create(project: Omit<ProjectI, "id" | "sections">) {
        const id = await db.projects.add(project);
        return { ...project, id };
    }

    static async getById(id: number, includeRelations: boolean = false) {
        const project = await db.projects.get(id);
        if (project && includeRelations) {
            project.sections = await Section.getAllForProject(project.id!, includeRelations);
        }
        return project;
    }

    static async getAll(includeRelations: boolean = false) {
        const projects = await db.projects.toArray();
        if (includeRelations) {
            for (const project of projects) {
            project.sections = await Section.getAllForProject(project.id!, includeRelations);
            }
        }
        return projects;
    }

    static async update(id: number, updates: Partial<ProjectI>) {
        const { sections, ...updateData } = updates;
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
}
