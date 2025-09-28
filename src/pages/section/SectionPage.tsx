import { useLocation, useRoute } from "wouter";
import { Section } from "../../db/Section";
import { Project } from "../../db/Project";
import { useEffect, useState } from "react";
import useValuesStore from "../../stores/ValuesStore";
import useNewSectionStore from "../../stores/SectionStore";
import SectionModal from "./SectionModal";
import ConfirmModalComponent from "../../components/ConfirmModalComponent";
import BinIcon from "../../svg/BinIcon";
import ValueModal from "../value/ValueModal";
import ValuesTable from "../value/ValuesTable";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent";
import { UUID } from "../../types/fields";

function SectionPage () {
    const [, navigate] = useLocation();
    const match = useRoute<{project_uuid: string, section_uuid: string}>("/project/:project_uuid/section/:section_uuid")[1];
    const project_uuid = match?.project_uuid as UUID;
    const section_uuid = match?.section_uuid as UUID;

    const { setSectionName, sectionDescription, setSectionDescription } = useNewSectionStore();
    const { setValues } = useValuesStore();

    useEffect(() => {
        const fetchSection = async () => {
            const pageProject = await Project.getByUuid(project_uuid);
            const pageSection = await Section.getByUuid(section_uuid);
            if (pageProject && pageSection) {
                setSectionName(pageSection.name);
                setSectionDescription(pageSection.description);
                document.title = `IndexedVault | ${pageProject.name} / ${pageSection.name}`;

            } else {
                navigate("/404");
            }
        }
        fetchSection();
        setValues(section_uuid);

    }, [navigate, section_uuid, project_uuid, setSectionDescription, setSectionName, setValues]);

    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const deleteProject = async () => {
        await Section.delete(section_uuid);
        navigate("/project/" + project_uuid);
    }

  return (
    <section id="page">
        <article className="head-r">
            <div className="flex justify-between items-center w-full">

                <div className="w-5/8">
                    <BreadcrumbsComponent section_uuid={section_uuid} project_uuid={project_uuid}/>
                </div>

                <div className="flex gap-2 shrink-0">
                    <SectionModal section_uuid={section_uuid} />
                    <button className="btn btn-sm btn-error" onClick={() => setOpenConfirmationModal(!openConfirmationModal)}><BinIcon className="w-4" /> <span className="hidden @md/layout:block">Delete project</span></button>
                    <ConfirmModalComponent open={openConfirmationModal} onConfirm={deleteProject} onCancel={() => setOpenConfirmationModal(false)}>
                        <p>You are about to delete this section.</p>
                        <p>All its values will be permanently deleted. This action connot be undone.</p>
                        <p>Are you sure?</p>
                    </ConfirmModalComponent>
                </div>
            </div>
            {sectionDescription && <p className="text-gray-600 mt-1 whitespace-pre-line">{sectionDescription}</p>}
            <div className="divider m-0"></div>
            <span>
                <ValueModal section_uuid={section_uuid} />
            </span>
        </article>
        <article className="overflow-x-auto">
            <ValuesTable section_uuid={section_uuid} />
        </article>
    </section>
  );
}

export default SectionPage;
