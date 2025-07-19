import {
  inventoryContract,
  type Supplier,
  type CreateSupplier,
  type UpdateSupplier,
} from '@repo/api-client/inventory';
import { apiClient } from '../api.js';

const create = async (payload: CreateSupplier): Promise<Supplier> => {
  const response = await apiClient.post(inventoryContract.createSupplier.path, payload);
  return response.data;
};

const getList = async ({ search }: { search?: string } = {}): Promise<Supplier[]> => {
  const response = await apiClient.get(inventoryContract.getSuppliers.path, { 
    params: search ? { search } : undefined
  });
  return response.data;
};

const getById = async (id: string): Promise<Supplier> => {
  const response = await apiClient.get(inventoryContract.getSupplier.path.replace(':id', id));
  return response.data;
};

const update = async (id: string, payload: UpdateSupplier): Promise<Supplier> => {
  const response = await apiClient.patch(
    inventoryContract.updateSupplier.path.replace(':id', id),
    payload,
  );
  return response.data;
};

const deleteById = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete(
    inventoryContract.deleteSupplier.path.replace(':id', id),
  );
  return response.data;
};

export const suppliersService = {
  create,
  getList,
  getById,
  update,
  delete: deleteById,
};