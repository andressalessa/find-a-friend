import { CreateOrganizationDTO } from "@/dtos/organization.dto";
import { OrganizationService } from "@/services/organization.service";
import { FastifyReply, FastifyRequest } from "fastify";

export class OrganizationController {
    constructor(private organizationService: OrganizationService) { }

    create = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = request.body as CreateOrganizationDTO;
        const organization = await this.organizationService.create(data);

        return reply.status(201).send(organization);
    }
}
