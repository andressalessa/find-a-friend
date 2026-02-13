import { CreatePetDTO, FilterPetsDTO, PetResponseDTO, UpdatePetDTO } from "@/dtos/pet.dto";
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
                organizationId: data.organizationId,
            },
            include: {
                images: true,
                organization: {
                    select: { id: true, name: true, whatsapp: true },
                },
            },
        });

        return pet as PetResponseDTO;
    }

    async findAll(): Promise<PetResponseDTO[]> {
        const pets = await prisma.pet.findMany({
            include: {
                images: true,
                organization: {
                    select: { id: true, name: true, whatsapp: true },
                },
            },
        });

        return pets as PetResponseDTO[];
    }

    async findById(id: string): Promise<PetResponseDTO | null> {
        const pet = await prisma.pet.findUnique({
            where: { id },
            include: {
                images: true,
                organization: {
                    select: { id: true, name: true, whatsapp: true },
                },
            },
        });

        return pet as PetResponseDTO | null;
    }

    async findByCity(city: string): Promise<PetResponseDTO[]> {
        const pets = await prisma.pet.findMany({
            where: { city },
            include: {
                images: true,
                organization: {
                    select: { id: true, name: true, whatsapp: true },
                },
            },
        });

        return pets as PetResponseDTO[];
    }

    async findByFilter(filter: FilterPetsDTO): Promise<PetResponseDTO[]> {
        const where = Object.fromEntries(
            Object.entries(filter).filter(([, v]) => v !== undefined)
        ) as Prisma.PetWhereInput;

        const pets = await prisma.pet.findMany({
            where,
            include: {
                images: true,
                organization: {
                    select: { id: true, name: true, whatsapp: true },
                },
            },
        });

        return pets as PetResponseDTO[];
    }

    async update(id: string, data: UpdatePetDTO): Promise<PetResponseDTO> {
        const dataWithoutUndefined = Object.fromEntries(
            Object.entries(data).filter(([, v]) => v !== undefined)
        ) as Prisma.PetUncheckedUpdateInput;

        const pet = await prisma.pet.update({
            where: { id },
            data: dataWithoutUndefined,
            include: {
                images: true,
                organization: {
                    select: { id: true, name: true, whatsapp: true },
                },
            },
        });

        return pet as PetResponseDTO;
    }

    async delete(id: string): Promise<void> {
        await prisma.pet.delete({
            where: { id },
        });
    }

}
