import { z } from 'zod';

export const PersonSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  title: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  checkInDate: z.date().nullable().optional(),
  checkOutDate: z.date().nullable().optional(),
  canCheckOut: z.boolean().optional(),
  communityId: z.string(),
});

export type Person = z.infer<typeof PersonSchema>;

export const PersonUpdateSchema = PersonSchema.partial();
export const PersonIdSchema = z.string();

export interface CheckedInData {
  companyName: string;
  totalCheckedIn: number;
}

export interface PeopleFilters {
  firstName?: string;
  [key: string]: any;
}
