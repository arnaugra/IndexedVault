import ModalComponent from "../../components/ModalComponent";
import InputField from "../../components/InputField";
import TextareaField from "../../components/TextareaField";
import useProjectStore from "../../stores/ProjectStore";
import { useEffect, useState } from "react";
import { Project } from "../../db/Project";
import useProjectsStore from "../../stores/ProjectsStore";

function NewProjectModal () {
    const [openNewProject, setOpenNewProject] = useState(false);

    const setProjects = useProjectsStore((state) => state.setProjects);

    const projectName = useProjectStore((state) => state.projectName);
    const setProjectName = useProjectStore((state) => state.setProjectName);
    const handleProjectName = (e: React.ChangeEvent<HTMLInputElement>) => {setProjectName(e.target.value); setProjectNameError(false);};

    const projectNameError = useProjectStore((state) => state.projectNameError);
    const setProjectNameError = useProjectStore((state) => state.setProjectNameError);
    
    const projectDescription = useProjectStore((state) => state.projectDescription);
    const setProjectDescription = useProjectStore((state) => state.setProjectDescription);
    const handleProjectDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => setProjectDescription(e.target.value);

    useEffect(() => {
        setProjectName(undefined)
        setProjectDescription(undefined)
        setProjectNameError(false)
    }
    , [openNewProject])
  
    const createNewProject = async () => {
      if (!projectName) {
        setProjectNameError(true);
        return;
      }
  
      await Project.create({
        name: projectName,
        description: projectDescription,
      })
  
      setProjectName(undefined)
      setProjectDescription(undefined)
      setProjectNameError(false)
      setOpenNewProject(false)
      setProjects()

    }
    return (
        <>
          <button className="btn btn-sm" onClick={()=> setOpenNewProject(!openNewProject)}>New project</button>
          <ModalComponent open={openNewProject} onClose={() => setOpenNewProject(false)}>
              <div className="flex flex-col gap-4">
              <h2>Create a new project</h2>

              <InputField label="Name" name="name" value={projectName ?? ""} error={projectNameError} action={handleProjectName} />
              <TextareaField label="Description" name="description" value={projectDescription ?? ""} action={handleProjectDescription} optional />

              <button className="btn btn-sm btn-primary" onClick={createNewProject}>Create</button>
              </div>
          </ModalComponent>
        </>
    );
}

export default NewProjectModal;