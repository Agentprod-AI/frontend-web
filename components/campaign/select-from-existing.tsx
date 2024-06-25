/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useState, useEffect } from "react";
import { AudienceTableClient } from "@/components/tables/audience-table/client";
import axios from "axios";
import { Contact, useLeads } from "@/context/lead-user";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { LoadingCircle } from "@/app/icons";
import { v4 as uuid } from "uuid";
import { useUserContext } from "@/context/user-context";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export const SelectFromExisting = () => {
  const { setLeads, existingLeads } = useLeads();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isCreateBtnLoading, setIsCreateBtnLoading] = useState(false);
  const { user } = useUserContext();
  const params = useParams<{ campaignId: string }>();
  const router = useRouter();

  useEffect(() => {
    async function fetchAllLeads() {
      setIsTableLoading(true);
      axiosInstance
        .get(`v2/lead/all/${user.id}`)
        .then((response) => {
          console.log(response);
          setLeads(response.data);
          setIsTableLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setError(error.message || "Failed to fetch leads.");
          setIsTableLoading(false);
        });
    }

    fetchAllLeads();
  }, []);

  function mapLeadsToBodies(leads: Contact[], campaignId: string): Contact[] {
    return leads.map((lead) => ({
      id: uuid(),
      user_id: user.id,
      campaign_id: campaignId,
      type: "prospective",
      first_name: lead.first_name,
      last_name: lead.last_name,
      name: lead.name,
      title: lead.title,
      linkedin_url: lead.linkedin_url,
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
      pain_points: lead.pain_points || [], // Assuming optional or provide default
      value: lead.value || [], // Assuming optional or provide default
      metrics: lead.metrics || [], // Assuming optional or provide default
      compliments: lead.compliments || [], // Assuming optional or provide default
      lead_information: lead.lead_information || String, // Assuming optional or provide default
      isb2b: lead.isb2b,
      score: lead.score,
    }));
  }

  const createAudience = async () => {
    console.log(existingLeads);
    const audienceBody = mapLeadsToBodies(
      existingLeads as Contact[],
      params.campaignId
    );
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
        router.push(`/dashboard/campaign/create/${params.campaignId}`);
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
      <main>
        {isTableLoading ? (
          <LoadingCircle />
        ) : (
          <AudienceTableClient isContacts={true} checkboxes={true} />
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
            Create Audience
          </Button>
        )}
      </main>
    </>
  );
};
