import { z } from 'zod'

export const JobSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(100),
  company_id: z.string().uuid(),
  description: z.string().min(10),
  requirements: z.array(z.string()),
  responsibilities: z.array(z.string()),
  location: z.string(),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']),
  experience: z.enum(['ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD']),
  category: z.string(),
  salary: z.object({
    min: z.number().nullable(),
    max: z.number().nullable(),
    currency: z.enum(['USD', 'EUR', 'UAH'])
  }),
  skills: z.array(z.string()),
  benefits: z.array(z.string()),
  is_remote: z.boolean(),
  is_featured: z.boolean(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']),
  applications_count: z.number(),
  views_count: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
})

export type Job = z.infer<typeof JobSchema>

export const CreateJobSchema = JobSchema.omit({
  id: true,
  applications_count: true,
  views_count: true,
  created_at: true,
  updated_at: true
}).extend({
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  is_featured: z.boolean().default(false)
})

export type CreateJob = z.infer<typeof CreateJobSchema>

export const UpdateJobSchema = CreateJobSchema.partial()

export type UpdateJob = z.infer<typeof UpdateJobSchema>

export interface JobFilters {
  search: string
  location: string
  category: string
  type: string
  experience: string
  salary: {
    min: number | null
    max: number | null
  }
}
