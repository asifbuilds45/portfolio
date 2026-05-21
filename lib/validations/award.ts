import { z } from 'zod';

export const awardSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  sort_order: z.coerce.number().default(0),
});

export type AwardFormValues = z.infer<typeof awardSchema>;