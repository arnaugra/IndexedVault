import { Link, useLocation, useRoute } from "wouter";
import FolderIcon from "../svg/FolderIcon";
import FileIcon from "../svg/FileIcon";
import TextIcon from "../svg/TextIcon";
import CalendarIcon from "../svg/CalendarIcon";
import PasswordIcon from "../svg/PasswordIcon";
import { useEffect } from "react";
import useSideTreeStore from "../stores/SideTreeStore";
import useProjectsStore from "../stores/ProjectsStore";
import useSectionsStore from "../stores/SectionsStore";
import useProjectStore from "../stores/ProjectStore";
import useSectionStore from "../stores/SectionStore";
import useValuesStore from "../stores/ValuesStore";
import { ValueTypes } from "../stores/ValueStore";

function SideTree() {
    const [location] = useLocation();
    const match = useRoute<{project_id: string}>("/project/:project_id")[1];
    const matchSection = useRoute<{project_id: string, section_id: string}>("/project/:project_id/section/:section_id")[1];
    const project_id = Number(match?.project_id || matchSection?.project_id);
    const section_id = Number(matchSection?.section_id);

    const tree = useSideTreeStore((state) => state.tree);
    const setTree = useSideTreeStore((state) => state.setTree);

    const projects = useProjectsStore((state) => state.projects);
    const sections = useSectionsStore((state) => state.sections);
    const projectName = useProjectStore((state) => state.projectName);
    const projectDescription = useProjectStore((state) => state.projectDescription);
    const sectionName = useSectionStore((state) => state.sectionName);
    const sectionDescription = useSectionStore((state) => state.sectionDescription);
    const values = useValuesStore((state) => state.values);

    useEffect(() => {
        setTree();
    }
    , [
        setTree,
        projects, projectName, projectDescription,
        sections, sectionName, sectionDescription,
        values
    ]);

  return (
    <ul className="menu w-full overflow-y-auto pr-0">
        <li>
        {tree.length === 0
            ?   <span className="flex gap-2 items-center pointer-events-none italic">
                    No projects found
                </span>
            :   tree.map((project) => (
                    <details key={project.id} open={project.id === Number(project_id)}>
                        <summary className={location === `/project/${project.id}` ? "menu-hover rounded" : ""}>

                            <Link href={`/project/${project.id}`} className={(active) => (active ? "active-link-menu" : "")}>
                                <span className="flex gap-2 items-center select-all">
                                    <FolderIcon className="w-3 shrink-0" /> <p className="line-clamp-1">{project.name}</p>
                                </span>
                            </Link>

                        </summary>
                        {project.description && <p className="text-xs text-gray-500 whitespace-pre-wrap py-2 px-4">{project.description}</p>}
                        <ul>
                            {project.sections?.length === 0
                                ? <li className="menu-hover rounded">
                                    <span className="flex gap-2 items-center pointer-events-none italic">
                                        No sections found
                                    </span>
                                </li>
                                : project.sections?.map((section) => (
                                    <li key={`${project.id}-${section.id}`} className={location === `/project/${project.id}/section/${section.id}` ? "menu-hover rounded" : ""}>
                                        <details key={section.id} open={section.id === Number(section_id)}>
                                            <summary className={location === `/project/${project.id}` ? "menu-hover rounded" : ""}>

                                                <Link href={`/project/${project.id}/section/${section.id}`} className={(active) => (active ? "active-link-menu" : "")}>
                                                    <span className="flex gap-2 items-center select-all">
                                                        <FileIcon className="w-3 shrink-0" /> <p className="line-clamp-1">{section.name}</p>
                                                    </span>
                                                </Link>

                                            </summary>
                                            {section.description && <p className="text-xs text-gray-500 whitespace-pre-wrap py-2 px-4">{section.description}</p>}
                                            {location !== `/project/${project.id}/section/${section.id}` &&
                                                <ul className="ml-4 pb-5">
                                                    {section.values?.length === 0
                                                        ? <li className="menu-hover rounded">
                                                            <span className="flex gap-2 items-center pointer-events-none italic">
                                                                No values found
                                                            </span>
                                                        </li>
                                                        : section.values?.map((value) => (
                                                            <li key={`${project.id}-${section.id}-${value.id}`} className="h-7">

                                                                <span className="flex gap-2 items-center pointer-events-none select-all text-gray-500 whitespace-pre-wrap">
                                                                    {{
                                                                        [ValueTypes.TEXT]: <TextIcon className="w-3 shrink-0" />,
                                                                        [ValueTypes.DATE]: <CalendarIcon className="w-3 shrink-0" />,
                                                                        [ValueTypes.PASSWORD]: <PasswordIcon className="w-3 shrink-0" />,
                                                                    }[value.type]}
                                                                    <p className="line-clamp-1">{value.name}</p>
                                                                </span>

                                                            </li>
                                                        ))}
                                                </ul>
                                            }
                                        </details>
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
