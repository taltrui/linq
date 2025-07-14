import { z } from "zod";
import { ClientSchema } from "./clients";

export const QuotationStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "CANCELED",
]);

export const QuotationItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.string(),
});

export type QuotationItem = z.infer<typeof QuotationItemSchema>;

export const QuotationSchema = z.object({
  id: z.string(),
  quotationNumber: z.string(),
  clientId: z.string(),
  client: ClientSchema.pick({ id: true, name: true, email: true, phone: true }),
  companyId: z.string(),
  status: QuotationStatusSchema,
  totalAmount: z.string(),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  approvedAt: z.string().datetime().nullable(),
  approvedByUserId: z.string().nullable(),
  quotationItems: z.array(QuotationItemSchema),
  title: z.string(),
  description: z.string().nullable(),
});

export type Quotation = z.infer<typeof QuotationSchema>;

export const CreateQuotationPayload = z.object({
  clientId: z.string().trim().min(1, {
    message: "El cliente es requerido",
  }),
  notes: z.string().trim().nullable(),
  items: z.array(QuotationItemSchema).min(1, {
    message: "Debe agregar al menos un ítem a la cotización",
  }),
  title: z.string().trim().min(1, {
    message: "El título es requerido",
  }),
  description: z.string().trim().nullable(),
});

export type CreateQuotation = z.infer<typeof CreateQuotationPayload>;

export const UpdateQuotationPayload = z.object({
  status: QuotationStatusSchema.optional(),
  notes: z.string().optional(),
});

export type UpdateQuotation = z.infer<typeof UpdateQuotationPayload>;

export const quotationsContract = {
  create: {
    path: "/quotations",
    method: "POST",
    body: CreateQuotationPayload,
    response: QuotationSchema,
  },
  list: {
    path: "/quotations",
    method: "GET",
    response: z.array(QuotationSchema),
  },
  getById: {
    path: (id: string) => `/quotations/${id}`,
    method: "GET",
    response: QuotationSchema,
  },
  update: {
    path: (id: string) => `/quotations/${id}`,
    method: "PATCH",
    body: UpdateQuotationPayload,
    response: QuotationSchema,
  },
  sendEmail: {
    path: (id: string) => `/quotations/${id}/send-email`,
    method: "POST",
    body: z.object({ recipientEmail: z.string().email() }),
    response: z.object({ message: z.string() }),
  },
};
