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
    }
}
  
export const db = new DB();
