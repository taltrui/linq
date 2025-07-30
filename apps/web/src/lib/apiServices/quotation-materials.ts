import {
  inventoryContract,
  type QuoteMaterial,
  type AddMaterialToQuotation,
  type UpdateMaterialQuantity,
} from '@repo/api-client/inventory';
import { apiClient } from '../api.js';

const getQuotationMaterials = async (quotationId: string): Promise<QuoteMaterial[]> => {
  const response = await apiClient.get(
    inventoryContract.getQuotationMaterials.path.replace(':id', quotationId)
  );
  return response.data;
};

const addMaterialToQuotation = async (
  quotationId: string,
  payload: AddMaterialToQuotation
): Promise<{
  quoteMaterial: QuoteMaterial;
  stockWarning: { message: string; availableQuantity: number; requestedQuantity: number } | null;
}> => {
  const response = await apiClient.post(
    inventoryContract.addMaterialToQuotation.path.replace(':id', quotationId),
    payload
  );
  return response.data;
};

const updateMaterialQuantity = async (
  quotationId: string,
  itemId: string,
  payload: UpdateMaterialQuantity
): Promise<{
  quoteMaterial: QuoteMaterial;
  stockWarning: { message: string; availableQuantity: number; requestedQuantity: number } | null;
}> => {
  const response = await apiClient.patch(
    inventoryContract.updateMaterialQuantity.path.replace(':id', quotationId).replace(':itemId', itemId),
    payload
  );
  return response.data;
};

const removeMaterialFromQuotation = async (
  quotationId: string,
  itemId: string
): Promise<{ message: string }> => {
  const response = await apiClient.delete(
    inventoryContract.removeMaterialFromQuotation.path.replace(':id', quotationId).replace(':itemId', itemId)
  );
  return response.data;
};

export const quotationMaterialsService = {
  getQuotationMaterials,
  addMaterialToQuotation,
  updateMaterialQuantity,
  removeMaterialFromQuotation,
};