import z from "zod"

export const createOrganizationSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    whatsapp: z.string().min(10).max(15),
    address: z.string().min(10),
})

export type CreateOrganizationDTO = z.infer<typeof createOrganizationSchema>

export const updateOrganizationSchema = z.object({
  name: z.string().optional(),
  whatsapp: z.string().min(10).max(15).optional(),
  address: z.string().min(10).optional(),
})

export type UpdateOrganizationDTO = z.infer<typeof updateOrganizationSchema>

export type OrganizationResponseDTO = {
  id: string
  name: string
  email: string
  password_hash: string
  whatsapp: string
  address: string
  created_at: Date
  updated_at: Date
}
