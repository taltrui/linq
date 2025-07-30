import { z } from 'zod';
import { Role } from './companies';

export const RegisterSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    companyName: z.string().min(1),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const RequestMagicLinkSchema = z.object({
    email: z.string().email(),
});

export const VerifyMagicLinkSchema = z.object({
    token: z.string().min(1),
});

export type AuthUser = {
    id: string;
    email: string;
    companyId: string;
    role: Role;
};

export type AuthResponse = {
    access_token: string;
};

export const authContract = {
    register: {
        path: '/auth/register',
        method: 'POST',
        body: RegisterSchema,
        response: z.object({ 
            message: z.string(),
            email: z.string() 
        }),
    },
    login: {
        path: '/auth/login',
        method: 'POST',
        body: LoginSchema,
        response: z.object({ access_token: z.string() }),
    },
    requestMagicLink: {
        path: '/auth/request-magic-link',
        method: 'POST',
        body: RequestMagicLinkSchema,
        response: z.object({ 
            message: z.string(),
            email: z.string() 
        }),
    },
    verifyMagicLink: {
        path: '/auth/verify-magic-link',
        method: 'POST',
        body: VerifyMagicLinkSchema,
        response: z.object({ access_token: z.string() }),
    },
    getProfile: {
        path: '/auth/profile',
        method: 'GET',
        response: z.object({
            id: z.string(),
            email: z.string().email(),
            companyId: z.string(),
            role: z.nativeEnum(Role),
        }),
    },
}