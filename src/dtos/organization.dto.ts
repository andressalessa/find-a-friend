import z from "zod"

export const createOrganizationSchema = z.object({
    name: z.string("Name is required"),
    email: z.string("Email is required").email("Invalid email"),
    password: z.string("Password is required"),
    whatsapp: z.string("WhatsApp is required").min(10, "WhatsApp must have 10 to 15 digits").max(15, "WhatsApp must have 10 to 15 digits"),
    address: z.string("Address is required").min(10, "Address must have at least 10 characters"),
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
  whatsapp: string
  address: string
  created_at: Date
  updated_at: Date
}

export type OrganizationEntity = {
  id: string
  name: string
  email: string
  password_hash: string
  whatsapp: string
  address: string
  created_at: Date
  updated_at: Date
}

export const authenticateOrganizationSchema = z.object({
  email: z.string("Email is required").email("Invalid email"),
  password: z.string("Password is required"),
})
