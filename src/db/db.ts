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
    }
}
  
export const db = new DB();
