import { makeOrganizationController } from "@/factories/make-organization.controller";
import { FastifyInstance } from "fastify";

export async function organizationRoutes(app: FastifyInstance) {
    const organizationController = makeOrganizationController();

    app.post('/organizations', organizationController.create);
}
