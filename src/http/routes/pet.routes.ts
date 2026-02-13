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
                required: ['name', 'age', 'size', 'city', 'organizationId'],
                properties: {
                    name: { type: 'string' },
                    age: { type: 'number' },
                    size: { type: 'string', enum: ['SMALL', 'MEDIUM', 'LARGE'] },
                    city: { type: 'string' },
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
                        adopted_at: { type: 'string', format: 'date-time', nullable: true },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                        organizationId: { type: 'string' },
                    },
                },
            },
        }
    }, petController.create);

    app.get('/pets', {
        schema: {
            summary: 'Get all pets',
            tags: ['Pets'],
            response: {
                200: {
                    description: 'Pets found successfully',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            age: { type: 'number' },
                            size: { type: 'string' },
                            city: { type: 'string' },
                            adopted_at: { type: 'string', format: 'date-time', nullable: true },
                            created_at: { type: 'string', format: 'date-time' },
                            updated_at: { type: 'string', format: 'date-time' },
                            organizationId: { type: 'string' },
                            images: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        url: { type: 'string', description: 'Full URL to the image' },
                                        pet_id: { type: 'string' },
                                        created_at: { type: 'string', format: 'date-time' },
                                        updated_at: { type: 'string', format: 'date-time' },
                                    },
                                },
                            }
                        },
                    },
                },
            },
        }
    }, petController.findAll);

    app.get('/pets/:id', {
        schema: {
            summary: 'Get a pet by id',
            tags: ['Pets'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                },
            },
            response: {
                200: {
                    description: 'Pet found successfully',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        age: { type: 'number' },
                        size: { type: 'string' },
                        city: { type: 'string' },
                        adopted_at: { type: 'string', format: 'date-time', nullable: true },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                        organizationId: { type: 'string' },
                        images: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    url: { type: 'string', description: 'Full URL to the image' },
                                    pet_id: { type: 'string' },
                                    created_at: { type: 'string', format: 'date-time' },
                                    updated_at: { type: 'string', format: 'date-time' },
                                },
                            },
                        },
                    },
                },
            },
        }
    }, petController.findById);

    app.get('/pets/filter', {
        schema: {
            summary: 'Get pets by filter',
            tags: ['Pets'],
            query: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    age: { type: 'number' },
                    size: { type: 'string', enum: ['SMALL', 'MEDIUM', 'LARGE'] },
                    city: { type: 'string' },
                    organizationId: { type: 'string' },
                },
                required: ['city']
            },
            response: {
                200: {
                    description: 'Pets found successfully',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            age: { type: 'number' },
                            size: { type: 'string' },
                            city: { type: 'string' },
                            adopted_at: { type: 'string', format: 'date-time', nullable: true },
                            created_at: { type: 'string', format: 'date-time' },
                            updated_at: { type: 'string', format: 'date-time' },
                            organizationId: { type: 'string' },
                            images: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        url: { type: 'string' },
                                        pet_id: { type: 'string' },
                                        created_at: { type: 'string', format: 'date-time' },
                                        updated_at: { type: 'string', format: 'date-time' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }
    }, petController.findByFilter);

    app.patch('/pets/:id/adopt', {
        schema: {
            summary: 'Adopt a pet',
            tags: ['Pets'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                },
            },
            response: {
                200: {
                    description: 'Pet adopted successfully',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        adopted_at: { type: 'string', format: 'date-time' },
                    },
                },
            },
        }
    }, petController.adopt);
}
