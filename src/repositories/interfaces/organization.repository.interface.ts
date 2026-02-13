import { CreateOrganizationDTO, OrganizationResponseDTO, UpdateOrganizationDTO } from "@/dtos/organization.dto";

export interface IOrganizationRepository {
    create(data: CreateOrganizationDTO): Promise<OrganizationResponseDTO>
    findById(id: string): Promise<OrganizationResponseDTO | null>
    findByEmail(email: string): Promise<OrganizationResponseDTO | null>
    update(id: string, data: UpdateOrganizationDTO): Promise<OrganizationResponseDTO>
}
