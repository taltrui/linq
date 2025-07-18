import {
  inventoryContract,
  type JobMaterial,
  type AddMaterialToJob,
  type UpdateJobMaterialQuantity,
} from '@repo/api-client/inventory';
import { apiClient } from '../api.js';

const getJobMaterials = async (jobId: string): Promise<JobMaterial[]> => {
  const response = await apiClient.get(
    inventoryContract.getJobMaterials.path.replace(':id', jobId)
  );
  return response.data;
};

const addMaterialToJob = async (
  jobId: string,
  payload: AddMaterialToJob
): Promise<JobMaterial> => {
  const response = await apiClient.post(
    inventoryContract.addMaterialToJob.path.replace(':id', jobId),
    payload
  );
  return response.data;
};

const updateJobMaterialQuantity = async (
  jobId: string,
  itemId: string,
  payload: UpdateJobMaterialQuantity
): Promise<JobMaterial> => {
  const response = await apiClient.patch(
    inventoryContract.updateJobMaterialQuantity.path.replace(':id', jobId).replace(':itemId', itemId),
    payload
  );
  return response.data;
};

const removeMaterialFromJob = async (
  jobId: string,
  itemId: string
): Promise<{ message: string }> => {
  const response = await apiClient.delete(
    inventoryContract.removeMaterialFromJob.path.replace(':id', jobId).replace(':itemId', itemId)
  );
  return response.data;
};

const copyMaterialsFromQuotation = async (
  jobId: string,
  quotationId: string
): Promise<{ count: number }> => {
  const response = await apiClient.post(
    inventoryContract.copyMaterialsFromQuotation.path.replace(':id', jobId),
    { quotationId }
  );
  return response.data;
};

export const jobMaterialsService = {
  getJobMaterials,
  addMaterialToJob,
  updateJobMaterialQuantity,
  removeMaterialFromJob,
  copyMaterialsFromQuotation,
};