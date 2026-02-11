import { CreateOrganizationDTO, OrganizationEntity, OrganizationResponseDTO, UpdateOrganizationDTO } from "@/dtos/organization.dto";
import { IOrganizationRepository } from "@/repositories/interfaces/organization.repository.interface";
import { compare, hash } from "bcryptjs";

export class OrganizationService {
    constructor(private organizationRepository: IOrganizationRepository) { }

    async create(
        {
            name, email, password, whatsapp, address
        }: CreateOrganizationDTO): Promise<OrganizationResponseDTO> {
        const userWithSameEmail = await this.organizationRepository.findByEmail(email);

        if (userWithSameEmail) {
            throw new Error("Organization already exists");
        }

        const password_hash = await hash(password, 6);

        const organization = await this.organizationRepository.create({
            name,
            email,
            password: password_hash,
            whatsapp,
            address,
        });

        const { password_hash: _, ...organizationResponse } = organization;
        return organizationResponse;
    }

    async findByEmail(email: string): Promise<OrganizationEntity | null> {
        return this.organizationRepository.findByEmail(email);
    }

    async update(id: string, data: UpdateOrganizationDTO): Promise<OrganizationResponseDTO> {
        const organization = await this.organizationRepository.update(id, data);

        const { password_hash: _, ...organizationResponse } = organization;
        return organizationResponse;
    }

    async authenticate(email: string, password: string): Promise<OrganizationResponseDTO> {
        const organization = await this.organizationRepository.findByEmail(email);

        if (!organization) {
            throw new Error("Organization not found");
        }

        const isPasswordValid = await compare(password, organization.password_hash);

        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        return organization;
    }
}
