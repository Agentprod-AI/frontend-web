import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { useLeads } from "@/context/lead-user";
import { Checkbox } from "./checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

function AudienceTable() {
  const { leads, setLeads } = useLeads();
  const [deselectedLeads, setDeselectedLeads] = useState(new Set());
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Effect to initialize selectedRows when leads change
  useEffect(() => {
    setSelectedRows(new Set(leads.map((lead) => lead.id)));
  }, [leads]);

  // Handle checkbox change
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
      console.log("deselectedLeads " + deselectedLeads.size);
      console.log("selectedRows " + selectedRows.size);

      return newSelectedRows;
    });
  };

  // Effect to update leads with only selected leads
  // useEffect(() => {
  //   const updatedLeads = leads.filter((lead) => selectedRows.has(lead.id));
  //   setLeads(updatedLeads as any);
  // }, [selectedRows, leads, setLeads]);

  // useEffect(() => {
  //   const updatedLeads = leads.filter((lead) => !deselectedLeads.has(lead.id));
  //   setLeads(updatedLeads as any);
  // }, [deselectedLeads, leads, setLeads]);

  const allLeads = leads.map((lead) => ({
    ...lead,
    selected: selectedRows.has(lead.id),
  }));

  return (
    <div className="">
      <div className="h-96 overflow-y-scroll border rounded-lg my-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SELECT</TableHead>
              <TableHead>AVATAR</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>COMPANY</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(lead.id)}
                    onCheckedChange={() => handleCheckboxChange(lead.id)}
                  />
                </TableCell>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={lead.photo_url} alt={lead.name} />
                    <AvatarFallback>{lead.name[0]}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{lead.name}</TableCell>
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
