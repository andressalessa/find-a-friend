import { CreatePetDTO, PetResponseDTO, UpdatePetDTO } from "@/dtos/pet.dto";
import { IPetRepository } from "@/repositories/interfaces/pet.repository.interface";

export class PetService {
    constructor(private petRepository: IPetRepository) { }
    async create(data: CreatePetDTO): Promise<PetResponseDTO> {
        const pet = await this.petRepository.create(data);
        return pet;
    }

    async findById(id: string): Promise<PetResponseDTO | null> {
        const pet = await this.petRepository.findById(id);
        return pet;
    }

    async findByCity(city: string): Promise<PetResponseDTO[]> {
        const pets = await this.petRepository.findByCity(city);
        return pets;
    }

    async findByOwnerPhone(owners_phone: string): Promise<PetResponseDTO | null> {
        const pet = await this.petRepository.findByOwnerPhone(owners_phone);
        return pet;
    }

    async update(id: string, data: UpdatePetDTO): Promise<PetResponseDTO> {
        const pet = await this.petRepository.update(id, data);
        return pet;
    }
}
