import { CreatePetDTO, FilterPetsDTO, PetResponseDTO, UpdatePetDTO } from "@/dtos/pet.dto"

export interface IPetRepository {
    create(data: CreatePetDTO): Promise<PetResponseDTO>
    findById(id: string): Promise<PetResponseDTO | null>
    findByCity(city: string): Promise<PetResponseDTO[]>
    findByFilter(filter: FilterPetsDTO): Promise<PetResponseDTO[]>
    update(id: string, data: UpdatePetDTO): Promise<PetResponseDTO>
}
