import { CreateOrganizationDTO, createOrganizationSchema } from "@/dtos/organization.dto";
import { OrganizationService } from "@/services/organization.service";
import { FastifyReply, FastifyRequest } from "fastify";

export class OrganizationController {
    constructor(private organizationService: OrganizationService) { }

    create = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = createOrganizationSchema.parse(request.body);
        const organizationWithSameEmail = await this.organizationService.findByEmail(data.email);

        if (organizationWithSameEmail) {
            return reply.status(400).send({ message: "Organization with same email already exists" });
        }

        const organization = await this.organizationService.create(data);

        return reply.status(201).send(organization);
    }
}
