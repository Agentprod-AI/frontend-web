import { useState, useEffect } from "react";
import Papa from "papaparse";
import { LoadingCircle } from "@/app/icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2Icon } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { Contact, Lead, useLeads } from "@/context/lead-user";
import { AudienceTableClient } from "../tables/audience-table/client";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { useUserContext } from "@/context/user-context";
import { useParams, useRouter } from "next/navigation";
import { useButtonStatus } from "@/context/button-status";

interface CSVData {
  [key: string]: string;
}

export const ImportAudience = () => {
  const [csvData, setCsvData] = useState<CSVData[]>();
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { leads, setLeads } = useLeads();
  const [isLeadsTableActive, setIsLeadsTableActive] = useState(false);
  const [isAudienceLoading, setIsAudienceLoading] = useState(false);
  const [isCreateBtnLoading, setIsCreateBtnLoading] = useState(false);
  const { user } = useUserContext();
  const params = useParams<{ campaignId: string }>();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const { setPageCompletion } = useButtonStatus();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setIsLoading(true);
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (file) {
      const config = {
        header: true,
        complete: (results: Papa.ParseResult<CSVData>) => {
          setCsvData(results.data);
          setIsLoading(false);
        },
      };
      Papa.parse(file, config);
    }
  }, [file]);

  const handleRemoveFile = () => {
    setFile(undefined);
    setCsvData(undefined);
  };

  const [selectedValue, setSelectedValue] = useState<
    {
      presetValue: string;
      csvColumnName: string;
    }[]
  >([]);

  const [presetValues, setPresetValue] = useState<string[]>([]);

  const handleSelectChange = (value: string) => {
    const modifiedValue = value.split("~");
    if (!presetValues.includes(modifiedValue[0])) {
      setPresetValue((prevState) => [...prevState, modifiedValue[0]]);
      setSelectedValue((prevState) => [
        ...prevState,
        { presetValue: modifiedValue[0], csvColumnName: modifiedValue[1] },
      ]);
    }
  };

  const enrichmentHandler = async () => {
    const leadsToEnrich = csvData?.map((row) => {
      const mappedRow: { [key: string]: string } = {};

      selectedValue.forEach(
        (selectedValueMap: { presetValue: string; csvColumnName: string }) => {
          const { presetValue, csvColumnName } = selectedValueMap;

          if (csvColumnName in row) {
            mappedRow[presetValue] = row[csvColumnName];
          }
        }
      );

      return mappedRow;
    });

    try {
      const response = await axiosInstance.post(
        `v2/apollo/leads/bulk_enrich`,
        leadsToEnrich
      );
      const data = response.data;
      data.map((person: Lead): void => {
        person.type = "prospective";
        person.campaign_id = params.campaignId;
        person.id = uuid();
      });
      setLeads(data);
      setIsAudienceLoading(false);
      setIsLeadsTableActive(true);
    } catch (error) {
      console.error(error);
      setError("Failed to enrich leads.");
      setIsAudienceLoading(false);
    }
  };

  function mapLeadsToBodies(leads: Lead[]): Contact[] {
    return leads.map((lead) => ({
      id: lead.id,
      user_id: user.id,
      campaign_id: lead.campaign_id,
      type: "prospective",
      first_name: lead.first_name,
      last_name: lead.last_name,
      name: lead.name,
      title: lead.title,
      linkedin_url: lead?.linkedin_url,
      email_status: lead.email_status,
      photo_url: lead.photo_url,
      twitter_url: lead.twitter_url,
      github_url: lead.github_url,
      facebook_url: lead.facebook_url,
      extrapolated_email_confidence: lead.extrapolated_email_confidence,
      headline: lead.headline,
      email: lead.email,
      employment_history: lead.employment_history,
      state: lead.state,
      city: lead.city,
      country: lead.country,
      is_likely_to_engage: lead.is_likely_to_engage,
      departments: lead.departments,
      subdepartments: lead.subdepartments,
      seniority: lead.seniority,
      functions: lead.functions,
      phone_numbers: lead.phone_numbers,
      intent_strength: lead.intent_strength,
      show_intent: lead.show_intent,
      revealed_for_current_team: lead.revealed_for_current_team,
      is_responded: false,
      company_linkedin_url: lead.company_linkedin_url,
      pain_points: lead.pain_points || [],
      value: lead.value || [],
      metrics: lead.metrics || [],
      compliments: lead.compliments || [],
      lead_information: lead.lead_information || String,
      is_b2b: lead.is_b2b,
      score: lead.score,
    }));
  }

  const createAudience = async () => {
    const audienceBody = mapLeadsToBodies(leads as Lead[]);
    setIsCreateBtnLoading(true);
    try {
      const response = await axiosInstance.post<Contact[]>(
        `v2/lead/bulk/`,
        audienceBody
      );
      const data = response.data;
      setLeads(Array.isArray(data) ? data : [data]);
      setIsCreateBtnLoading(false);
      setPageCompletion("audience", true);
      toast.success("Audience created successfully");
      router.push(`/dashboard/campaign/${params.campaignId}`);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.toString() : String(error));
      setIsCreateBtnLoading(false);
    }
  };

  const [searchText, setSearchText] = useState("");

  const filteredOptions = [
    "First Name",
    "Last Name",
    "Email",
    "Hashed Email",
    "Full Name",
    "Phone Number",
    "Apollo ID",
    "LinkedIn URL",
    "Bio",
    "Avatar URL",
    "Website URL",
    "Location",
    "Time Zone",
    "City",
    "State",
    "Country Code",
    "Latitude",
    "Longitude",
    "Employment Title",
    "Employment Seniority",
    "Twitter URL",
    "Facebook URL",
    "GitHub URL",
    "Company Name",
    "Company Domain",
    "Company Nickname",
    "Company Bio",
    "Company Avatar URL",
    "Company Website URL",
    "Company Street",
    "Company City",
    "Company State",
    "Company Postal Code",
    "Company Country",
    "Company Raw Address",
    "Company Founded Year",
    "Company Employees Count",
    "Company Alexa Global Rank",
    "Company Retail Locations Count",
    "Company Annual Revenue",
    "Company Funding Total",
    "Company Funding Stage",
    "Company Ticker",
    "Company Primary Industry",
    "Company Secondary Industries",
    "Company Tags",
    "Company Languages",
    "Company Tech Stack",
    "Company Phone",
    "Company Blog URL",
    "Company AngelList URL",
    "Company LinkedIn URL",
    "Company Twitter URL",
    "Company Facebook URL",
    "Company Crunchbase URL",
  ].filter((option) => option.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <>
      <div className="my-4">
        <div className="py-3"> Add you CSV or XLSX file here.</div>
        <Input
          type="file"
          className="w-full cursor-pointer"
          onChange={handleFileChange}
        />
        {file && (
          <Trash2Icon className="cursor-pointer" onClick={handleRemoveFile} />
        )}
      </div>
      {csvData && (
        <Dialog defaultOpen={true}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Map CSV Columns</DialogTitle>
              <DialogDescription>
                Map the CSV columns to appropriate fields.
              </DialogDescription>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Column Name</TableHead>
                  <TableHead className="w-[150px]">Select Type</TableHead>
                  <TableHead className="w-[150px]">Samples</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(csvData[0]).map((column, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{column}</TableCell>
                    <TableCell>
                      <Select onValueChange={handleSelectChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent className="h-60">
                          <SelectGroup>
                            <SelectLabel>Options</SelectLabel>
                            {/* <Input
                              placeholder="Search..."
                              value={searchText}
                              onChange={(e) => setSearchText(e.target.value)}
                              className="mb-2 sticky "
                            /> */}
                            {filteredOptions.map((option, index) => (
                              <SelectItem
                                key={index}
                                value={`${option
                                  .toLowerCase()
                                  .replace(/ /g, "_")}~${column}`}
                              >
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {csvData[0][column]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DialogFooter className="flex sm:justify-start">
              <Button onClick={enrichmentHandler} className="w-1/3">
                Confirm
              </Button>
              <DialogClose asChild>
                <Button variant="outline" className="w-1/3">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {isLeadsTableActive && (
        <>
          <AudienceTableClient />
          {isCreateBtnLoading ? (
            <LoadingCircle />
          ) : (
            <Button onClick={createAudience}>Create Audience</Button>
          )}
        </>
      )}
    </>
  );
};
