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
import useValuesStore from "../stores/ValuesStore";
import { ValueTypes } from "../stores/ValueStore";
import { useProject } from "../contexts/ProjectContext";
import { useSection } from "../contexts/SectionContext";

function SideTree() {
    const [location] = useLocation();
    const match = useRoute<{project_uuid: string}>("/project/:project_uuid")[1];
    const matchSection = useRoute<{project_uuid: string, section_uuid: string}>("/project/:project_uuid/section/:section_uuid")[1];
    const project_uuid = match?.project_uuid || matchSection?.project_uuid;
    const section_uuid = matchSection?.section_uuid;

    const { tree, setTree } = useSideTreeStore();
    const { projects } = useProjectsStore();
    const { sections } = useSectionsStore();
    const { currentProject } = useProject();
    const { currentSection } = useSection();
    const { values } = useValuesStore();

    useEffect(() => {
        setTree();
    }
    , [
        setTree,
        projects, currentProject,
        sections, currentSection,
        values
    ]);

  return (
    <ul className="menu w-full overflow-y-auto pr-0">
        <li>
        {/* Projects */}
        {tree.length === 0
            ?   <span className="flex gap-2 items-center pointer-events-none italic">
                    No projects found
                </span>
            :   tree.map((project) => (
                    <details key={project.uuid} open={project.uuid === project_uuid}>
                        <summary className={location === `/project/${project.uuid}` ? "menu-hover rounded" : ""}>

                            <Link href={`/project/${project.uuid}`} className={(active) => (active ? "active-link-menu" : "")}>
                                <span className="flex gap-2 items-center select-all">
                                    <FolderIcon className="w-3 shrink-0" /> <p className="line-clamp-1">{project.name}</p>
                                </span>
                            </Link>

                        </summary>
                        {project.description && <p className="text-xs text-gray-500 whitespace-pre-wrap py-2 px-4">{project.description}</p>}
                        <ul>
                            {/* Sections */}
                            {project.sections?.length === 0
                                ? <li className="menu-hover rounded">
                                    <span className="flex gap-2 items-center pointer-events-none italic">
                                        No sections found
                                    </span>
                                </li>
                                : project.sections?.map((section) => (
                                    <li key={`${project.id}-${section.id}`} className={location === `/project/${project.id}/section/${section.id}` ? "menu-hover rounded" : ""}>
                                        <details key={section.id} open={section.id === section_uuid}>
                                            <summary className={location === `/project/${project.id}` ? "menu-hover rounded" : ""}>

                                                <Link href={`/project/${project.uuid}/section/${section.uuid}`} className={(active) => (active ? "active-link-menu" : "")}>
                                                    <span className="flex gap-2 items-center select-all">
                                                        <FileIcon className="w-3 shrink-0" /> <p className="line-clamp-1">{section.name}</p>
                                                    </span>
                                                </Link>

                                            </summary>
                                            {section.description && <p className="text-xs text-gray-500 whitespace-pre-wrap py-2 px-4">{section.description}</p>}
                                            {location !== `/project/${project.id}/section/${section.id}` &&
                                                <ul className="ml-4 pb-5">
                                                    {/* Values */}
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
