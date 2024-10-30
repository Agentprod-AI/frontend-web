/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */

"use client";
import React, { useEffect, useState } from "react";
import { Pencil, Eye } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import EditorContent from "./editor-content";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PreviewContent from "./preview-content";
import {
  getAutogenerateTrainingEmail,
  startCampaign,
  getPreviewByTemplate,
  createTraining,
  TrainingRequest,
  updateTraining,
  getFollowUpOne,
  getFollowUpTwo,
} from "./training.api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useUserContext } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useAutoGenerate } from "@/context/auto-generate-mail";
import { useFieldsList } from "@/context/training-fields-provider";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { LoadingCircle } from "@/app/icons";
import { FieldType, VariableType } from "./types";
import { toast } from "sonner";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";

export interface PreviewData {
  email: {
    subject: string;
    body: string;
  };
  contact?: any;
  linkedin_information?: string;
  posts?: string[]
}

interface Lead {
  firstName: string;
  email: string;
  position: string;
  companyName: string;
  phone: string;
  linkedinUrl: string;
  industry: string;
  companySize: string;
  headquarters: string;
  foundedYear: string;
  specialties: string[];
}

export default function Training() {
  const [loadingWriteAI, setLoadingWriteAI] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("editor");
  const [previewData, setPreviewData] = React.useState<PreviewData | null>(
    null
  );
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showEditCamp, setShowEditCamp] = useState(true);
  const [type, setType] = useState<"create" | "edit">("create");
  const [testEmail, setTestEmail] = useState("");
  const [testCamp, setTestCamp] = useState<any[]>([]);
  const [testCampLoading, setTestCampLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number>(180);
  const [customPrompt, setCustomPrompt] = useState('');
  const { user } = useUserContext();
  const params = useParams<{ campaignId: string }>();
  const {
    setAutoGeneratedFollowUp,
    setAutoGeneratedFollowUpTwo,
    setAutoGeneratedBody,
    setAutoGeneratedSubject,
    setContact,
    setLinkedinInformation,
    setPreviewType,
    setPosts,
    previewType,
    autoGeneratedSubject,
    autoGeneratedBody,
    autoGeneratedFollowUp,
    autoGeneratedFollowUpTwo,
    channel,
    setChannel,
  } = useAutoGenerate();
  const { fieldsList, body, subject, followUp, followUpOne, subjectOptions } =
    useFieldsList();
  const router = useRouter();
  const [startCampaignIsLoading, setStartCampaignIsLoading] =
    React.useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | 'pdf'>('image');

  // const handleGenerateWithAI = async () => {
  //   try {
  //     const response = await getAutogenerateTrainingEmail(
  //       params.campaignId,
  //       user.id
  //     );
  //     console.log(response);
  //     const { email, contact, linkedin_information } = response;

  //     setPreviewData({
  //       email,
  //       contact,
  //       linkedin_information,
  //     });
  //     setActiveTab("preview");
  //   } catch (error) {
  //     console.error("Failed to fetch training data:", error);
  //   }
  // };
  useEffect(() => {
    async function call() {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}v2/goals/${params.campaignId}`
      );
      console.log("res data" + res.data.emails[0]);
      setTestEmail(res.data.emails);
    }

    call();
  }, []);

  useEffect(() => {
    const fetchCampaign = async () => {
      const id = params.campaignId;
      if (id) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}v2/campaigns/${id}`
          );

          const data = await response.json();
          console.log(data, "ress");
          if (response.ok) {
            setChannel(data.channel);
          } else {
            toast.error("Failed to fetch campaign data");
          }
        } catch (error) {
          console.error("Error fetching campaign:", error);
          toast.error("An error occurred while fetching campaign data");
        }
      }
    };

    fetchCampaign();
  }, [params.campaignId]);

  useEffect(() => {
    const fetchCampaign = async () => {
      const id = params.campaignId;
      if (id) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}v2/training/${params.campaignId}`
          );
          const data = await response.json();
          if (data.detail === "Training information not found") {
            setType("create");
          } else {
            console.log("data =>" + data);
            // setGoalData(data);
            setType("edit");
          }
        } catch (error) {
          console.error("Error fetching campaign:", error);
        }
      }
    };

    fetchCampaign();
  }, [params.campaignId]);

  const handleStartCampaign = async () => {
    setStartCampaignIsLoading(true);
    const userId = user.id as string;

    try {
      const checkReck = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}v2/recurring_campaign_request/${params.campaignId}`
      );

      if (checkReck.data !== null) {
        if (checkReck.data.is_active === false) {
          await axios.put(
            `${process.env.NEXT_PUBLIC_SERVER_URL}v2/recurring_campaign_request`,
            {
              campaign_id: params.campaignId,
              is_active: true,
            }
          );
        }

      }
      toast.success(
        "Your drafts are getting created, it might take some time."
      );

      // Start the campaign in the background without awaiting
      if (previewType == "previewFromTemplate") {
        startCampaign(params.campaignId, userId, false)
          .then((response) => console.log("trainingResponse", response))
          .catch((error) => console.error("Error starting campaign:", error));
      } else if (previewType == "previewFromAI") {
        startCampaign(params.campaignId, userId, true)
          .then((response) => console.log("trainingResponse", response))
          .catch((error) => console.error("Error starting campaign:", error));
      }

      localStorage.setItem("newCampaignId", params.campaignId);
      localStorage.setItem("redirectFromCampaign", "true");
      localStorage.setItem("campaignDraftStatus", "pending");

      // Set a timeout to redirect after 20 seconds
      setTimeout(() => {
        setStartCampaignIsLoading(false);
        router.push("/dashboard/mail");
      }, 30000);
    } catch (error: any) {
      console.log("TrainingResponse", error);
      toast.error(error.message);
      setStartCampaignIsLoading(false);
    }
  };

  const handleCustomGenerate = async () => {
    setPreviewLoading(true);
    const toastMessages = [
      {
        title: "Enriching data for your variables...",
        description:
          "Our AI is understanding your template variables and learning your tone",
      },
      {
        title: "Understanding your audience and offering...",
        description:
          "Our AI is understanding your audience and offering to generate relevant messages",
      },
      {
        title: "Training AI on your messaging and tone...",
        description:
          "Your previous revisions are being used to train AI to write in your voice ",
      },
      {
        title: "Generating a preview for your message...",
        description:
          "We're generating a preview for your message to make sure everyting looks good",
      },
    ];

    let toastIndex = 0;
    const intervalId = setInterval(() => {
      if (toastIndex < toastMessages.length) {
        toast.dismiss(); // Remove previous toasts
        toast.loading(
          <div className="flex items-center h-full">
            <div>
              <LoadingCircle />
            </div>
            <div className="ml-2">
              <strong>{toastMessages[toastIndex].title}</strong>
              <p>{toastMessages[toastIndex].description}</p>
            </div>
          </div>
        );
        toastIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 2000);

    try {
      setPreviewType("previewFromTemplate");

      const trainingBody = {
        campaign_id: params.campaignId,
        template: `Subject: ${subject}
        
        ${body}
        `,
        follow_up_template_1: { body: followUp },
        follow_up_template_2: { body: followUpOne },

        variables: fieldsList.variables.reduce<Record<string, string>>(
          (acc, field) => {
            acc[field.id] = field.value;
            return acc;
          },
          {}
        ),
        offering_variables: fieldsList.offering_variables.reduce<
          Record<string, string>
        >((acc, field) => {
          acc[field.fieldName] = field.description;
          return acc;
        }, {}),
        personalized_fields: fieldsList.personalized_fields.reduce<
          Record<string, string>
        >((acc, field) => {
          acc[field.fieldName] = field.description;
          return acc;
        }, {}),
        enriched_fields: fieldsList.enriched_fields.map(
          (field) => field.fieldName
        ),
        subject_field_options: subjectOptions,
      };

      await createTraining(trainingBody as TrainingRequest);
      // await updateTraining(user.id, trainingBody);

      const response = await getPreviewByTemplate({
        campaign_id: params.campaignId,
        user_id: user.id,
        template: `
        Body: ${body}`,
        variables: fieldsList.variables,
        offering_variables: fieldsList.offering_variables,
        personalized_fields: fieldsList.personalized_fields,
        enriched_fields: fieldsList.enriched_fields,
      });
      console.log("debugger   " + response.template);

      setPreviewData({
        email: {
          body: response.body,
          subject: response.subject,
        },
      });

      console.log("response from get email by template", response);

      setAutoGeneratedBody(response.email.body);
      setAutoGeneratedSubject(response.email.subject);
      setContact(response.contact);
      setLinkedinInformation(response.linkedin_information);
      setPosts(response.posts)
      setAutoGeneratedFollowUp(`${response.first_follow_up.body}`);
      setAutoGeneratedFollowUpTwo(`${response.second_follow_up.body}`);

      toast.dismiss(); // Remove any remaining loading toasts
      toast.success("Email auto-generation complete.");
    } catch (error) {
      console.error("Failed to fetch training data:", error);
      toast.dismiss(); // Remove any remaining loading toasts
      setPreviewLoading(false);
    } finally {
      clearInterval(intervalId);
      setActiveTab("preview");
      setPreviewLoading(false);
    }
  };

  const handleLetAiWrite = async () => {
    setLoadingWriteAI(true);
    toast.success("AI is writing your email, it might take some time.");
    try {
      
      const response = await getAutogenerateTrainingEmail(
        params.campaignId,
        user.id
      );  

      setPreviewData({
        email: {
          body: response.body,
          subject: response.subject,
        },
      });
      console.log(response.body);
      console.log("Main Gen");
      if(channel !== "Linkedin"){
        setAutoGeneratedBody(response.email.body); // Fixed this line
        setAutoGeneratedSubject(response.email.subject); // Fixed this line
      }else{
        setAutoGeneratedSubject("");
        setAutoGeneratedBody(response.email.message);
      }
      setContact(response.contact);
      setLinkedinInformation(response.linkedin_information);
      setPosts(response.posts)
      setPreviewType("previewFromAI");
      setActiveTab("preview");

      console.log("response from training page", response);
    } catch (error) {
      console.error("Failed to fetch training data:", error);
    } finally {
      setLoadingWriteAI(false);
    }
  };

  const onTabChange = (tab: string) => {
    setActiveTab("editor");
  };

  const handleEditCampaign = () => {
    setShowEditCamp(!showEditCamp);
  };

  const handleGenerate = async () => {
    try {
      const customInstructions = [];
      if (customPrompt) {
        customInstructions.push(customPrompt);
      }
      if (uploadedFile) {
        customInstructions.push(`Always mention that you are including a ${fileType}. Name of the file: ${uploadedFile.name}`);
      }

      const personaData = {
        user_id: user.id,
        campaign_id: params.campaignId,
        custom_instructions: customInstructions,
        length_of_email: selectedOption,
      };

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}v2/personas/campaign`,
        personaData
      );

      console.log("Persona update response:", res.data);
      await handleLetAiWrite();
    } catch (error) {
      console.error("Error updating persona:", error);
      toast.error("Failed to update persona information");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidFileType = (
      (fileType === 'image' && file.type.startsWith('image/')) ||
      (fileType === 'video' && file.type.startsWith('video/')) ||
      (fileType === 'pdf' && file.type === 'application/pdf')
    );

    if (!isValidFileType) {
      toast.error(`Invalid file type. Please select a ${fileType} file.`);
      return;
    }

    setUploadedFile(file);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}v2/upload/${fileType}/${params.campaignId}`,
        formData
      );

      if (!response.data) {
        throw new Error('Upload failed');
      }

      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload file');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleTemplatePreview = async () => {
    handleCustomGenerate();
  };

  return (
    <>
      <div className="w-full h-14 px-4 flex flex-row justify-between items-center rounded-lg border">
        <div className="ml-4">Training</div>
        <div className="flex items-center flex-row">
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="w-[200px]"
          >
            <TabsList>
              <TabsTrigger value="editor" className="flex gap-1">
                <Pencil className="h-3 w-3" />
                Editor
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="flex gap-1"
              >
                {previewLoading ? (
                  <div className="flex items-center">
                    <LoadingCircle />
                    <span className="ml-2">Preview</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-2" />
                    Preview
                  </div>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {startCampaignIsLoading ? (
            <LoadingCircle />
          ) : channel === "Linkedin" ? (
            <Button onClick={handleStartCampaign}>
              Start Campaign
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger>
                <Button
                  onClick={async () => {
                    toast.info("Testing campaign...");
                    setTestCampLoading(true);
                    const res = await axios.post(
                      `${process.env.NEXT_PUBLIC_SERVER_URL}v2/google/test-mail`,
                      {
                        user_id: user.id,
                        subject: autoGeneratedSubject || "Test mai",
                        body: autoGeneratedBody || "Hii",
                        email: testEmail,
                      }
                    );

                    setTestCamp(res.data[0]);
                    toast.success("Testing campaign complete.");
                    setTestCampLoading(false);
                  }}
                >
                  {testCampLoading ? <LoadingCircle /> : "Test campaign"}
                </Button>
              </DialogTrigger>
              {testCampLoading ? null : (
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Test Campaign Details</DialogTitle>
                  </DialogHeader>
                  <DialogDescription className="h-72  overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Emails</TableHead>
                          <TableHead>Email Placement</TableHead>
                          <TableHead>Spam Score</TableHead>
                          <TableHead>Sender</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {testCamp.map((data: any, index: any) => (
                          <TableRow key={index}>
                            <TableCell>{data.seed_mail}</TableCell>
                            <TableCell>
                              {data.receivedAt}
                            </TableCell>
                            <TableCell className="text-green-400 ">
                              {data.spam_score}
                            </TableCell>
                            <TableCell>{data.sender}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </DialogDescription>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleStartCampaign}>
                      Start Campaign
                    </Button>
                  </div>
                </DialogContent>
              )}
            </Dialog>
          )}
        </div>
      </div>
      {activeTab === "editor" ? (
        <div className="mt-4">
          <Card className="w-full shadow-md">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-2xl text-center font-semibold">
                Let AI write
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex gap-20">
                <div className="w-1/2 space-y-4">
                  <div className="rounded-md">
                    <Label className="text-sm font-medium mb-2 block">Length of email</Label>
                    <RadioGroup
                      defaultValue="medium"
                      className="flex space-x-4"
                      onValueChange={(value) => setSelectedOption(parseInt(value))}
                    >
                      {[
                        { label: 'Short', value: 60 },
                        { label: 'Medium', value: 120 },
                        { label: 'Long', value: 180 }
                      ].map((option) => (
                        <div key={option.label} className="flex items-center">
                          <RadioGroupItem
                            value={option.value.toString()}
                            id={option.label}
                            className="mr-2"
                          />
                          <Label htmlFor={option.label} className="capitalize cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="custom-instructions" className="text-sm font-medium mb-1 block">
                      Custom Instructions (Optional)
                    </Label>
                    <Textarea
                      id="custom-instructions"
                      placeholder="Enter your custom instructions here..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* <div className="w-1/2 space-y-4">
                  <div>
                    <Label className="text-sm font-medium block mb-2">File Type</Label>
                    <RadioGroup
                      defaultValue="image"
                      className="flex space-x-4"
                      onValueChange={(value) => setFileType(value as 'image' | 'video' | 'pdf')}
                    >
                      {['image', 'video', 'pdf'].map((type) => (
                        <div key={type} className="flex items-center">
                          <RadioGroupItem value={type} id={type} className="mr-2" />
                          <Label htmlFor={type} className="capitalize cursor-pointer">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium block">Upload Custom File</Label>
                    <Input
                      type="file"
                      accept={fileType === 'image' ? 'image/*' : fileType === 'video' ? 'video/*' : 'application/pdf'}
                      onChange={handleFileChange}
                      className="cursor-pointer mt-2"
                      disabled={uploading}
                    />
                    {uploading && (
                      <div className="flex items-center mt-2">
                        <LoadingCircle />
                        <span className="ml-2 text-sm text-gray-500">Uploading file...</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Accepted file type: {fileType}
                    </p>
                    {uploadedFile && (
                      <p className="text-sm text-gray-600 mt-2">
                        Selected file: {uploadedFile.name}
                      </p>
                    )}
                  </div>
                </div> */}
              </div>
              <Button
                onClick={handleGenerate}
                className="mt-4"
              >
                <div className="flex items-center justify-center">
                  Preview Email <span className="ml-2">{loadingWriteAI ? <LoadingCircle /> : <AutoAwesomeIcon />}</span>
                </div>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="w-full mt-4">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Use AI Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EditorContent />
              <Button
                onClick={handleTemplatePreview}
                className="mt-4"
              >
                <div className="flex items-center justify-center">
                  Preview Email <span className="ml-2">{loadingWriteAI ? <LoadingCircle /> : <AutoAwesomeIcon />}</span>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <PreviewContent />
      )}
      {/* {showEditCamp && <div>jwnd</div>} */}
    </>
  );
}
