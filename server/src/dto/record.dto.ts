import { z } from 'zod';

export const CreateRecordDto = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100),

  description: z
    .string()
    .min(5, 'Description must be at least 5 characters'),

  status: z
    .enum(['Active', 'Pending', 'Closed', 'Archived'])
    .optional(),

  priority: z
    .enum(['Low', 'Medium', 'High', 'Critical'])
    .optional(),

assignedTo: z
    .string()
    .min(1, 'Assigned user id is required'),

  category: z
    .string()
    .min(2)
    .max(50)
    .optional(),

  dueDate: z
    .string()
    .datetime()
    .optional(),

  progress: z
    .number()
    .min(0)
    .max(100)
    .optional(),
});

export type CreateRecordDto = z.infer<typeof CreateRecordDto>;



export const UpdateRecordDto = z.object({
  title: z
    .string()
    .min(3)
    .max(100)
    .optional(),

  description: z
    .string()
    .min(5)
    .optional(),

  status: z
    .enum(['Active', 'Pending', 'Closed', 'Archived'])
    .optional(),

  priority: z
    .enum(['Low', 'Medium', 'High', 'Critical'])
    .optional(),

  assignedTo: z
    .string()
    .optional(),

  category: z
    .string()
    .min(2)
    .max(50)
    .optional(),

  dueDate: z
    .string()
    .datetime()
    .optional(),

  progress: z
    .number()
    .min(0)
    .max(100)
    .optional(),
});

export type UpdateRecordDto = z.infer<typeof UpdateRecordDto>;