import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect, SetStateAction } from "react";
import { useLeads } from "@/context/lead-user";
import { Checkbox } from "./checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { NameAction } from "../tables/user-tables/name-action";
import { useLeadSheetSidebar } from "@/context/lead-sheet-sidebar";

function AudienceTable() {
  const { leads, setLeads } = useLeads();
  const { toggleSidebar, setItemId } = useLeadSheetSidebar();

  const [deselectedLeads, setDeselectedLeads] = useState(new Set());
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [activeLeadId, setActiveLeadId] = useState(null);

  useEffect(() => {
    setSelectedRows(new Set(leads.map((lead) => lead.id)));
  }, [leads]);

  const handleCheckboxChange = (leadId: unknown) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);

      if (newSelectedRows.has(leadId)) {
        newSelectedRows.delete(leadId);
        setDeselectedLeads((prevDeselectedLeads) =>
          new Set(prevDeselectedLeads).add(leadId)
        );
      } else {
        newSelectedRows.add(leadId);
        setDeselectedLeads((prevDeselectedLeads) => {
          const updatedDeselectedLeads = new Set(prevDeselectedLeads);
          updatedDeselectedLeads.delete(leadId);
          return updatedDeselectedLeads;
        });
      }
      return newSelectedRows;
    });
  };

  const allLeads = leads.map((lead) => ({
    ...lead,
    selected: selectedRows.has(lead.id),
  }));

  const handleLeadClick = (leadId: any) => {
    setActiveLeadId(leadId);
    setItemId(leadId);
    toggleSidebar(true);
  };

  return (
    <div className="">
      <div className="h-96 overflow-y-scroll border rounded-lg my-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SELECT</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>COMPANY</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="">
                  <Checkbox
                    checked={selectedRows.has(lead.id)}
                    onCheckedChange={() => handleCheckboxChange(lead.id)}
                  />
                </TableCell>
                <TableCell
                  className="font-medium flex justify-center items-center cursor-pointer"
                  onClick={() => handleLeadClick(lead.id)}
                >
                  <Avatar>
                    <AvatarImage src={lead.photo_url} alt={lead.first_name} />
                    <AvatarFallback>{lead.first_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="ml-4">{lead.first_name}</span>
                </TableCell>
                <TableCell>{lead.title}</TableCell>
                <TableCell>
                  {lead.employment_history?.[0]?.organization_name || "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default AudienceTable;
