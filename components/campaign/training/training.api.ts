export interface TrainingRequest {
  campaign_id: string;
  template: string;
  follow_up_template?: string;
  variables?: Record<string, any>;
  offering_variables?: Record<string, any>;
  personalized_fields?: Record<string, any>;
  enriched_fields?: string[];
  subject_field_options?: string[];
}

export interface TrainingUpdateRequest {
  template?: string;
  follow_up_template?: string;
  variables?: Record<string, any>;
  offering_variables?: Record<string, any>;
  personalized_fields?: Record<string, any>;
  enriched_fields?: string[];
}

export interface TrainingResponse extends TrainingRequest {
  id?: string;
}

export interface TrainTemplateRequest {
  campaign_id: string;
}

export interface PreviewRequest {
  campaign_id: string;
  user_id: string;
  template?: string;
  variables?: Record<string, any>;
  offering_variables?: Record<string, any>;
  personalized_fields?: Record<string, any>;
  enriched_fields?: string[];
}

export interface Email {
  email: string;
  body: string;
}

export interface PreviewResponse {
  contact_id: string;
  email: Email;
}

import axiosInstance from "@/utils/axiosInstance";
import { FieldType, VariableType } from "./types";

export async function createTraining(
  trainingInfo: TrainingRequest
): Promise<TrainingResponse> {
  try {
    const response = await axiosInstance.post<TrainingResponse>(
      "/v2/training/",
      trainingInfo
    );
    return response.data;
  } catch (error) {
    console.error("Error creating training:", error);
    throw error;
  }
}

export async function updateTraining(
  trainingId: string,
  trainingInfo: TrainingRequest
): Promise<TrainingResponse> {
  try {
    const response = await axiosInstance.put<TrainingResponse>(
      `v2/training/${trainingId}`,
      trainingInfo
    );
    return response.data;
  } catch (error) {
    console.error("Error updating training:", error);
    throw error;
  }
}

export async function deleteTraining(trainingId: string): Promise<void> {
  try {
    await axiosInstance.delete<void>(`v2/training/${trainingId}`);
  } catch (error) {
    console.error("Error deleting training:", error);
    throw error;
  }
}

export async function getTrainingByCampaignId(
  campaignId: string
): Promise<TrainingResponse> {
  try {
    const response = await axiosInstance.get<TrainingResponse>(
      `v2/training/campaign/${campaignId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting training:", error);
    throw error;
  }
}

export async function getAutogenerateTrainingTemplate(
  campaignId: string
): Promise<any> {
  try {
    const response = await axiosInstance.get<any>(
      `v2/training/autogenerate/template`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting autogenerated training template:", error);
    throw error;
  }
}

export async function getAutogenerateTrainingEmail(
  campaignId: string,
  userId: string
): Promise<any> {
  try {
    const response = await axiosInstance
      .get<any>(`v2/training/autogenerate/preview/${campaignId}/${userId}`)
      .then((response) => {
        const data = response.data;
        return data;
      });

    return response;
  } catch (error) {
    console.error("Error getting autogenerated training email:", error);
    throw error;
  }
}

export async function getFollowUpOne(
): Promise<any> {
  try {
    const response = await axiosInstance
      .get<any>(`v2/training/autogenerate/followup/1`)
      .then((response) => {
        const data = response.data;
        return data;
      });

    return response;
  } catch (error) {
    console.error("Error getting autogenerated training email:", error);
    throw error;
  }
}

export async function getFollowUpTwo(
): Promise<any> {
  try {
    const response = await axiosInstance
      .get<any>(`v2/training/autogenerate/followup/2`)
      .then((response) => {
        const data = response.data;
        return data;
      });

    return response;
  } catch (error) {
    console.error("Error getting autogenerated training email:", error);
    throw error;
  }
}

export async function startCampaign(
  campaignId: string,
  userId: string,
  type: boolean
): Promise<any> {
  const postData = {
    campaign_id: campaignId,
    user_id: userId,
  };
  await axiosInstance
    .post(`/v2/send/contacts?without_template=${type}`, postData)
    .then((response) => {
      const data = response.data;
      console.log(data);
      return data;
    })
    .catch((err: any) => {
      console.log(err);
      throw err;
    });
}

export async function getTraining(
  campaignId: string
): Promise<TrainingResponse> {
  try {
    const response = await axiosInstance.get<TrainingResponse>(
      `v2/training/${campaignId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting training:", error);
    throw error;
  }
}

export async function getPreviewByTemplate({
  user_id,
  campaign_id,
  template,
  variables,
  offering_variables,
  personalized_fields,
  enriched_fields,
}: {
  user_id: string;
  campaign_id: string;
  template: string;
  variables: VariableType[];
  offering_variables: FieldType[];
  personalized_fields: FieldType[];
  enriched_fields: FieldType[];
}): Promise<any> {
  console.log(
    "data to preview api",
    user_id,
    campaign_id,
    template,
    variables,
    offering_variables,
    personalized_fields,
    enriched_fields
  );
  try {
    const mapFields = (fields: FieldType[] | undefined) =>
      fields?.reduce(
        (acc, field) => {
          acc[field.fieldName] = field.description;
          return acc;
        },
        {} as Record<string, string>
      ) || null;

    const mapVariables = (vars: VariableType[] | undefined) =>
      vars?.reduce(
        (acc, variable) => {
          acc[variable.id] = variable.value;
          return acc;
        },
        {} as Record<string, string>
      ) || null;

    const postData = {
      user_id,
      campaign_id,
      template,
      variables: variables.length ? mapVariables(variables) : null,
      offering_variables: mapFields(offering_variables),
      personalized_fields: mapFields(personalized_fields),
      enriched_fields:
        enriched_fields?.map((field) => field.description) || null,
    };

    console.log(postData);

    const response = await axiosInstance.post<any>(
      `v2/training/preview`,
      postData
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting training preview:", error);
    throw error;
  }
}

export async function getAutogenerateFollowup(
  campaignId: string
): Promise<any> {
  try {
    const response = await axiosInstance.get<any>(
      `v2/training/autogenerate/followup/`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting autogenerated training template:", error);
    throw error;
  }
}
