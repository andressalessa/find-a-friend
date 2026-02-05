import { CreatePetDTO, PetResponseDTO, UpdatePetDTO } from "@/dtos/pet.dto";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "generated/prisma/client";
import { IPetRepository } from "../interfaces/pet.repository.interface";

export class PrismaPetRepository implements IPetRepository {
    async create(data: CreatePetDTO): Promise<PetResponseDTO> {
        const pet = await prisma.pet.create({
            data: {
                name: data.name,
                age: data.age,
                size: data.size,
                city: data.city,
                owners_phone: data.owners_phone,
                organizationId: data.organizationId,
            },
        });

        return pet;
    }

    async findById(id: string): Promise<PetResponseDTO | null> {
        const pet = await prisma.pet.findUnique({
            where: { id },
        });

        return pet;
    }

    async findByCity(city: string): Promise<PetResponseDTO[]> {
        const pets = await prisma.pet.findMany({
            where: { city },
        });

        return pets;
    }

    async findByOwnerPhone(owners_phone: string): Promise<PetResponseDTO | null> {
        const pet = await prisma.pet.findFirst({
            where: { owners_phone },
        });

        return pet;
    }

    async update(id: string, data: UpdatePetDTO): Promise<PetResponseDTO> {
        const dataWithoutUndefined = Object.fromEntries(
            Object.entries(data).filter(([, v]) => v !== undefined)
        ) as Prisma.PetUncheckedUpdateInput;

        const pet = await prisma.pet.update({
            where: { id },
            data: dataWithoutUndefined,
        });

        return pet;
    }

}
