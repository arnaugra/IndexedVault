import { useEffect } from "react";
import useProjectStore from "../stores/ProjectStore";
import useSectionStore from "../stores/SectionStore";
import { Project } from "../db/Project";
import { Section } from "../db/Section";
import FolderIcon from "../svg/FolderIcon";
import FileIcon from "../svg/FileIcon";
import { Link } from "wouter";
import BreadcrumbSeparatorIcon from "../svg/BreadcrumbSeparatorIcon";
import { UUID } from "../types/fields";

interface BreadcrumbsComponentProps {
    project_uuid: UUID;
    section_uuid?: UUID;
  };

function BreadcrumbsComponent(props: BreadcrumbsComponentProps) {
    const { project_uuid, section_uuid } = props;

    const { projectName, setProjectName } = useProjectStore();
    const { sectionName, setSectionName } = useSectionStore();

    useEffect(() => {
        const fetchProject = async () => {
            const project = await Project.getByUuid(project_uuid);
            if (project) {
                setProjectName(project.name);
            } else {
                console.error("Project not found");
            }
        };

        const fetchSection = async () => {
            if (section_uuid) {
                const section = await Section.getByUuid(section_uuid);
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
    , [project_uuid, section_uuid, setProjectName, setSectionName]);

  return (
    <div className="flex justify-start items-center gap-1 w-full">

        <Link href={`/project/${project_uuid}`} className={(active) => `${active ? "active-link-breadcrumb" : ""} ${sectionName ? "max-w-[25%]" : ""} flex items-center gap-1`}>
            <FolderIcon className={`${sectionName ? "w-4" : "w-5"} mt-0.5 shrink-0`} />
            <p className={`line-clamp-1 @max-xl/layout:hidden ${sectionName ? "text-sm" : "text-lg"}`}>{projectName}</p>
        </Link>

        {section_uuid && <>
            <BreadcrumbSeparatorIcon className="active-link-breadcrumb w-5" />
            <Link href={`/project/${project_uuid}/section/${section_uuid}`} className={(active) => `${active ? "active-link-breadcrumb" : ""} flex items-center gap-1`}>
                <FileIcon className="w-5 shrink-0" />
                <p className="line-clamp-1 text-lg">{sectionName}</p>
            </Link>
        </>}
    </div>
  );
}

export default BreadcrumbsComponent;
