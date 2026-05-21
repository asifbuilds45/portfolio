import { z } from 'zod';

export const experienceSchema = z.object({
  job_title: z.string().min(2, 'Job title is required'),
  company: z.string().min(2, 'Company is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  description: z.string().optional(),
  sort_order: z.coerce.number().default(0),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;