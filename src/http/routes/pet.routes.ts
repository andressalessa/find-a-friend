import { makePetController } from "@/factories/make-pet.controller";
import { FastifyInstance } from "fastify";

export async function petRoutes(app: FastifyInstance) {
    const petController = makePetController();

    app.post('/pets', {
        schema: {
            summary: 'Create a pet',
            tags: ['Pets'],
            body: {
                type: 'object',
                required: ['name', 'age', 'size', 'city', 'owners_phone', 'organizationId'],
                properties: {
                    name: { type: 'string' },
                    age: { type: 'number' },
                    size: { type: 'string', enum: ['SMALL', 'MEDIUM', 'LARGE'] },
                    city: { type: 'string' },
                    owners_phone: { type: 'string' },
                    organizationId: { type: 'string' },
                },
            },
            response: {
                201: {
                    description: 'Pet created successfully',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        age: { type: 'number' },
                        size: { type: 'string' },
                        city: { type: 'string' },
                        owners_phone: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                        organizationId: { type: 'string' },
                    },
                },
            },
        }
    }, petController.create);
}
