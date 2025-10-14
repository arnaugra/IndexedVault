import FolderIcon from "../svg/FolderIcon";
import FileIcon from "../svg/FileIcon";
import { Link } from "wouter";
import BreadcrumbSeparatorIcon from "../svg/BreadcrumbSeparatorIcon";
import { useProject } from "../contexts/ProjectContext";
import { useSection } from "../contexts/SectionContext";

function BreadcrumbsComponent() {

    const { currentProject } = useProject();
    const { currentSection } = useSection();

  return (
    <div className="flex justify-start items-center gap-1 w-full">

        <Link href={`/project/${currentProject?.uuid}`} className={(active) => `${active ? "active-link-breadcrumb" : ""} ${currentSection ? "max-w-[25%]" : ""} flex items-center gap-1`}>
            <FolderIcon className={`${currentSection ? "w-4" : "w-5"} mt-0.5 shrink-0`} />
            <p className={`line-clamp-1 @max-xl/layout:hidden ${currentSection ? "text-sm" : "text-lg"}`}>{currentProject?.name}</p>
        </Link>

        {currentSection && <>
            <BreadcrumbSeparatorIcon className="active-link-breadcrumb w-5" />
            <Link href={`/project/${currentProject?.uuid}/section/${currentSection?.uuid}`} className={(active) => `${active ? "active-link-breadcrumb" : ""} flex items-center gap-1`}>
                <FileIcon className="w-5 shrink-0" />
                <p className="line-clamp-1 text-lg">{currentSection?.name}</p>
            </Link>
        </>}
    </div>
  );
}

export default BreadcrumbsComponent;
