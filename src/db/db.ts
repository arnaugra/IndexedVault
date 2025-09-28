import Dexie, { Table } from "dexie";
import { ConfigI, ProjectI, SectionI, ValueI } from "./interfaces";

export class DB extends Dexie {
    projects!: Table<ProjectI, number>;
    sections!: Table<SectionI, number>;
    values!: Table<ValueI, number>;
    config!: Table<ConfigI, number>;

    constructor() {
        super("IndexedVault");
        this.version(1).stores({
            projects: "++id, name, description",
            sections: "++id, projectId, name, description, [projectId+name]",
            values: "++id, sectionId, name, type, value, fechaExpiracion, [sectionId+name]",
            config: "++id, name, value",
        });

        this.version(2).stores({
            projects: "++id, name, description, order",
            sections: "++id, projectId, name, description, order, [projectId+name]",
            values: "++id, sectionId, name, type, value, fechaExpiracion, order, [sectionId+name]",
        }).upgrade(async() => {
            const projects = await this.projects.toArray();
            for (let i = 0; i < projects.length; i++) {
                projects[i].order = i;
            }
            await this.projects.bulkPut(projects);
            
            const sections = await this.sections.toArray();
            for (let i = 0; i < sections.length; i++) {
                sections[i].order = i;
            }
            await this.sections.bulkPut(sections);

            const values = await this.values.toArray();
            for (let i = 0; i < values.length; i++) {
                values[i].order = i;
            }
            await this.values.bulkPut(values);
        })

        // adding uuid
        this.version(3).stores({
            projects: "++id, uuid, name, description, order",
            sections: "++id, uuid, projectId, projectUUID, name, description, order, [projectId+name], [projectUUID+name]",
            values: "++id, uuid, sectionId, sectionUUID, name, type, value, fechaExpiracion, order, [sectionId+name], [sectionUUID+name]",
            config: "++id, uuid, name, value",
        }).upgrade(async() => {

            // Projects
            const projects = await this.projects.toArray();
            for (let i = 0; i < projects.length; i++) {
                if (!projects[i].uuid) {
                    projects[i].uuid = crypto.randomUUID();
                }
            }
            const projectsMap = Object.fromEntries(projects.map(project => [project.id, project.uuid]));
            await this.projects.bulkPut(projects);

            // Sections
            const sections = await this.sections.toArray();
            for (let i = 0; i < sections.length; i++) {
                if (!sections[i].uuid) {
                    sections[i].uuid = crypto.randomUUID();
                }
                sections[i].projectUUID = projectsMap[sections[i].projectId] ?? undefined;
            }
            const sectionsMap = Object.fromEntries(sections.map(section => [section.id, section.uuid]));
            await this.sections.bulkPut(sections);

            // Values
            const values = await this.values.toArray();
            for (let i = 0; i < values.length; i++) {
                if (!values[i].uuid) {
                    values[i].uuid = crypto.randomUUID();
                }
                values[i].sectionUUID = sectionsMap[values[i].sectionId] ?? undefined;
            }
            await this.values.bulkPut(values);

            // Config
            const config = await this.config.toArray();
            for (let i = 0; i < config.length; i++) {
                if (!config[i].uuid) {
                    config[i].uuid = crypto.randomUUID();
                }
            }
            await this.config.bulkPut(config);
        });
    }
}
  
export const db = new DB();
