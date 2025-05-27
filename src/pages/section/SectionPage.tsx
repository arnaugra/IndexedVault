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

function SectionPage () {
    const [, navigate] = useLocation();
    const match = useRoute<{project_id: string, section_id: string}>("/project/:project_id/section/:section_id")[1];
    const project_id = Number(match?.project_id);
    const section_id = Number(match?.section_id);

    const { setSectionName, sectionDescription, setSectionDescription } = useNewSectionStore();
    const { setValues } = useValuesStore();

    useEffect(() => {
        const fetchSection = async () => {
            const pageProject = await Project.getById(project_id);
            const pageSection = await Section.getById(section_id);
            if (pageProject && pageSection) {
                setSectionName(pageSection.name);
                setSectionDescription(pageSection.description);
                document.title = `IndexedVault | ${pageProject.name} / ${pageSection.name}`;

            } else {
                navigate("/404");
            }
        }
        fetchSection();
        setValues(section_id);

    }, [navigate, section_id, project_id, setSectionDescription, setSectionName, setValues]);

    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const deleteProject = async () => {
        await Section.delete(section_id);
        navigate("/project/" + project_id);
    }

  return (
    <section id="page">
        <article className="head-r">
            <div className="flex justify-between items-center w-full">

                <div className="w-5/8">
                    <BreadcrumbsComponent section_id={section_id} project_id={project_id}/>
                </div>

                <div className="flex gap-2 shrink-0">
                    <SectionModal section_id={section_id} />
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
                <ValueModal section_id={section_id} />
            </span>
        </article>
        <article className="overflow-x-auto">
            <ValuesTable section_id={section_id} />
        </article>
    </section>
  );
}

export default SectionPage;
