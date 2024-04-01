import React, { useState } from "react";
import { Input } from "../ui/input";
import { prototype } from "events";

interface CSVData {
  "First Name"?: string;
  "Last Name"?: string;
  Title?: string;
  "Company Name"?: string;
  Email?: string;
  Phone?: string;
  Stage?: string;
}

export const ImportAudience = () => {
  const [csvData, setCsvData] = useState<CSVData[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const csvContent = reader.result as string;
        const rows = csvContent.trim().split("\n");
        const headers = rows[0].split(",");
        const data: CSVData[] = rows.slice(1).map((row) => {
          const values = row.split(",");
          const rowData: CSVData = {};
          headers.forEach((header, index) => {
            if (index === headers.length - 1) {
              header = header.replace(/\r/g, "");
            }
            rowData[header as keyof typeof rowData] = values[index];
          });
          return rowData;
        });
        setCsvData(data);
        console.log(rows, headers);
        console.log(data);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <div className="my-2">File</div>
      <Input type="file" className="w-1/5" onChange={handleFileChange} />
    </div>
  );
};
