import { z } from "zod";

export const Role = {
    OWNER: 'OWNER',
    ADMIN: 'ADMIN',
    WORKER: 'WORKER',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export type Company = {
    id: string;
    name: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
};

export const companiesContract = {
    getUserCompany: {
        path: '/companies/user',
        method: 'GET',
        response: z.object({
            id: z.string(),
            name: z.string(),
            ownerId: z.string(),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
        }),
    },
}

