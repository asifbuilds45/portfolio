import { z } from 'zod';

export const educationSchema = z.object({
  degree: z.string().min(2, 'Degree is required'),
  institution: z.string().min(2, 'Institution is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  description: z.string().optional(),
  sort_order: z.coerce.number().default(0),
});

export type EducationFormValues = z.infer<typeof educationSchema>;