import { z } from "zod";

export const Role = {
    OWNER: 'OWNER',
    ADMIN: 'ADMIN',
    WORKER: 'WORKER',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const CompanySchema = z.object({
    id: z.string(),
    name: z.string(),
    ownerId: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type Company = z.infer<typeof CompanySchema>;

export const UpdateCompanySchema = z.object({
    name: z.string().min(1),
});

export const companiesContract = {
    getMe: {
        path: '/companies/me',
        method: 'GET',
        response: CompanySchema,
    },
    updateMe: {
        path: '/companies/me',
        method: 'PATCH',
        body: UpdateCompanySchema,
        response: CompanySchema,
    },
    deleteMe: {
        path: '/companies/me',
        method: 'DELETE',
        response: z.object({ success: z.boolean() }),
    }
}