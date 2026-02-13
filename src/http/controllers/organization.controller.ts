import { authenticateOrganizationSchema, createOrganizationSchema } from "@/dtos/organization.dto";
import { OrganizationService } from "@/services/organization.service";
import { FastifyRequest, FastifyReply } from "fastify";

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

    authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = authenticateOrganizationSchema.parse(request.body);
        const organization = await this.organizationService.authenticate(data.email, data.password);

        const token = await reply.jwtSign(
            {},
            {
                sign: {
                    sub: organization.id,
                },
            }
        );

        return reply.status(200).send({ token });
    }
}
