import z from "zod";
import { PetImageResponseDTO } from "./pet-image.dto";

export const createPetSchema = z.object({
    name: z.string("Name is required"),
    age: z.number("Age is required"),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE'], { error: "Size must be SMALL, MEDIUM or LARGE" }),
    city: z.string("City is required"),
    organizationId: z.string("Organization ID is required"),
})

export type CreatePetDTO = z.infer<typeof createPetSchema>

export const updatePetSchema = z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
    city: z.string().optional(),
    organizationId: z.string().optional(),
})

export type UpdatePetDTO = z.infer<typeof updatePetSchema>

export const filterPetsSchema = z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
    city: z.string("City is required"),
    organizationId: z.string().optional(),
})

export type FilterPetsDTO = z.infer<typeof filterPetsSchema>

export type PetResponseDTO = {
    id: string
    name: string
    age: number
    size: string
    city: string
    created_at: Date
    updated_at: Date
    organizationId: string
    images?: PetImageResponseDTO[]
}
