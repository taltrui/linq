import {
  apiContract,
  type Job,
  type CreateJob,
  type UpdateJob,
  JobStatus,
} from '@repo/api-client';
import { apiClient } from '../api';

const create = async (payload: CreateJob): Promise<Job> => {
  const response = await apiClient.post(apiContract.jobs.create.path, payload);
  return response.data;
};

const getList = async ({ status, clientId }: { status?: JobStatus, clientId?: string }): Promise<Job[]> => {
  const response = await apiClient.get(apiContract.jobs.getList.path, { params: { status, clientId } });
  return response.data;
};

const getById = async (id: string): Promise<Job> => {
  const response = await apiClient.get(apiContract.jobs.getById.path(id));
  return response.data;
};

const update = async (id: string, payload: UpdateJob): Promise<Job> => {
  const response = await apiClient.patch(
    apiContract.jobs.update.path(id),
    payload,
  );
  return response.data;
};

const deleteById = async (id: string): Promise<{ success: boolean }> => {
  const response = await apiClient.delete(apiContract.jobs.delete.path(id));
  return response.data;
};

export const jobsService = {
  create,
  getList,
  getById,
  update,
  delete: deleteById,
}; 