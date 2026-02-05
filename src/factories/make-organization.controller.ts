import { OrganizationController } from "@/http/controllers/organization.controller";
import { PrismaOrganizationRepository } from "@/repositories/prisma/organization.repository";
import { OrganizationService } from "@/services/organization.service";

export function makeOrganizationController() {
    const organizationRepository = new PrismaOrganizationRepository();
    const organizationService = new OrganizationService(organizationRepository);
    const organizationController = new OrganizationController(organizationService);

    return organizationController;
}
