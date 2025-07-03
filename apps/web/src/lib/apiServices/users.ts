import { apiContract, type User } from "@repo/api-client";
import { apiClient } from "../api";

const listCompanyUsers = async (): Promise<User[]> => {
    const { data } = await apiClient(apiContract.users.list.path, {
        method: apiContract.users.list.method,
    });
    return data;
}

export const usersService = {
    listCompanyUsers,
}