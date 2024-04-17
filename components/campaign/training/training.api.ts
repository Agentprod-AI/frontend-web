import { TrainingRequest, TrainingResponse } from './field-form-modal';
import axiosInstance from '@/utils/axiosInstance';
export async function createTraining(trainingInfo: TrainingRequest): Promise<TrainingResponse> {
  try {
    const response = await axiosInstance.post<TrainingResponse>('/v2/training/', trainingInfo);
    return response.data;
  } catch (error) {
    console.error('Error creating training:', error);
    throw error;
  }
}
export async function updateTraining(trainingId: string, trainingInfo: TrainingRequest): Promise<TrainingResponse> {
  try {
    const response = await axiosInstance.put<TrainingResponse>(`v2/training/${trainingId}`, trainingInfo);
    return response.data;
  } catch (error) {
    console.error('Error updating training:', error);
    throw error;
  }
}

export async function deleteTraining(trainingId: string): Promise<void> {
  try {
    await axiosInstance.delete<void>(`v2/training/${trainingId}`);
  } catch (error) {
    console.error('Error deleting training:', error);
    throw error;
  }
}

export async function getTraining(
  trainingId: string
): Promise<TrainingResponse> {
  try {
    const response = await axiosInstance.get<TrainingResponse>('v2/training/9f06d007-a3f2-47c9-80e5-1dd2b13d6618');
    ;
    return response.data;
  } catch (error) {
    console.error("Error getting training:", error);
    throw error;
  }
}

export async function getAutogenerateTrainingTemplate(campaignId: string): Promise<any> {
  try {
    const response = await axiosInstance.get<any>(`v2/training/autogenerate/template/${campaignId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting autogenerated training template:', error);
    throw error;
  }
}

export async function getAutogenerateTrainingEmail(campaignId: string): Promise<any> {
  try {
    const response = await axiosInstance.get<any>(`v2/training/autogenerate/email/861b9727-0eb0-4c1d-b5dd-15114a9e08ef`);
    return response.data;
  } catch (error) {
    console.error('Error getting autogenerated training email:', error);
    throw error;
  }
}