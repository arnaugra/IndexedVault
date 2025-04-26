import ModalComponent from "../../components/ModalComponent";
import InputField from "../../components/InputField";
import useSectionStore from "../../stores/SectionStore";
import { useEffect, useState } from "react";
import { Section } from "../../db/Section";
import useSectionsStore from "../../stores/SectionsStore";
import TextareaField from "../../components/TextareaField";

function NewSectionModal (props: {project_id: number}) {
  const [openNewSection, setOpenNewSection] = useState(false);

  const setSections = useSectionsStore((state) => state.setSections);

  const sectionName = useSectionStore((state) => state.sectionName);
  const setSectionName = useSectionStore((state) => state.setSectionName);
  const handleSectionName = (e: React.ChangeEvent<HTMLInputElement>) => {setSectionName(e.target.value); setSectionNameError(false);};

  const sectionNameError = useSectionStore((state) => state.sectionNameError);
  const setSectionNameError = useSectionStore((state) => state.setSectionNameError);
  
  const sectionDescription = useSectionStore((state) => state.sectionDescription);
  const setSectionDescription = useSectionStore((state) => state.setSectionDescription);
  const handleSectionDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => setSectionDescription(e.target.value);

  useEffect(() => {
    setSectionName(undefined)
    setSectionDescription(undefined)
    setSectionNameError(false)
  }
  , [openNewSection, setSectionName, setSectionDescription, setSectionNameError]);

  const createNewSection = async () => {
    if (!sectionName) {
      setSectionNameError(true);
      return;
    }

    await Section.create({
      name: sectionName,
      description: sectionDescription,
      projectId: props.project_id,
    })

    setSectionName(undefined)
    setSectionDescription(undefined)
    setSectionNameError(false)
    setOpenNewSection(false)
    setSections(props.project_id);

  }
  return (
      <>
        <button className="btn btn-sm" onClick={()=> setOpenNewSection(!openNewSection)}>New section</button>
        <ModalComponent open={openNewSection} onClose={() => setOpenNewSection(false)}>
            <div className="flex flex-col gap-4">
              <h2>Create a new section</h2>

              <InputField label="Name" name="name" value={sectionName ?? ""} error={sectionNameError} action={handleSectionName} />
              <TextareaField label="Description" name="description" value={sectionDescription ?? ""} action={handleSectionDescription} optional />

              <button className="btn btn-sm btn-primary" onClick={createNewSection}>Create</button>
            </div>
        </ModalComponent>
      </>
  );
}

export default NewSectionModal;