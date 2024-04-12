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
    const response = await axiosInstance.put<TrainingResponse>(`/v2/training/${trainingId}`, trainingInfo);
    return response.data;
  } catch (error) {
    console.error('Error updating training:', error);
    throw error;
  }
}

export async function deleteTraining(trainingId: string): Promise<void> {
  try {
    await axiosInstance.delete<void>(`/v2/training/${trainingId}`);
  } catch (error) {
    console.error('Error deleting training:', error);
    throw error;
  }
}

export async function getTraining(
  trainingId: string
): Promise<TrainingResponse> {
  try {
    const response = await axiosInstance.get<TrainingResponse>('/v2/training/482b7b80-4681-422b-9d40-f7253f4a8305');
    ;
    return response.data;
  } catch (error) {
    console.error("Error getting training:", error);
    throw error;
  }
}

export async function getAutogenerateTrainingTemplate(campaignId: string): Promise<any> {
  try {
    const response = await axiosInstance.get<any>(`/v2/training/autogenerate/template/${campaignId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting autogenerated training template:', error);
    throw error;
  }
}

export async function getAutogenerateTrainingEmail(campaignId: string): Promise<any> {
  try {
    const response = await axiosInstance.get<any>(`/v2/training/autogenerate/email/${campaignId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting autogenerated training email:', error);
    throw error;
  }
}