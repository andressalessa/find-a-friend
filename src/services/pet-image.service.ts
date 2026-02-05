import { CreatePetImageDTO, PetImageResponseDTO } from "@/dtos/pet-image.dto";
import { IPetImageRepository } from "@/repositories/interfaces/pet-image.repository.interface";

export class PetImageService {
    constructor(private petImageRepository: IPetImageRepository) { }

    async create(data: CreatePetImageDTO): Promise<PetImageResponseDTO> {
        return await this.petImageRepository.create(data);
    }

    async findByPetId(pet_id: string): Promise<PetImageResponseDTO[]> {
        return await this.petImageRepository.findByPetId(pet_id);
    }

    async findById(id: string): Promise<PetImageResponseDTO | null> {
        return await this.petImageRepository.findById(id);
    }
}
