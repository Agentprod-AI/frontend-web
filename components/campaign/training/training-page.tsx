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

export interface PreviewData {
  email: {
    subject: string;
    body: string;
  };
  contact?: any;
  linkedin_information?: string;
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
    previewType,
    autoGeneratedSubject,
    autoGeneratedBody,
    autoGeneratedFollowUp,
    autoGeneratedFollowUpTwo,
  } = useAutoGenerate();
  const { fieldsList, body, subject, followUp, followUpOne, subjectOptions } =
    useFieldsList();
  const router = useRouter();
  const [startCampaignIsLoading, setStartCampaignIsLoading] =
    React.useState(false);

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
      toast.success(
        "Your drafts are getting created, it might take some time."
      );
      if (previewType == "previewFromTemplate") {
        const response = await startCampaign(params.campaignId, userId, false);

        console.log("trainingResponse", response);
      } else if (previewType == "previewFromAI") {
        const response = await startCampaign(params.campaignId, userId, true);
        console.log("trainingResponse", response);
      }

      setStartCampaignIsLoading(false);
      router.push("/dashboard/mail");
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

      setAutoGeneratedBody(response.email.body); // Fixed this line
      setAutoGeneratedSubject(response.email.subject); // Fixed this line
      setContact(response.contact);
      setLinkedinInformation(response.linkedin_information);

      setPreviewType("previewFromAI");
      setActiveTab("preview");

      console.log("response from training page", response);
    } catch (error) {
      console.error("Failed to fetch training data:", error);
    }
  };

  const onTabChange = (tab: string) => {
    setActiveTab("editor");
  };

  const handleEditCampaign = () => {
    setShowEditCamp(!showEditCamp);
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
                onClick={handleCustomGenerate}
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
          ) : (
            <Dialog>
              <DialogTrigger>
                {" "}
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
                            <TableCell>{data.receivedAt[2]}</TableCell>
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
        <div>
          <div
            className="mx-16 mt-3 hover:underline cursor-pointer"
            onClick={handleLetAiWrite}
          >
            Let AI write email on its own <AutoAwesomeIcon />
          </div>
          <EditorContent />
        </div>
      ) : (
        <PreviewContent />
      )}
      {/* {showEditCamp && <div>jwnd</div>} */}
    </>
  );
}
