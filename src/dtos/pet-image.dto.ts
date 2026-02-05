import z from "zod"

export const createPetImageSchema = z.object({
    url: z.string("URL is required"),
    pet_id: z.string("Pet ID is required"),
})

export type CreatePetImageDTO = z.infer<typeof createPetImageSchema>

export type PetImageResponseDTO = {
    id: string
    url: string
    pet_id: string
    created_at: Date
    updated_at: Date
}
