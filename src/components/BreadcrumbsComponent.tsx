import useProjectStore from "../stores/ProjectStore";
import useSectionStore from "../stores/SectionStore";
import FolderIcon from "../svg/FolderIcon";
import FileIcon from "../svg/FileIcon";
import { Link } from "wouter";
import BreadcrumbSeparatorIcon from "../svg/BreadcrumbSeparatorIcon";

function BreadcrumbsComponent() {

    const { projectName, projectUuid } = useProjectStore();
    const { sectionName, sectionUuid } = useSectionStore();

  return (
    <div className="flex justify-start items-center gap-1 w-full">

        <Link href={`/project/${projectUuid}`} className={(active) => `${active ? "active-link-breadcrumb" : ""} ${sectionName ? "max-w-[25%]" : ""} flex items-center gap-1`}>
            <FolderIcon className={`${sectionName ? "w-4" : "w-5"} mt-0.5 shrink-0`} />
            <p className={`line-clamp-1 @max-xl/layout:hidden ${sectionName ? "text-sm" : "text-lg"}`}>{projectName}</p>
        </Link>

        {sectionUuid && <>
            <BreadcrumbSeparatorIcon className="active-link-breadcrumb w-5" />
            <Link href={`/project/${projectUuid}/section/${sectionUuid}`} className={(active) => `${active ? "active-link-breadcrumb" : ""} flex items-center gap-1`}>
                <FileIcon className="w-5 shrink-0" />
                <p className="line-clamp-1 text-lg">{sectionName}</p>
            </Link>
        </>}
    </div>
  );
}

export default BreadcrumbsComponent;
