import { makeOrganizationController } from "@/factories/make-organization.controller";
import { FastifyInstance } from "fastify";

export async function organizationRoutes(app: FastifyInstance) {
    const organizationController = makeOrganizationController();

    app.post('/organizations', {
        schema: {
            summary: 'Create an organization',
            tags: ['Organizations'],
            body: {
                type: 'object',
                required: ['name', 'email', 'password', 'whatsapp', 'address'],
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                    whatsapp: { type: 'string' },
                    address: { type: 'string' },
                },
            },
            response: {
                201: {
                    description: 'Organization created successfully',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        whatsapp: { type: 'string' },
                        address: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                    },
                },
            },
        }
    }, organizationController.create);
}
