"use client";
import { useLeadSheetSidebar } from "@/context/lead-sheet-sidebar";
import { Lead } from "@/context/lead-user";
// import { User } from "@/constants/data";

interface NameActionProps {
  data: Lead;
}

export const NameAction: React.FC<NameActionProps> = ({ data }) => {
  const { toggleSidebar, setItemId } = useLeadSheetSidebar();

  function handleSidebar() {
    setItemId(data.id.toString());
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
