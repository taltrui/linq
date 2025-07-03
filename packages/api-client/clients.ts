import { z } from "zod";

export const AddressSchema = z.object({
  street: z.string().min(1, "Calle es requerida"),
  city: z.string().min(1, "Ciudad es requerida"),
  state: z.string().min(1, "Provincia es requerida"),
  zipCode: z.string().min(1, "Código Postal es requerido"),
  country: z.string().min(1, "País es requerido"),
});

export const ClientSchema = z.object({
  id: z.string(),
  displayId: z.string(),
  name: z.string(),
  phone: z.string(),
  address: AddressSchema,
  email: z.string(),
  companyId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Address = z.infer<typeof AddressSchema>;

export type Client = z.infer<typeof ClientSchema>;

export const CreateClientSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  phone: z.string().min(1, "Teléfono es requerido"),
  address: AddressSchema,
  email: z.string().min(1, "Email es requerido").email("Email no es válido"),
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
