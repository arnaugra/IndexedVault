export interface ProjectI {
    id?: number;
    name: string;
    description?: string;
    sections?: SectionI[];
    order: number;
}

export interface SectionI {
    id?: number;
    projectId: number;
    name: string;
    description?: string;
    values?: ValueI[];
    order: number;
}

export interface ValueI {
    id?: number;
    sectionId: number;
    name: string;
    type: string;
    value: string;
    expirationDate?: string;
    order: number;
}

export interface ConfigI {
    id?: number;
    name: string;
    value: string | boolean;
}