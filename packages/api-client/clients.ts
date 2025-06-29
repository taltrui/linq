import { z } from "zod";

export const ClientSchema = z.object({
  id: z.string(),
  displayId: z.string(),
  name: z.string(),
  phone: z.string(),
  address: z.string(),
  email: z.string().nullable(),
  companyId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  country: z.string().min(1),
});
export type Address = z.infer<typeof AddressSchema>;

export type Client = z.infer<typeof ClientSchema>;

export const CreateClientSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  address: AddressSchema,
  email: z.string().email().nullable(),
});

export type CreateClient = z.infer<typeof CreateClientSchema>;

export const UpdateClientSchema = CreateClientSchema.partial();

export type UpdateClient = z.infer<typeof UpdateClientSchema>;

export const clientsContract = {
  create: {
    path: "/clients",
    method: "POST",
    body: CreateClientSchema,
    response: ClientSchema,
  },
  getList: {
    path: "/clients",
    method: "GET",
    response: z.array(ClientSchema),
  },
  getById: {
    path: (id: string) => `/clients/${id}`,
    method: "GET",
    response: ClientSchema,
  },
  update: {
    path: (id: string) => `/clients/${id}`,
    method: "PATCH",
    body: UpdateClientSchema,
    response: ClientSchema,
  },
  delete: {
    path: (id: string) => `/clients/${id}`,
    method: "DELETE",
    response: z.object({ success: z.boolean() }),
  },
};
