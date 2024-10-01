import { useState, useEffect } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { LoadingCircle } from "@/app/icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2Icon, Loader2 } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { Contact, Lead, useLeads } from "@/context/lead-user";
import { AudienceTableClient } from "../tables/audience-table/client";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { useUserContext } from "@/context/user-context";
import { useParams, useRouter } from "next/navigation";
import { useButtonStatus } from "@/context/button-status";
import axios from "axios";
import AudienceTable from "../ui/AudienceTable";

interface FileData {
  [key: string]: string;
}

export const ImportAudience = () => {
  const [fileData, setFileData] = useState<FileData[]>();
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const { leads, setLeads } = useLeads();
  const [isLeadsTableActive, setIsLeadsTableActive] = useState(false);
  const [isCreateBtnLoading, setIsCreateBtnLoading] = useState(false);
  const { user } = useUserContext();
  const params = useParams<{ campaignId: string }>();
  const router = useRouter();
  const [type, setType] = useState<"create" | "edit">("create");

  const { setPageCompletion } = useButtonStatus();

  const [isEnrichmentLoading, setIsEnrichmentLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setIsLoading(true);
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (file) {
      if (file.name.endsWith(".csv")) {
        parseCSV(file);
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        parseExcel(file);
      } else {
        setError("Unsupported file format. Please upload a CSV or Excel file.");
        setIsLoading(false);
      }
    }
  }, [file]);

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setFileData(results.data as FileData[]);
        setIsLoading(false);
        setIsDialogOpen(true);
      },
      error: (error) => {
        setError("Error parsing CSV: " + error.message);
        setIsLoading(false);
      },
    });
  };

  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setFileData(parsedData as FileData[]);
      setIsLoading(false);
      setIsDialogOpen(true);
    };
    reader.onerror = (error) => {
      setError("Error parsing Excel: " + error);
      setIsLoading(false);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      const id = params.campaignId;
      if (id) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}v2/lead/campaign/${params.campaignId}`
          );
          const data = await response.json();
          if (data.detail === "No Contacts found") {
            setType("create");
          } else {
            setLeads(data);
            setType("edit");
          }
        } catch (error) {
          console.error("Error fetching campaign:", error);
        }
      }
    };

    fetchCampaign();
  }, [params.campaignId]);

  const handleRemoveFile = () => {
    setFile(undefined);
    setFileData(undefined);
  };

  const [selectedValue, setSelectedValue] = useState<
    {
      presetValue: string;
      fileColumnName: string;
    }[]
  >([]);

  const [presetValues, setPresetValue] = useState<string[]>([]);

  const handleSelectChange = (value: string) => {
    const [presetValue, fileColumnName] = value.split("~");
    if (!presetValues.includes(presetValue)) {
      setPresetValue((prevState) => [...prevState, presetValue]);
      setSelectedValue((prevState) => [
        ...prevState,
        { presetValue, fileColumnName },
      ]);
    }
  };

  const enrichmentHandler = async () => {
    setIsEnrichmentLoading(true);
    toast.loading("Enriching leads...", { id: "enrichment" });

    const leadsToEnrich = fileData?.map((row) => {
      const mappedRow: { [key: string]: string } = {};
      selectedValue.forEach(({ presetValue, fileColumnName }) => {
        if (fileColumnName in row) {
          mappedRow[presetValue] = row[fileColumnName];
        }
      });
      return mappedRow;
    });

    if (!leadsToEnrich || leadsToEnrich.length === 0) {
      setError("No leads to enrich.");
      return;
    }

    const batchSize = 30;
    const enrichedLeads: any[] = [];

    const getRandomEmail = () => {
      const emailArray = [
        "nisheet@agentprod.com",
        "info@agentprod.com",
        "muskaan@agentprodapp.com",
        "admin@agentprod.com",
        "naman.barkiya@agentprod.com",
        "siddhant.goswami@agentprod.com",
        "muskaan@agentprod.com",
      ];
      return emailArray[Math.floor(Math.random() * emailArray.length)];
    };

    const createScraperBody = (url: string) => ({
      count: 1,
      searchUrl: url,
      email: getRandomEmail(),
      getEmails: true,
      guessedEmails: true,
      maxDelay: 15,
      minDelay: 8,
      password: "Agentprod06ms",
      startPage: 1,
      waitForVerification: true,
      proxy: {
        useApifyProxy: true,
        apifyProxyGroups: ["RESIDENTIAL"],
        apifyProxyCountry: "IN",
      },
    });

    const fetchLead = async (lead: any): Promise<any[]> => {
      const firstName = encodeURIComponent(lead.first_name || "");
      const companyName = encodeURIComponent(lead.company_name || "");
      const url = `https://app.apollo.io/#/people?finderViewId=5b6dfc5a73f47568b2e5f11c&sortByField=account_owner_id&sortAscending=true&qKeywords=${firstName}%20${companyName}`;
      console.log(url);

      const scraperBody = createScraperBody(url);

      try {
        const response = await axios.post(
          "https://api.apify.com/v2/acts/curious_coder~apollo-io-scraper/run-sync-get-dataset-items?token=apify_api_n5GCPgdvobcZfCa9w38PSxtIQiY22E4k3ARa",
          scraperBody
        );
        return response.data;
      } catch (error) {
        console.error(
          `Error fetching lead for ${firstName} ${companyName}:`,
          error
        );
        return [];
      }
    };

    try {
      setIsLoading(true);
      for (let i = 0; i < leadsToEnrich.length; i += batchSize) {
        const batch = leadsToEnrich.slice(i, i + batchSize);
        console.log(
          `Processing batch ${i / batchSize + 1} of ${Math.ceil(
            leadsToEnrich.length / batchSize
          )}`
        );

        const batchPromises = batch.map(fetchLead);
        const batchResults = await Promise.all(batchPromises);
        const batchLeads = batchResults.flat();

        enrichedLeads.push(...batchLeads);

        // Optional: Add a delay between batches to avoid rate limiting
        if (i + batchSize < leadsToEnrich.length) {
          await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 second delay
        }
      }

      // Process Apollo leads
      const processedLeads = enrichedLeads.map(
        (lead: any): Lead => ({
          type: "prospective",
          campaign_id: params.campaignId,
          id: lead.id || uuid(),
          first_name: lead.first_name,
          last_name: lead.last_name,
          name: lead.name,
          title: lead.title,
          linkedin_url: lead.linkedin_url,
          email_status: lead.email_status,
          photo_url: lead.photo_url,
          twitter_url: lead.twitter_url,
          github_url: null,
          facebook_url: null,
          extrapolated_email_confidence: lead.extrapolated_email_confidence,
          headline: lead.headline,
          email: lead.email,
          employment_history: lead.employment_history,
          state: lead.state,
          city: lead.city,
          country: lead.country,
          is_likely_to_engage: lead.is_likely_to_engage,
          departments: [],
          subdepartments: [],
          functions: [],
          phone_numbers: lead.phone_numbers,
          intent_strength: lead.intent_strength,
          show_intent: lead.show_intent,
          is_responded: false,
          company_linkedin_url: lead.organization?.linkedin_url,
          pain_points: [],
          value: [],
          metrics: [],
          compliments: [],
          lead_information: "",
          is_b2b: "false",
          score: null,
          qualification_details: "",
          company: lead.organization?.name,
          phone: lead.phone_numbers[0]?.phone || null,
          technologies: [],
          organization: lead.organization?.name,
          organization_id: lead.organization_id,
          seniority: "",
          revealed_for_current_team: false,
        })
      );

      setLeads(processedLeads);
      console.log("Processed leads:", processedLeads);
      setIsDialogOpen(false);
      setIsLeadsTableActive(true);

      toast.success("Leads enriched successfully", { id: "enrichment" });
    } catch (error) {
      console.error("Error in enrichment process:", error);
      setError("Failed to enrich leads.");
      toast.error("Failed to enrich leads", { id: "enrichment" });
    } finally {
      setIsLoading(false);
      setIsEnrichmentLoading(false);
    }
  };

  function mapLeadsToBodies(leads: Lead[]): Contact[] {
    return leads.map((lead: any) => ({
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
      is_b2b: "false",
      score: lead.score,
      qualification_details: lead.qualification_details || String,
      company: lead.company,
      phone: lead.phone,
      technologies: lead.technologies || [],
      organization: lead.organization,
    }));
  }

  const createAudience = async () => {
    const audienceBody = mapLeadsToBodies(leads as Lead[]);
    setIsCreateBtnLoading(true);
    try {
      // Step 1: Create contacts
      const contactsResponse = await axiosInstance.post<Contact[]>(
        `v2/lead/bulk/`,
        audienceBody
      );
      const contactsData = contactsResponse.data;
      setLeads(Array.isArray(contactsData) ? contactsData : [contactsData]);

      // Step 2: Create audience entry
      const postBody = {
        campaign_id: params.campaignId,
        audience_type: "prospective",
        filters_applied: {}, // Add any filters if applicable
      };

      const audienceResponse = await axiosInstance.post(
        "v2/audience/",
        postBody
      );
      const audienceData = audienceResponse.data;
      console.log("Audience created:", audienceData);

      setPageCompletion("audience", true);
      toast.success("Audience created successfully");

      // Step 3: Update user details
      toast.info("Updating user details, please wait...");
      setTimeout(() => {
        router.push(`/dashboard/campaign/${params.campaignId}`);
        setIsCreateBtnLoading(false);
      }, 40000);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.toString() : String(error));
      setIsCreateBtnLoading(false);
      toast.error("Failed to create audience");
    }
  };

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
  ];

  return (
    <>
      <div className="my-4">
        <div className="py-3">Add your CSV or XLSX file here.</div>
        <Input
          type="file"
          accept=".csv,.xlsx,.xls"
          className="w-full cursor-pointer"
          onChange={handleFileChange}
        />
        {file && (
          <Trash2Icon className="cursor-pointer" onClick={handleRemoveFile} />
        )}
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {isLoading && <LoadingCircle />}
      {fileData && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Map File Columns</DialogTitle>
              <DialogDescription>
                Map the file columns to appropriate fields.
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
                {Object.keys(fileData[0]).map((column, index) => (
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
                      {fileData[0][column]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DialogFooter className="flex sm:justify-start">
              <Button 
                onClick={enrichmentHandler} 
                className="w-1/3"
                disabled={isEnrichmentLoading}
              >
                {isEnrichmentLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enriching...
                  </>
                ) : (
                  "Confirm"
                )}
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
          <AudienceTable />
          {isCreateBtnLoading ? (
            <LoadingCircle />
          ) : (
            <Button
              onClick={(event) => {
                event.preventDefault();
                createAudience();
              }}
            >
              {type === "create" ? "Create Audience" : "Update Audience"}
            </Button>
          )}
        </>
      )}
    </>
  );
};