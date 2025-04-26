import ModalComponent from "../../components/ModalComponent";
import InputField from "../../components/InputField";
import TextareaField from "../../components/TextareaField";
import useSectionStore from "../../stores/SectionStore";
import { useEffect, useState } from "react";
import EditIcon from "../../svg/EditIcon";
import { Section } from "../../db/Section";

function EditSectionModal (props: {section_id: number}) {
    const [openNewSection, setOpenNewSection] = useState(false);

    const sectionName = useSectionStore((state) => state.sectionName);
    const setSectionName = useSectionStore((state) => state.setSectionName);
    const [newSectionName, setNewSectionName] = useState<string | undefined>();
    const handleSectionName = (e: React.ChangeEvent<HTMLInputElement>) => {setNewSectionName(e.target.value); setSectionNameError(false);};

    const sectionNameError = useSectionStore((state) => state.sectionNameError);
    const setSectionNameError = useSectionStore((state) => state.setSectionNameError);

    const sectionDescription = useSectionStore((state) => state.sectionDescription);
    const setSectionDescription = useSectionStore((state) => state.setSectionDescription);
    const [newSectionDescription, setNewSectionDescription] = useState<string | undefined>();
    const handlesectionDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => setNewSectionDescription(e.target.value);

    useEffect(() => {
      setNewSectionName(sectionName)
      setNewSectionDescription(sectionDescription)
      setSectionNameError(false)
    }
    , [openNewSection, sectionName, sectionDescription, setSectionNameError]);

    const editNewSection = async () => {
      if (!newSectionName) {
        setSectionNameError(true)
        return
      }

      await Section.update(props.section_id,{
        name: newSectionName,
        description: newSectionDescription,
      })
  
      setSectionName(newSectionName)
      setSectionDescription(newSectionDescription)
      setOpenNewSection(false)
      setSectionNameError(false)
  
    }
    return (
        <>
          <button className="btn btn-sm" onClick={()=> setOpenNewSection(!openNewSection)}><EditIcon className="w-4" /> <span className="hidden @md/layout:block">Edit section</span></button>
          <ModalComponent open={openNewSection} onClose={() => setOpenNewSection(false)}>
              <div className="flex flex-col gap-4">
              <h2>Create a new section</h2>

              <InputField label="Name" name="name" value={newSectionName} error={sectionNameError} action={handleSectionName} />
              <TextareaField label="Description" name="description" value={newSectionDescription} action={handlesectionDescription} optional />

              <button className="btn btn-sm btn-primary" onClick={editNewSection}>Edit</button>
              </div>
          </ModalComponent>
        </>
    );
}

export default EditSectionModal;
