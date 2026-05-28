import { z } from 'zod';

export const CreateUserDto = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50),

  email: z
    .string()
    .email('Invalid email'),

  password: z
    .string()
    .min(4, 'Password must be at least 4 characters')
    .max(20),

  role: z.enum(['Admin', 'General User']),
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;



export const UpdateUserDto = z.object({
  name: z
    .string()
    .min(3)
    .max(50)
    .optional(),

  email: z
    .string()
    .email('Invalid email')
    .optional(),

  role: z
    .enum(['Admin', 'General User'])
    .optional(),

  department: z
    .string()
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDto>;