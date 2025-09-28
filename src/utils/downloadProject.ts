import { db } from "../db/db";
import { Project } from "../db/Project";
import useToastStore, { genericError, ToastsTypes } from "../stores/ErrorStore";
import { UUID } from "../types/fields";
import { createError } from "./error";
import { z } from "zod";

const { addToast } = useToastStore.getState()

export async function downloadProject(uuid: UUID) {
    const project = await Project.getByUuid(uuid, true);
    if (!project) throw new BackupProjectError("Project not found");

    const blob = new Blob([JSON.stringify({ project })], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `project_${project.uuid}_${project.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export async function uploadProject(file: File) {
    file.text().then(async (text) => {
        try {
            const importedProject = JSON.parse(text);
            const validation = ProjectSchema.parse(importedProject);
            if (!validation) {
                throw new BackupProjectValidatorError("Invalid project structure");
            }
            const projectCheck = await db.projects.where("uuid").equals(importedProject.project.uuid).first();
            if (projectCheck) {
                throw new BackupProjectExistError("Project with the same UUID already exists");
            }

            const { project } = importedProject;
            const projectId = await Project.create({
                name: project.name,
                description: project.description,
                uuid: project.uuid,
                order: project.order,
            });

            for (const section of project.sections) {
                const sectionId = await db.sections.add({
                    name: section.name,
                    description: section.description,
                    order: section.order,
                    projectId: projectId.id,
                    projectUUID: projectId.uuid,
                    uuid: section.uuid,
                });

                for (const value of section.values) {
                    await db.values.add({
                        name: value.name,
                        type: value.type,
                        value: value.value,
                        expirationDate: value.expirationDate,
                        order: value.order,
                        sectionId: sectionId,
                        sectionUUID: section.uuid,
                        uuid: value.uuid,
                    });
                }
            }
            
        } catch (error) {
            BackupProjectValidatorError.errorIsInstanceOf(error, (error) => {
                addToast({
                    id: Math.random(),
                    message: error.message,
                    type: ToastsTypes.error,
                    timestamp: Date.now()
                });
                throw error;
            })
            BackupProjectExistError.errorIsInstanceOf(error, (error) => {
                addToast({
                    id: Math.random(),
                    message: error.message,
                    type: ToastsTypes.error,
                    timestamp: Date.now()
                });
                throw error;
            })
            genericError("uploading the project");
        }
    });
}

export const ProjectSchema = z.object({
    project: z.object({
        name: z.string(),
        description: z.string(),
        order: z.number(),
        uuid: z.string().uuid(),
        id: z.number(),
        sections: z.array(
            z.object({
                name: z.string(),
                description: z.string(),
                projectId: z.number(),
                projectUUID: z.string().uuid(),
                order: z.number(),
                uuid: z.string().uuid(),
                id: z.number(),
                values: z.array(
                    z.object({
                        sectionUUID: z.string().uuid(),
                        sectionId: z.number(),
                        name: z.string(),
                        value: z.string(),
                        type: z.string(),
                        order: z.number(),
                        uuid: z.string().uuid(),
                        id: z.number(),
                    })
                ),
            })
        ),
    }),
});

const BackupProjectError = createError("BackupProjectError");
const BackupProjectValidatorError = createError("BackupProjectValidatorError");
const BackupProjectExistError = createError("BackupProjectExistError");