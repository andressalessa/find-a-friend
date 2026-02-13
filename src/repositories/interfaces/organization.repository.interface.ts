import { CreateOrganizationDTO, OrganizationEntity, UpdateOrganizationDTO } from "@/dtos/organization.dto";

export interface IOrganizationRepository {
    create(data: CreateOrganizationDTO): Promise<OrganizationEntity>
    findById(id: string): Promise<OrganizationEntity | null>
    findByEmail(email: string): Promise<OrganizationEntity | null>
    update(id: string, data: UpdateOrganizationDTO): Promise<OrganizationEntity>
}
