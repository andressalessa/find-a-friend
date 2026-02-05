import { CreatePetImageDTO, PetImageResponseDTO } from "@/dtos/pet-image.dto";

export interface IPetImageRepository {
    create(data: CreatePetImageDTO): Promise<PetImageResponseDTO>
    findByPetId(pet_id: string): Promise<PetImageResponseDTO[]>
    findById(id: string): Promise<PetImageResponseDTO | null>
}
