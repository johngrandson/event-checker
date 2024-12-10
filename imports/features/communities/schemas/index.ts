import { z } from 'zod';

export const CommunitySchema = z.object({
  _id: z.string(),
  name: z.string(),
});

export type Community = z.infer<typeof CommunitySchema>;

export const CommunityIdSchema = z.string();
