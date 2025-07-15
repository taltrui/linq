import {
  apiContract,
  type Quotation,
  type UpdateQuotation,
  type CreateQuotation,
} from "@repo/api-client";
import { apiClient } from "../api";
import { z } from "zod";

const create = async (payload: CreateQuotation): Promise<Quotation> => {
  const response = await apiClient.post(
    apiContract.quotations.create.path,
    payload
  );
  return response.data;
};

const getList = async (): Promise<Quotation[]> => {
  const response = await apiClient.get(apiContract.quotations.list.path);
  return response.data;
};

const getById = async (id: string): Promise<Quotation> => {
  const response = await apiClient.get(apiContract.quotations.getById.path(id));
  return response.data;
};

const update = async (
  id: string,
  payload: UpdateQuotation
): Promise<Quotation> => {
  const response = await apiClient.patch(
    apiContract.quotations.update.path(id),
    payload
  );
  return response.data;
};

const sendEmail = async (
  id: string,
  payload: z.infer<typeof apiContract.quotations.sendEmail.body>
): Promise<{ message: string }> => {
  const response = await apiClient.post(
    apiContract.quotations.sendEmail.path(id),
    payload
  );
  return response.data;
};

export const quotationsService = {
  create,
  getList,
  getById,
  update,
  sendEmail,
};
