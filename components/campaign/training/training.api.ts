import axiosInstance from '@/utils/axiosInstance';
import { TrainingRequest, TrainingResponse } from './field-form-modal';

export async function createTraining(trainingInfo: TrainingRequest): Promise<TrainingResponse> {
  try {
    const response = await axiosInstance.post<TrainingResponse>('/api/training', trainingInfo);
    return response.data;
  } catch (error) {
    console.error('Error creating training:', error);
    throw error;
  }
}
 
export async function updateTraining(trainingInfo: TrainingRequest): Promise<TrainingResponse> {
    try {
      const response = await axiosInstance.put<TrainingResponse>(`/api/training/trainingInfo/1234`, trainingInfo);
      return response.data;
    } catch (error) {
      console.error('Error updating training:', error);
      throw error;
    }
  }

export async function deleteTraining(trainingId: string): Promise<void> {
  try {
    await axiosInstance.delete<void>(`/api/training/${trainingId}`);
  } catch (error) {
    console.error('Error deleting training:', error);
    throw error;
  }
}
export async function getTraining(trainingId: string): Promise<TrainingResponse> {
    try {
      const response = await axiosInstance.get<TrainingResponse>(`/api/training/${trainingId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting training:', error);
      throw error;
    }
  }