import { Link, useLocation, useRoute } from "wouter";
import FolderIcon from "../svg/FolderIcon";
import FileIcon from "../svg/FileIcon";
import { useEffect } from "react";
import useSideTreeStore from "../stores/SideTreeStore";
import useProjectsStore from "../stores/ProjectsStore";
import useSectionsStore from "../stores/SectionsStore";
import useProjectStore from "../stores/ProjectStore";
import useSectionStore from "../stores/SectionStore";

function SideTree() {
    const [location] = useLocation();
    const match = useRoute<{project_id: string}>("/project/:project_id")[1];
    const matchSection = useRoute<{project_id: string}>("/project/:project_id/section/:section_id")[1];
    const project_id = Number(match?.project_id || matchSection?.project_id);

    const tree = useSideTreeStore((state) => state.tree);
    const setTree = useSideTreeStore((state) => state.setTree);

    const projects = useProjectsStore((state) => state.projects);
    const sections = useSectionsStore((state) => state.sections);
    const projectName = useProjectStore((state) => state.projectName);
    const projectDescription = useProjectStore((state) => state.projectDescription);
    const sectionName = useSectionStore((state) => state.sectionName);
    const sectionDescription = useSectionStore((state) => state.sectionDescription);

    useEffect(() => {
        setTree();
    }
    , [
        setTree,
        projects, projectName, projectDescription,
        sections, sectionName, sectionDescription,
    ]);

  return (
    <ul className="menu w-full">
        <li>
        {tree.length === 0
            ?   <span className="flex gap-2 items-center pointer-events-none italic menu-hover rounded">
                    No projects found
                </span>
            :   tree.map((project) => (
                    <details key={project.id} open={project.id === Number(project_id)}>
                        <summary className={location === `/project/${project.id}` ? "menu-hover rounded" : ""}>

                            <Link href={`/project/${project.id}`} className={(active) => (active ? "active-link-menu-project" : "")}>
                                <span className="flex gap-2 items-center">
                                    <FolderIcon className="w-3 shrink-0" /> <p className="line-clamp-1">{project.name}</p>
                                </span>
                            </Link>

                        </summary>
                        <ul>
                            {project.sections?.length === 0
                                ? <li className="menu-hover rounded">
                                    <span className="flex gap-2 items-center pointer-events-none italic">
                                        No sections found
                                    </span>
                                </li>
                                : project.sections?.map((section) => (
                                <li key={`${project.id}-${section.id}`} className={location === `/project/${project.id}/section/${section.id}` ? "menu-hover rounded" : ""}>

                                    <Link href={`/project/${project.id}/section/${section.id}`} className={(active) => (active ? "active-link-menu-section" : "")}>
                                        <span className="flex gap-2 items-center">
                                            <FileIcon className="w-3 shrink-0" /> <p className="line-clamp-1">{section.name}</p>
                                        </span>
                                    </Link>

                                </li>
                            ))}
                        </ul>
                    </details>
                ))}
        </li>
    </ul>
  );
}

export default SideTree;
