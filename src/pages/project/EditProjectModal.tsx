import ModalComponent from "../../components/ModalComponent";
import InputField from "../../components/InputField";
import TextareaField from "../../components/TextareaField";
import useProjectStore from "../../stores/ProjectStore";
import { useEffect, useState } from "react";
import { Project } from "../../db/Project";
import EditIcon from "../../svg/EditIcon";

function EditProjectModal (props: {project_id: number}) {
    const [openNewProject, setOpenNewProject] = useState(false);

    const projectName = useProjectStore((state) => state.projectName);
    const setProjectName = useProjectStore((state) => state.setProjectName);
    const [newProjectName, setNewProjectName] = useState<string | undefined>();
    const handleProjectName = (e: React.ChangeEvent<HTMLInputElement>) => {setNewProjectName(e.target.value); setProjectNameError(false);};

    const projectNameError = useProjectStore((state) => state.projectNameError);
    const setProjectNameError = useProjectStore((state) => state.setProjectNameError);
    
    const projectDescription = useProjectStore((state) => state.projectDescription);
    const setProjectDescription = useProjectStore((state) => state.setProjectDescription);
    const [newProjectDescription, setNewProjectDescription] = useState<string | undefined>();
    const handleProjectDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProjectDescription(e.target.value);

    useEffect(() => {
      setNewProjectName(projectName)
      setNewProjectDescription(projectDescription)
    }
    , [openNewProject])

    const editNewProject = async () => {
      if (!projectName) {
        setProjectNameError(true);
        return;
      }
  
      await Project.update(props.project_id,{
        name: newProjectName,
        description: newProjectDescription,
      })
  
      setProjectName(newProjectName)
      setProjectDescription(newProjectDescription)
      setOpenNewProject(false)
      setProjectNameError(false)
  
    }
    return (
        <>
          <button className="btn btn-sm" onClick={()=> setOpenNewProject(!openNewProject)}><EditIcon className="w-4" /> <span className="hidden @md/layout:block">Edit project</span></button>
          <ModalComponent open={openNewProject} onClose={() => setOpenNewProject(false)}>
              <div className="flex flex-col gap-4">
              <h2>Create a new project</h2>

              <InputField label="Name" name="name" value={newProjectName} error={projectNameError} action={handleProjectName} />
              <TextareaField label="Description" name="description" value={newProjectDescription} action={handleProjectDescription} optional />

              <button className="btn btn-sm btn-primary" onClick={editNewProject}>Edit</button>
              </div>
          </ModalComponent>
        </>
    );
}

export default EditProjectModal;
