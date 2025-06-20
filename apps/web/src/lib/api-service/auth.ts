import { apiContract, type AuthResponse, type User } from "@repo/api-client";
import { apiClient } from "../api";
import { z } from "zod";

const login = async (payload: z.infer<typeof apiContract.auth.login.body>): Promise<AuthResponse> => {
    const { data } = await apiClient(apiContract.auth.login.path, {
        method: apiContract.auth.login.method,
        data: payload,
    });
    return data;
};

const register = async (payload: z.infer<typeof apiContract.auth.register.body>): Promise<AuthResponse> => {
    const { data } = await apiClient(apiContract.auth.register.path, {
        method: apiContract.auth.register.method,
        data: payload,
    });
    return data;
};  

const getProfile = async (): Promise<User> => {
    const { data } = await apiClient(apiContract.auth.getProfile.path, {
        method: apiContract.auth.getProfile.method,
    });
    return data;
};

export const authService = {
    login,
    register,
    getProfile,
}