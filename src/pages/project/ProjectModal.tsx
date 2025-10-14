import { useEffect, useState } from "react";
import ModalComponent from "../../components/ModalComponent";
import InputField from "../../components/InputField";
import TextareaField from "../../components/TextareaField";
import EditIcon from "../../svg/EditIcon";
import { Project } from "../../db/Project";
import useProjectsStore from "../../stores/ProjectsStore";
import { UUID } from "../../types/fields";
import { useProject } from "../../contexts/ProjectContext";

const projectBase = {
    name: "",
    nameError: false,
    description: "",
}

function ProjectModal (props: {project_uuid?: UUID}) {
    const edit = props.project_uuid !== undefined;

    const [openNewProject, setOpenNewProject] = useState(false);

    const [LocalProject, setLocalProject] = useState(projectBase);

    const { currentProject, setCurrentProject } = useProject();

    const { setProjects } = useProjectsStore();

    //init
    const init = async () => {
        if (edit) {
            LocalProject.name = currentProject?.name || "";
            LocalProject.description = currentProject?.description || "";
        }
    }

    useEffect(() => {
        if (!openNewProject) {
            setLocalProject(projectBase);
            return;
        }

        init();
    }, []);

    const handleProjectInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLocalProject((prev) => ({ ...prev, [name]: value }));
    }

    const saveProject = async () => {
        if (!LocalProject.name) {
            setLocalProject((prev) => ({ ...prev, nameError: true }));
            return;
        }

        if (edit) {
            await Project.update(props.project_uuid!, {
                name: LocalProject.name,
                description: LocalProject.description,
            });
            setCurrentProject({
                ...currentProject!,
                name: LocalProject.name,
                description: LocalProject.description,
            });
        } else {
            await Project.create({
                name: LocalProject.name,
                description: LocalProject.description,
                order: await Project.count() + 1,
            });
        }

        setLocalProject({
            name: "",
            nameError: false,
            description: "",
        });
        setOpenNewProject(false);
        setProjects();

    }

    return (
        <>
            <button className="btn btn-sm" onClick={()=> setOpenNewProject(true)}>
                <EditIcon className="w-4" />
                <span className="hidden @md/layout:block">{edit ? "Edit" : "New"} project</span>
            </button>
            <ModalComponent open={openNewProject} onClose={() => setOpenNewProject(false)}>
                <div className="flex flex-col gap-4">
                    <h2>{edit ? "Edit" : "Create New"} Project</h2>

                    <InputField label="Name" name="name" value={LocalProject.name} error={LocalProject.nameError} action={handleProjectInput} />
                    <TextareaField label="Description" name="description" value={LocalProject.description} action={handleProjectInput} optional />

                    <button className="btn btn-sm btn-primary" onClick={saveProject}>
                        {edit ? "Edit" : "Create"}
                    </button>
                </div>
            </ModalComponent>
        </>
    );
}

export default ProjectModal;
