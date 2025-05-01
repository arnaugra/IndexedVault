import { useEffect, useState } from "react";
import ModalComponent from "../../components/ModalComponent";
import InputField from "../../components/InputField";
import TextareaField from "../../components/TextareaField";
import EditIcon from "../../svg/EditIcon";
import { Project } from "../../db/Project";
import useProjectsStore from "../../stores/ProjectsStore";
import useProjectStore from "../../stores/ProjectStore";

const projectBase = {
    name: "",
    nameError: false,
    description: "",
}

function ProjectModal (props: {project_id?: number}) {
    const edit = props.project_id !== undefined;
    const [openNewProject, setOpenNewProject] = useState(false);

    const [LocalProject, setLocalProject] = useState(projectBase);

    const setProjects = useProjectsStore((state) => state.setProjects);
    const setProjectName = useProjectStore((state) => state.setProjectName);
    const setProjectDescription = useProjectStore((state) => state.setProjectDescription);

    useEffect(() => {
        if (!openNewProject) {
            setLocalProject(projectBase);
            return;
        }
        const init = async () => {
            if (edit) {
                await Project.getById(props.project_id!).then((project) => {
                    setLocalProject({
                        name: project?.name ?? "",
                        nameError: false,
                        description: project?.description ?? "",
                    });
                });
            }
        }

        init();
    }, [openNewProject]);

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
            await Project.update(props.project_id!, {
                name: LocalProject.name,
                description: LocalProject.description,
            });
            setProjectName(LocalProject.name);
            setProjectDescription(LocalProject.description);
        } else {
            await Project.create({
                name: LocalProject.name,
                description: LocalProject.description,
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
