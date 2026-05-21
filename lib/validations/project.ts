import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(2, 'Project name is required'),
  description: z.string().min(10, 'Description is required'),
  tech_stack: z.string().min(1, 'At least one technology is required'),
  github_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  live_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  sort_order: z.coerce.number().default(0),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;