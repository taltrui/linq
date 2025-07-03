import {
  apiContract,
  type Client,
  type CreateClient,
  type UpdateClient,
} from '@repo/api-client';
import { apiClient } from '../api.js';

const create = async (payload: CreateClient): Promise<Client> => {
  const response = await apiClient.post(apiContract.clients.create.path, payload);
  return response.data;
};

const getList = async ({ search }: { search?: string }): Promise<Client[]> => {
  const response = await apiClient.get(apiContract.clients.getList.path, { params: { search } });
  return response.data;
};

const getById = async (id: string): Promise<Client> => {
  const response = await apiClient.get(apiContract.clients.getById.path(id));
  return response.data;
};

const update = async (id: string, payload: UpdateClient): Promise<Client> => {
  const response = await apiClient.patch(
    apiContract.clients.update.path(id),
    payload,
  );
  return response.data;
};

const deleteById = async (id: string): Promise<{ success: boolean }> => {
  const response = await apiClient.delete(
    apiContract.clients.delete.path(id),
  );
  return response.data;
};

export const clientsService = {
  create,
  getList,
  getById,
  update,
  delete: deleteById,
}; 