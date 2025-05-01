import { useLocation, useRoute } from "wouter";
import { Section } from "../../db/Section";
import { useEffect, useState } from "react";
import useValuesStore from "../../stores/ValuesStore";
import useNewSectionStore from "../../stores/SectionStore";
import SectionModal from "./SectionModal";
import ConfirmModalComponent from "../../components/ConfirmModalComponent";
import BinIcon from "../../svg/BinIcon";
import NewValueModal from "./NewValueModal";
import ValuesTable from "./ValuesTable";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent";

function SectionPage () {
    const [, navigate] = useLocation();
    const match = useRoute<{project_id: string, section_id: string}>("/project/:project_id/section/:section_id")[1];
    const project_id = Number(match?.project_id);
    const section_id = Number(match?.section_id);

    const setSectionName = useNewSectionStore((state) => state.setSectionName);

    const sectionDescription = useNewSectionStore((state) => state.sectionDescription);
    const setSectionDescription = useNewSectionStore((state) => state.setSectionDescription);

    const setValues = useValuesStore((state) => state.setValues);

    useEffect(() => {
        const fetchSection = async () => {
            const pageSection = await Section.getById(section_id);
            if (pageSection) {
                setSectionName(pageSection.name);
                setSectionDescription(pageSection.description);
                
            } else {
                navigate("/404");
            }
        }
        fetchSection();
        setValues(section_id);

    }, [navigate, section_id, setSectionDescription, setSectionName, setValues]);

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
            {sectionDescription && <p className="text-gray-600 mt-2 whitespace-pre-line">{sectionDescription}</p>}
            <div className="divider m-0"></div>
            <span>
                <NewValueModal section_id={section_id} />
            </span>
        </article>
        <article>
            <ValuesTable section_id={section_id} />
        </article>
    </section>
  );
}

export default SectionPage;
