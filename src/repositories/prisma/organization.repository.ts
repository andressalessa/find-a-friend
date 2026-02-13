import { prisma } from "@/lib/prisma";
import { CreateOrganizationDTO, OrganizationResponseDTO, UpdateOrganizationDTO } from "@/dtos/organization.dto";
import { IOrganizationRepository } from "../interfaces/organization.repository.interface";

export class PrismaOrganizationRepository implements IOrganizationRepository {
    async create(data: CreateOrganizationDTO): Promise<OrganizationResponseDTO> {
        const organization = await prisma.organization.create({
            data: {
                name: data.name,
                email: data.email,
                password_hash: data.password,
                whatsapp: data.whatsapp,
                address: data.address,
            },
        });

        return organization;
    }

    async findById(id: string): Promise<OrganizationResponseDTO | null> {
        return prisma.organization.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: UpdateOrganizationDTO): Promise<OrganizationResponseDTO> {
        const organization = await prisma.organization.update({
            where: { id },
            data: data as { name?: string; whatsapp?: string; address?: string },
        });

        return organization;
    }

    async findByEmail(email: string): Promise<OrganizationResponseDTO | null> {
        return prisma.organization.findUnique({
            where: { email },
        });
    }
}
