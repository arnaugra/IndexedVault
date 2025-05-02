import { useEffect, useState } from "react";
import ModalComponent from "../../components/ModalComponent";
import InputField from "../../components/InputField";
import TextareaField from "../../components/TextareaField";
import EditIcon from "../../svg/EditIcon";
import { Section } from "../../db/Section";
import useSectionsStore from "../../stores/SectionsStore";
import useSectionStore from "../../stores/SectionStore";

const sectionBase = {
    name: "",
    nameError: false,
    description: "",
}

function SectionModal (props: {project_id?: number, section_id?: number}) {
    const edit = props.section_id !== undefined;
    const [openNewSection, setOpenNewSection] = useState(false);

    const [LocalSection, setLocalSection] = useState(sectionBase);

    const setSections = useSectionsStore((state) => state.setSections);
    const setSectionName = useSectionStore((state) => state.setSectionName);
    const setSectionDescription = useSectionStore((state) => state.setSectionDescription);

    useEffect(() => {
        if (!openNewSection) {
            setLocalSection(sectionBase);
            return;
        }
        const init = async () => {
            if (edit) {
                await Section.getById(props.section_id!).then((section) => {
                    setLocalSection({
                        name: section?.name ?? "",
                        nameError: false,
                        description: section?.description ?? "",
                    });
                });
            }
        }

        init();
    }, [openNewSection]);

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
            await Section.update(props.section_id!, {
                name: LocalSection.name,
                description: LocalSection.description,
            });
            setSectionName(LocalSection.name);
            setSectionDescription(LocalSection.description);
        } else {
            await Section.create({
                name: LocalSection.name,
                description: LocalSection.description,
                projectId: props.project_id!,
            });
        }

        setLocalSection({
            name: "",
            nameError: false,
            description: "",
        });
        setOpenNewSection(false);
        setSections(props.project_id!);

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
