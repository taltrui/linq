import { apiContract, type Company } from "@repo/api-client";
import { apiClient } from "../api";

const getUserCompany = async (): Promise<Company> => {
    const { data } = await apiClient(apiContract.companies.getUserCompany.path, {
        method: apiContract.companies.getUserCompany.method,
    });
    return data;
}


export const companiesService = {
    getUserCompany,
}