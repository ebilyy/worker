import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(['USER', 'HR', 'ADMIN']),
  avatar_url: z.string().url().nullable(),
  company_id: z.string().uuid().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
})

export type User = z.infer<typeof UserSchema>

export const CreateUserSchema = UserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
}).partial({
  avatar_url: true,
  company_id: true
})

export type CreateUser = z.infer<typeof CreateUserSchema>

export const UpdateUserSchema = CreateUserSchema.partial()

export type UpdateUser = z.infer<typeof UpdateUserSchema>
