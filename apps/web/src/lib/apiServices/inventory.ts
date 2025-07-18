import {
  inventoryContract,
  type InventoryItem,
  type CreateInventoryItem,
  type UpdateInventoryItem,
  type AdjustStock,
  type StockLevels,
} from '@repo/api-client/inventory';
import { apiClient } from '../api.js';

const createItem = async (payload: CreateInventoryItem): Promise<InventoryItem> => {
  const response = await apiClient.post(inventoryContract.createItem.path, payload);
  return response.data;
};

const getItems = async (): Promise<InventoryItem[]> => {
  const response = await apiClient.get(inventoryContract.getItems.path);
  return response.data;
};

const getItem = async (id: string): Promise<InventoryItem> => {
  const response = await apiClient.get(inventoryContract.getItem.path.replace(':id', id));
  return response.data;
};

const updateItem = async (id: string, payload: UpdateInventoryItem): Promise<InventoryItem> => {
  const response = await apiClient.patch(
    inventoryContract.updateItem.path.replace(':id', id),
    payload,
  );
  return response.data;
};

const deleteItem = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete(
    inventoryContract.deleteItem.path.replace(':id', id),
  );
  return response.data;
};

const adjustStock = async (id: string, payload: AdjustStock): Promise<any> => {
  const response = await apiClient.post(
    inventoryContract.adjustStock.path.replace(':id', id),
    payload,
  );
  return response.data;
};

const getStockLevels = async (id: string): Promise<StockLevels> => {
  const response = await apiClient.get(
    inventoryContract.getStockLevels.path.replace(':id', id),
  );
  return response.data;
};

export const inventoryService = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  adjustStock,
  getStockLevels,
};