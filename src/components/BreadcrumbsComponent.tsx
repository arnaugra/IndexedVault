import { useEffect } from "react";
import useProjectStore from "../stores/ProjectStore";
import useSectionStore from "../stores/SectionStore";
import { Project } from "../db/Project";
import { Section } from "../db/Section";
import FolderIcon from "../svg/FolderIcon";
import FileIcon from "../svg/FileIcon";
import { Link } from "wouter";
import BreadcrumbSeparatorIcon from "../svg/BreadcrumbSeparatorIcon";

interface BreadcrumbsComponentProps {
    project_id: number;
    section_id?: number;
  };

function BreadcrumbsComponent(props: BreadcrumbsComponentProps) {
    const { project_id, section_id } = props;

    const { projectName, setProjectName } = useProjectStore();
    const { sectionName, setSectionName } = useSectionStore();

    useEffect(() => {
        const fetchProject = async () => {
            const project = await Project.getById(project_id);
            if (project) {
                setProjectName(project.name);
            } else {
                console.error("Project not found");
            }
        };

        const fetchSection = async () => {
            if (section_id) {
                const section = await Section.getById(section_id);
                if (section) {
                    setSectionName(section.name);
                } else {
                    console.error("Section not found");
                }
            } else {
                setSectionName(undefined);
            }
        };

        fetchProject();
        fetchSection();
    }
    , [project_id, section_id, setProjectName, setSectionName]);

  return (
    <div className="flex justify-start items-center gap-1 w-full">

        <Link href={`/project/${project_id}`} className={(active) => `${active ? "active-link-breadcrumb" : ""} ${sectionName ? "max-w-[25%]" : ""} flex items-center gap-1`}>
            <FolderIcon className={`${sectionName ? "w-4" : "w-5"} mt-0.5 shrink-0`} />
            <p className={`line-clamp-1 @max-xl/layout:hidden ${sectionName ? "text-sm" : "text-lg"}`}>{projectName}</p>
        </Link>

        {section_id && <>
            <BreadcrumbSeparatorIcon className="active-link-breadcrumb w-5" />
            <Link href={`/project/${project_id}/section/${section_id}`} className={(active) => `${active ? "active-link-breadcrumb" : ""} flex items-center gap-1`}>
                <FileIcon className="w-5 shrink-0" />
                <p className="line-clamp-1 text-lg">{sectionName}</p>
            </Link>
        </>}
    </div>
  );
}

export default BreadcrumbsComponent;
