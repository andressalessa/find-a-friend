import { celularRegex, normalizePhone } from "@/utils/string-validations.util";
import z from "zod";

export const createPetSchema = z.object({
    name: z.string("Name is required"),
    age: z.number("Age is required"),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE'], { error: "Size must be SMALL, MEDIUM or LARGE" }),
    city: z.string("City is required"),
    owners_phone: z.string("Owner phone is required").transform(normalizePhone).refine((v) => celularRegex.test(v), "Invalid phone. Use area code + 9 + number (e.g. 11987654321)"),
    organizationId: z.string("Organization ID is required"),
})

export type CreatePetDTO = z.infer<typeof createPetSchema>

export const updatePetSchema = z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
    city: z.string().optional(),
    owners_phone: z.optional(z.string().transform(normalizePhone).refine((v) => celularRegex.test(v), "Invalid phone. Use area code + 9 + number (e.g. 11987654321)")),
    organizationId: z.string().optional(),
})

export type UpdatePetDTO = z.infer<typeof updatePetSchema>

export type PetResponseDTO = {
    id: string
    name: string
    age: number
    size: string
    city: string
    owners_phone: string
    created_at: Date
    updated_at: Date
    organizationId: string
}
