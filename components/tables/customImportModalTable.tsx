import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ColumnData {
  [key: string]: string;
}

interface TableProps {
  data: ColumnData[];
}

export const ImportModalTable: React.FC<TableProps> = ({ data }) => {
  const columns = Object.keys(data[0]);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Column Name</TableHead>
          <TableHead className="w-[150px]">Select Type</TableHead>
          <TableHead className="w-[150px]">Samples</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {columns.map((column, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{column}</TableCell>
            <TableCell>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Options</SelectLabel>
                    <SelectItem value="firstName">First Name</SelectItem>
                    <SelectItem value="lastName">Last Name</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="jobTitle">Job Title</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {data[0][column]}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
