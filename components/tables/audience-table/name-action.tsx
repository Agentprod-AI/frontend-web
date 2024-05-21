"use client";
import { useLeadSheetSidebar } from "@/context/lead-sheet-sidebar";
import { Lead, Contact } from "@/context/lead-user";
// import { User } from "@/constants/data";

interface NameActionProps {
  data: Lead | Contact;
}

export const NameAction: React.FC<NameActionProps> = ({ data }) => {
  const { toggleSidebar, setItemId } = useLeadSheetSidebar();

  // console.log(data);

  function handleSidebar() {
    setItemId(data.id);
    console.log(data.id);
    toggleSidebar(true);
  }

  return (
    <>
      <span onClick={handleSidebar} className="cursor-pointer">
        {data.name}
      </span>
    </>
  );
};
