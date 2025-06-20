import { z } from 'zod';

export const JobStatus = z.enum([
  'TO_BE_BUDGETED',
  'PENDING',
  'CANCELED',
  'IN_PROGRESS',
  'COMPLETED',
]);

export type JobStatus = z.infer<typeof JobStatus>;

export const JobSchema = z.object({
  id: z.string(),
  displayId: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: JobStatus,
  companyId: z.string(),
  clientId: z.string(),
  createdById: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Job = z.infer<typeof JobSchema>;

export const CreateJobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  clientId: z.string(),
});

export type CreateJob = z.infer<typeof CreateJobSchema>;

export const UpdateJobSchema = CreateJobSchema.partial().extend({
  status: JobStatus.optional(),
});

export type UpdateJob = z.infer<typeof UpdateJobSchema>;

export const jobsContract = {
  create: {
    path: '/jobs',
    method: 'POST',
    body: CreateJobSchema,
    response: JobSchema,
  },
  getList: {
    path: '/jobs',
    method: 'GET',
    response: z.array(JobSchema),
  },
  getById: {
    path: (id: string) => `/jobs/${id}`,
    method: 'GET',
    response: JobSchema,
  },
  update: {
    path: (id: string) => `/jobs/${id}`,
    method: 'PATCH',
    body: UpdateJobSchema,
    response: JobSchema,
  },
  delete: {
    path: (id: string) => `/jobs/${id}`,
    method: 'DELETE',
    response: z.object({ success: z.boolean() }),
  },
}; 