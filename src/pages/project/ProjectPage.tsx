import { Link, useLocation, useRoute } from "wouter";
import useProjectStore from "../../stores/ProjectStore";
import { Project } from "../../db/Project";
import { useEffect, useState } from "react";
import ProjectModal from "./ProjectModal";
import BinIcon from "../../svg/BinIcon";
import useSectionsStore from "../../stores/SectionsStore";
import NewSectionModal from "./NewSectionModal";
import ConfirmModalComponent from "../../components/ConfirmModalComponent";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent";

function ProjectPage() {
    const [, navigate] = useLocation();
    const match = useRoute<{project_id: string}>("/project/:project_id")[1];
    const project_id = Number(match?.project_id);

    const setProjectName = useProjectStore((state) => state.setProjectName);
    const projectDescription = useProjectStore((state) => state.projectDescription);
    const setProjectDescription = useProjectStore((state) => state.setProjectDescription);

    const sections = useSectionsStore((state) => state.sections);
    const setSections = useSectionsStore((state) => state.setSections);

;
    useEffect(() => {
        const fetchProject = async () => {
            const pageProject = await Project.getById(project_id);

            if (pageProject) {
                setProjectName(pageProject.name);
                setProjectDescription(pageProject.description);
            } else {
                navigate("/404");
            }
            
        }
        fetchProject();
        setSections(project_id);
    }, [project_id, setSections, setProjectName, setProjectDescription, navigate]);

    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const deleteProject = async () => {
        await Project.delete(project_id);
        navigate("/");
    };

  return (
    <section id="page">
        <article className="head-r">
            <div className="flex justify-between items-center w-full">

                <div className="w-5/8">
                    <BreadcrumbsComponent project_id={project_id}/>
                </div>

                <div className="flex gap-2 shrink-0">
                    <ProjectModal project_id={project_id} />
                    <button className="btn btn-sm btn-error" onClick={() => setOpenConfirmationModal(!openConfirmationModal)}><BinIcon className="w-4" /> <span className="hidden @md/layout:block">Delete project</span></button>
                    <ConfirmModalComponent open={openConfirmationModal} onConfirm={deleteProject} onCancel={() => setOpenConfirmationModal(false)}>
                        <p>You are about to delete this project.</p>
                        <p>All its sections and values will be permanently deleted. This action connot be undone.</p>
                        <p>Are you sure?</p>
                    </ConfirmModalComponent>
                </div>
            </div>
            {projectDescription && <p className="text-gray-600 mt-1 whitespace-pre-line">{projectDescription}</p>}
            <div className="divider m-0"></div>
            <span>
                <NewSectionModal project_id={project_id} />
            </span>
        </article>
        <article className="content">

            {sections.length === 0
                ? <p className="text-gray-600">No sections found.</p>
                : sections.map((section) => (
                    <Link href={`/project/${project_id}/section/${section.id}`} key={section.id} className="card bg-base-200 border-base-300 rounded-box w-full h-full border p-4">
                        <h2 className="line-clamp-1">{section.name}</h2>
                        {section.description && <p className="text-gray-600 line-clamp-2">{section.description}</p>}
                    </Link>
                ))
            }
        </article>
    </section>
  );
}

export default ProjectPage;
