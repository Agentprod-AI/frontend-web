import { useState, useEffect, useRef } from "react";
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
import { Trash2Icon, Loader2, ChevronUp, ChevronDown, ExternalLink, Search } from "lucide-react";
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { FileIcon } from "lucide-react";
interface FileData {
  [key: string]: string;
}



export const ImportAudience = () => {
  const [fileData, setFileData] = useState<FileData[]>();
  const [mandatoryColumns, setMandatoryColumns] = useState({
    name: false,
    email: false,
    company_name: false,
    linkedin_url: false
  });
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
  const [selectedOption, setSelectedOption] = useState<"withEnrichment" | "withoutEnrichment" | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setPageCompletion } = useButtonStatus();

  const [isEnrichmentLoading, setIsEnrichmentLoading] = useState(false);
  const [showCards, setShowCards] = useState(true);

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
        if (selectedOption === "withoutEnrichment") {
          validateMandatoryColumns(results.data[0] as FileData);
        }
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
      if (selectedOption === "withoutEnrichment") {
        validateMandatoryColumns(parsedData[0] as FileData);
      }
      setIsDialogOpen(true);
    };
    reader.onerror = (error) => {
      setError("Error parsing Excel: " + error);
      setIsLoading(false);
    };
    reader.readAsBinaryString(file);
  };

  const validateMandatoryColumns = (firstRow: FileData) => {
    const columns = Object.keys(firstRow);
    const newMandatoryColumns = {
      name: columns.some(col => col.toLowerCase().includes('name')),
      email: columns.some(col => col.toLowerCase().includes('email')),
      company_name: columns.some(col => col.toLowerCase().includes('company')),
      linkedin_url: columns.some(col => col.toLowerCase().includes('linkedin'))
    };
    setMandatoryColumns(newMandatoryColumns);
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
    setShowCards(false); // Hide cards when enrichment starts
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
        // "nisheet@agentprod.com",
        "info@agentprod.com",
        "muskaan@agentprodapp.com",
        // "admin@agentprod.com",
        // "naman.barkiya@agentprod.com",
        // "siddhant.goswami@agentprod.com",
        // "muskaan@agentprod.com",
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
          linkedin_posts: [],
          linkedin_bio: "",
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
      linkedin_posts: lead.linkedin_posts || [],
      linkedin_bio: lead.linkedin_bio || "",
    }));
  }

  const processNonEnrichedData = () => {
    setShowCards(false);
    if (!fileData) return;

    const processedLeads = fileData.map((row): Lead => ({
      type: "prospective",
      campaign_id: params.campaignId,
      id: uuid(),
      first_name: row['First Name'] || row['First_Name'] || row.Name?.split(' ')[0] || '',
      last_name: row['Last Name'] || row['Last_Name'] || row.Name?.split(' ').slice(1).join(' ') || '',
      name: row.Name || row['Full Name'] || `${row['First Name'] || ''} ${row['Last Name'] || ''}`.trim(),
      title: row.Title || row['Job Title'] || row.Position || '',
      linkedin_url: row['LinkedIn URL'] || row['Linkedin URL'] || row['LinkedIn'] || row.Linkedin || "",
      email_status: 'verified',
      photo_url: row['Photo URL'] || row['Avatar URL'] || '',
      twitter_url: row['Twitter URL'] || row['Twitter'] || '',
      github_url: row['GitHub URL'] || row['Github'] || null,
      facebook_url: row['Facebook URL'] || row['Facebook'] || null,
      extrapolated_email_confidence: null,
      headline: row.Headline || row.Bio || '',
      email: row.Email || row['Email Address'] || '',
      employment_history: [],
      state: row.State || '',
      city: row.City || '',
      country: row.Country || row['Country Code'] || '',
      is_likely_to_engage: false,
      departments: row.Departments ? row.Departments.split(',') : [],
      subdepartments: [],
      functions: row.Functions ? row.Functions.split(',') : [],
      phone_numbers: row.Phone ? [{ phone: row.Phone }] : [],
      intent_strength: null,
      show_intent: false,
      is_responded: false,
      company_linkedin_url: row['Company LinkedIn URL'] || '',
      pain_points: [],
      value: [],
      metrics: [],
      compliments: [],
      lead_information: '',
      is_b2b: 'false',
      score: null,
      qualification_details: '',
      company: row['Company Name'] || row['Company'] || row['Organization'] || '',
      phone: row.Phone || row['Phone Number'] || '',
      technologies: row.Technologies ? row.Technologies.split(',') : [],
      organization: row['Company Name'] || row['Company'] || row['Organization'] || '',
      organization_id: '',
      seniority: row.Seniority || row['Employment Seniority'] || '',
      revealed_for_current_team: false,
      linkedin_posts: [],
      linkedin_bio: row['LinkedIn Bio'] || '',
    }));

    setLeads(processedLeads);
    setIsLeadsTableActive(true);
    setIsDialogOpen(false);
    toast.success("Leads processed successfully");
  };

  const handleConfirmClick = () => {
    if (selectedOption === "withoutEnrichment") {
      processNonEnrichedData();
    } else {
      enrichmentHandler();
    }
  };


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
      }, 20000);
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

  const handleOptionSelect = (option: "withEnrichment" | "withoutEnrichment") => {
    setSelectedOption(option);
    setFile(undefined); // Reset file when changing options
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {showCards && (
  <div className="my-4">
    <h2 className="text-2xl font-bold mb-4">Choose Your Import Method</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card
        className={`cursor-pointer transition-all h-60 ${selectedOption === "withEnrichment" ? "border-primary" : ""}`}
        onClick={() => handleOptionSelect("withEnrichment")}
      >
        <CardHeader>
          <CardTitle className="text-2xl mb-2 flex items-center">
            <FileIcon className="mr-2" /> Enhance Your Contact List
          </CardTitle>
          <CardDescription>
            <ul className="list-disc list-inside space-y-2">
              <li>Upload your file (CSV, Excel, etc.)</li>
              <li>We'll enrich each contact with additional details</li>
              <li>Get their email ID, LinkedIn ID, job titles, company size, etc.</li>
              <li>Save time on manual research</li>
              <li>Required fields: Name, Company</li>
            </ul>
          </CardDescription>
        </CardHeader>
      </Card>

      <Card
        className={`cursor-pointer transition-all h-60 ${selectedOption === "withoutEnrichment" ? "border-primary" : ""}`}
        onClick={() => handleOptionSelect("withoutEnrichment")}
      >
        <CardHeader>
          <CardTitle className="text-2xl mb-2 flex items-center">
            <FileIcon className="mr-2" /> Use Your Data As-Is
          </CardTitle>
          <CardDescription>
            <ul className="list-disc list-inside space-y-2">
              <li>Upload your complete contact list</li>
              <li>We'll use the data exactly as provided</li>
              <li>Ideal for up-to-date, verified contacts</li>
              <li>Required fields: Name, Company, LinkedIn, Email ID</li>
            </ul>
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="mt-6 light:bg-blue-100 dark:bg-blue-900/40 p-4 rounded-lg col-span-2 w-1/2">
        <h3 className="font-semibold text-lg mb-2">Need Help Deciding?</h3>
        <p>Choose "Enhance" if you want to find more details like their email ID, LinkedIn ID of your contacts. Pick "As-Is" if your list is already complete with all required fields. Not sure? Contact our support team for guidance.</p>
      </div>
    </div>

    <Input
      ref={fileInputRef}
      id="file-upload"
      type="file"
      accept=".csv,.xlsx,.xls"
      onChange={handleFileChange}
      className="hidden"
    />
  </div>
)}
      {error && <div className="text-red-500">{error}</div>}
      {isLoading && <LoadingCircle />}
      {fileData && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Map File Columns</DialogTitle>
              <DialogDescription>
                {selectedOption === "withoutEnrichment"
                  ? "Ensure all mandatory fields are mapped correctly."
                  : "Map the file columns to appropriate fields."}
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
                      {selectedOption === "withoutEnrichment" ? (
                        <Select onValueChange={handleSelectChange}
                          defaultValue={
                            column.toLowerCase().includes('name') ? 'name' :
                              column.toLowerCase().includes('email') ? 'email' :
                                column.toLowerCase().includes('company') || column.toLowerCase().includes('organization') ? 'company_name' :
                                  column.toLowerCase().includes('linkedin') ? 'linkedin_url' :
                                    undefined
                          }>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent className="h-60">
                            <SelectGroup>
                              {/* <SelectItem value="name">Name</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="company_name">Company Name</SelectItem>
                              <SelectItem value="linkedin_url">LinkedIn URL</SelectItem> */}
                              <SelectLabel>Other Fields</SelectLabel>
                              {filteredOptions.map((option, optionIndex) => (
                                <SelectItem
                                  key={optionIndex}
                                  value={option.toLowerCase().replace(/ /g, "_")}
                                >
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      ) : (
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
                        </Select>)}
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
                onClick={handleConfirmClick}
                className="w-1/3"
                disabled={selectedOption === "withoutEnrichment" && Object.values(mandatoryColumns).some(v => !v)}
              >
                {isEnrichmentLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
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
          {selectedOption === "withoutEnrichment" ? (
            <WithoutEnrichmentTable 
              leads={leads.map(lead => ({
                name: lead.name,
                email: lead.email,
                company: lead.company,
                linkedin_url: lead.linkedin_url || ''
              }))} 
            />
          ) : (
            <AudienceTable />
          )}
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

      {/* {leads && leads.length > 0 && (
        <div className="my-4">
          <h2>Processed Leads:</h2>
          <pre>{JSON.stringify(leads, null, 2)}</pre>
        </div>
      )} */}
    </>
  );
};

interface WithoutEnrichmentTableProps {
  leads: {
    name: string;
    email: string;
    company: string;
    linkedin_url: string;
  }[];
}
const WithoutEnrichmentTable: React.FC<WithoutEnrichmentTableProps> = ({ leads }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<any>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof typeof leads[0]) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  const sortedLeads = [...leads].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a] as string;
    const bValue = b[sortColumn as keyof typeof b] as string;
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredLeads = sortedLeads.filter(lead =>
    Object.values(lead).some(value => 
      value && typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Imported Leads</h2>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="Search leads..."
            className="pl-8 pr-4 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
              <TableRow>
                {['Name', 'Email', 'Company', 'LinkedIn URL'].map((header) => (
                  <TableHead key={header} className="font-bold text-gray-700 dark:text-gray-300">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(header.toLowerCase().replace(' url', '_url') as "name" | "email" | "company" | "linkedin_url")}
                      className="font-bold hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {header}
                      {sortColumn === header.toLowerCase().replace(' url', '_url') && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead, index) => (
                <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell className="dark:text-gray-300">{lead.name || 'N/A'}</TableCell>
                  <TableCell className="dark:text-gray-300">{lead.email || 'N/A'}</TableCell>
                  <TableCell className="dark:text-gray-300">{lead.company || 'N/A'}</TableCell>
                  <TableCell>
                    {lead.linkedin_url ? (
                      <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                        View Profile
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredLeads.length} of {leads.length} leads
      </div>
    </div>
  );
};