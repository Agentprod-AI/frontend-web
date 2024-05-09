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
  const [campaignId, setCampaignId] = useState("");
  const { user } = useUserContext();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = window.localStorage.getItem("campaignId");

      if (storedValue) {
        setCampaignId(storedValue);
      }
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("analyzing filez");
    if (event.target.files) {
      setIsLoading(true);
      setFile(event.target.files[0]);
      console.log(event.target.files);
    }

    if (file) {
      const config = {
        header: true,
        complete: (results: Papa.ParseResult<CSVData>) => {
          console.log(results.data);
          setCsvData(results.data);
          setIsLoading(false);
        },
      };

      Papa.parse(file, config);
    }
  };

  const handleRemoveFile = () => {
    setFile(undefined);
    // inputFileRef.current.value = "No file selected";
  };

  useEffect(() => {
    if (file) {
      const config = {
        header: true,
        complete: (results: Papa.ParseResult<CSVData>) => {
          console.log(results.data);
          setCsvData(results.data);
          setIsLoading(false);
        },
      };
      Papa.parse(file, config);
    }
  }, [file]);

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
    console.log(selectedValue);
  };

  // const extractData = () => {
  //   const values: string[] = selectedValue.map((value) => {
  //     return value.toLowerCase().split(" ").join("_");
  //   });
  //   return values;
  // };

  const enrichmentHandler = async () => {
    const csvDataKeys = Object.keys(csvData ? csvData[0] : {});
    const csvModifiedDataKeys = csvDataKeys.map((value, index) => {
      return value.toLowerCase().split(" ").join("_");
    });

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

    console.log(leadsToEnrich);

    const enrichedLeads = axiosInstance
      .post(`v2/apollo/leads/bulk_enrich`, leadsToEnrich)
      .then((response) => {
        const data = response.data;
        data.map((person: Lead): void => {
          person.type = "prospective";
          person.campaign_id = campaignId;
          person.id = uuid();
        });
        setLeads(data);
        setIsAudienceLoading(false);
        setIsLeadsTableActive(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message || "Failed to enrich leads.");
        setIsAudienceLoading(false);
      });

    console.log("enriched leads: ", enrichedLeads);
  };
 
  
  function mapLeadsToBodies(leads: Lead[], campaignId: string): Contact[] {
    return leads.map((lead) => ({
      id: lead.id,
      user_id: user.id,
      campaign_id: campaignId,
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
    }));
  }

  const createAudience = async () => {
    const audienceBody = mapLeadsToBodies(leads as Lead[], campaignId);
    console.log(audienceBody);

    setIsCreateBtnLoading(true);
    const response = axiosInstance
      .post<Contact[]>(`v2/lead/bulk/`, audienceBody)
      .then((response: any) => {
        const data = response.data;
        console.log("DATA from contacts: ", data);
        if (data.isArray) {
          setLeads(data);
        } else {
          setLeads([data]);
        }
        setIsCreateBtnLoading(false);
        toast.success("Audience created successfully");
      })
      .catch((error: any) => {
        console.log(error);
        setError(error instanceof Error ? error.toString() : String(error));
        setIsCreateBtnLoading(false);
      });

    console.log("response from creating contact", response);
  };

  return (
    <>
      {!isLeadsTableActive ? (
        <div>
          <Dialog defaultOpen={true}>
            <DialogTrigger asChild>
              <Button variant="outline" className="my-4">
                View Leads
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload files</DialogTitle>
                <DialogDescription>
                  Add you CSV or XLSX file here.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <Input
                  // ref={inputFileRef}
                  type="file"
                  className="w-full"
                  onChange={handleFileChange}
                />
                {file && (
                  <Trash2Icon
                    className="cursor-pointer"
                    onClick={handleRemoveFile}
                  />
                )}
              </div>
              {isLoading ? (
                <LoadingCircle />
              ) : (
                csvData && (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px]">
                            Column Name
                          </TableHead>
                          <TableHead className="w-[150px]">
                            Select Type
                          </TableHead>
                          <TableHead className="w-[150px]">Samples</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.keys(csvData[0]).map((column, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {column}
                            </TableCell>
                            <TableCell>
                              <Select onValueChange={handleSelectChange}>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Options</SelectLabel>
                                    <SelectItem value={`first_name~${column}`}>
                                      First Name
                                    </SelectItem>
                                    <SelectItem value={`last_name~${column}`}>
                                      Last Name
                                    </SelectItem>
                                    <SelectItem value={`email~${column}`}>
                                      Email
                                    </SelectItem>
                                    <SelectItem value={`domain~${column}`}>
                                      Domain
                                    </SelectItem>
                                    <SelectItem
                                      value={`organization_name~${column}`}
                                    >
                                      Company
                                    </SelectItem>
                                    <SelectItem
                                      value={`linkedin_url~${column}`}
                                    >
                                      Linkedin
                                    </SelectItem>
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
                      <Button variant={"outline"} className="w-1/3">
                        Cancel
                      </Button>
                    </DialogFooter>
                  </>
                )
              )}
            </DialogContent>
          </Dialog>
        </div>
      ) : isAudienceLoading ? (
        <LoadingCircle />
      ) : (
        <>
          <AudienceTableClient />
          {isCreateBtnLoading ? (
            <LoadingCircle />
          ) : (
            <Button
              onClick={(event) => {
                event.preventDefault();
                createAudience();
              }}
            >
              Create Audience
            </Button>
          )}
        </>
      )}
    </>
  );
};
