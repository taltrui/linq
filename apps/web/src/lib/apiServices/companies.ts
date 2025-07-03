import { apiContract, type Company, type UpdateCompanySchema } from "@repo/api-client";
import { apiClient } from "../api";
import { z } from "zod";

const getMe = async (): Promise<Company> => {
    const { data } = await apiClient(apiContract.companies.getMe.path, {
        method: apiContract.companies.getMe.method,
    });
    return data;
}

const updateMe = async (payload: z.infer<typeof UpdateCompanySchema>): Promise<Company> => {
    const { data } = await apiClient(apiContract.companies.updateMe.path, {
        method: apiContract.companies.updateMe.method,
        data: payload,
    });
    return data;
}

const deleteMe = async (): Promise<{ success: boolean }> => {
    const { data } = await apiClient(apiContract.companies.deleteMe.path, {
        method: apiContract.companies.deleteMe.method,
    });
    return data;
}

export const companiesService = {
    getMe,
    updateMe,
    deleteMe,
}