import { UUID } from "../types/fields";

export interface ProjectI {
    id?: number;
    uuid?: UUID;
    name: string;
    description?: string;
    sections?: SectionI[];
    order: number;
}

export interface SectionI {
    id?: number;
    uuid?: UUID;
    projectId: number;
    projectUUID?: UUID;
    name: string;
    description?: string;
    values?: ValueI[];
    order: number;
}

export interface ValueI {
    id?: number;
    uuid?: UUID;
    sectionId: number;
    sectionUUID?: UUID;
    name: string;
    type: string;
    value: string;
    expirationDate?: string;
    order: number;
}

export interface ConfigI {
    id?: number;
    uuid?: UUID;
    name: string;
    value: string | boolean;
}