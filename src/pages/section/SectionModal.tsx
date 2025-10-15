import { useEffect, useState } from "react";
import ModalComponent from "../../components/ModalComponent";
import InputField from "../../components/InputField";
import TextareaField from "../../components/TextareaField";
import EditIcon from "../../svg/EditIcon";
import { Section } from "../../db/Section";
import useSectionsStore from "../../stores/SectionsStore";
import { UUID } from "../../types/fields";
import { useSection } from "../../contexts/SectionContext";

const sectionBase = {
    name: "",
    nameError: false,
    description: "",
}

function SectionModal ({ project_uuid, section_uuid }: {project_uuid?: UUID, section_uuid?: UUID}) {
    const edit = section_uuid !== undefined;
 
    const [openNewSection, setOpenNewSection] = useState(false);

    const [LocalSection, setLocalSection] = useState(sectionBase);

    const { setSections } = useSectionsStore();
    const { currentSection, setCurrentSection } = useSection();

    // init
    const init = async () => {
        if (edit) {
            await Section.getByUuid(section_uuid!).then((section) => {
                setLocalSection({
                    name: section?.name ?? "",
                    nameError: false,
                    description: section?.description ?? "",
                });
            });
        }
    }

    useEffect(() => {
        if (!openNewSection) {
            setLocalSection(sectionBase);
            return;
        }

        init();
    }, []);

    const handleSectionInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLocalSection((prev) => ({ ...prev, [name]: value }));
    }

    const saveSection = async () => {
        if (!LocalSection.name) {
            setLocalSection((prev) => ({ ...prev, nameError: true }));
            return;
        }

        if (edit) {
            await Section.update(section_uuid!, {
                name: LocalSection.name,
                description: LocalSection.description,
            });
            setCurrentSection({
                ...currentSection!,
                name: LocalSection.name,
                description: LocalSection.description,
            });
        } else {
            if (project_uuid) {
                await Section.create({
                    name: LocalSection.name,
                    description: LocalSection.description,
                    projectId: -1,
                    projectUUID: project_uuid,
                    order: await Section.count() + 1,
                });
            }
        }

        if (project_uuid) setSections(project_uuid);
        setLocalSection(sectionBase);
        setOpenNewSection(false);

    }

    return (
        <>
            <button className="btn btn-sm" onClick={()=> setOpenNewSection(true)}>
                <EditIcon className="w-4" />
                <span className="hidden @md/layout:block">{edit ? "Edit" : "New"} section</span>
            </button>
            <ModalComponent open={openNewSection} onClose={() => setOpenNewSection(false)}>
                <div className="flex flex-col gap-4">
                    <h2>{edit ? "Edit" : "Create New"} Section</h2>

                    <InputField label="Name" name="name" value={LocalSection.name} error={LocalSection.nameError} action={handleSectionInput} />
                    <TextareaField label="Description" name="description" value={LocalSection.description} action={handleSectionInput} optional />

                    <button className="btn btn-sm btn-primary" onClick={saveSection}>
                        {edit ? "Edit" : "Create"}
                    </button>
                </div>
            </ModalComponent>
        </>
    );
}

export default SectionModal;
