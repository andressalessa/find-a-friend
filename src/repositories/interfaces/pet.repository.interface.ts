import { CreatePetDTO, PetResponseDTO, UpdatePetDTO } from "@/dtos/pet.dto"

export interface IPetRepository {
    create(data: CreatePetDTO): Promise<PetResponseDTO>
    findById(id: string): Promise<PetResponseDTO | null>
    findByCity(city: string): Promise<PetResponseDTO[]>
    findByOwnerPhone(owners_phone: string): Promise<PetResponseDTO | null>
    update(id: string, data: UpdatePetDTO): Promise<PetResponseDTO>
}
