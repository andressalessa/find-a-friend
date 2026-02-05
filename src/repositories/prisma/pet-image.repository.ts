import { CreatePetImageDTO, PetImageResponseDTO } from "@/dtos/pet-image.dto";
import { IPetImageRepository } from "../interfaces/pet-image.repository.interface";
import { prisma } from "@/lib/prisma";

export class PrismaPetImageRepository implements IPetImageRepository {
    async create(data: CreatePetImageDTO): Promise<PetImageResponseDTO> {
        const petImage = await prisma.petImage.create({
            data: {
                url: data.url,
                pet_id: data.pet_id,
            }
        });

        return petImage;
    }

    async findByPetId(pet_id: string): Promise<PetImageResponseDTO[]> {
        const petImages = await prisma.petImage.findMany({
            where: {
                pet_id,
            },
        });

        return petImages;
    }

    async findById(id: string): Promise<PetImageResponseDTO | null> {
        const petImage = await prisma.petImage.findUnique({
            where: {
                id,
            },
        });

        return petImage;
    }
}
