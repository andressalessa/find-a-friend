import '@/env'
import fastify from "fastify";
import { ZodError } from "zod";
import { organizationRoutes } from "./http/routes/organization.routes";
import { petRoutes } from './http/routes/pet.routes';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

export const app = fastify();

app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
            field: issue.path.join(".") || "body",
            message: issue.message,
        }));
        return reply.status(400).send({
            message: "Validation error",
            errors,
        });
    }
    throw error;
});

// Swagger documentation

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'FindAFriend API',
            description: 'API for the FindAFriend project',
            version: '1.0.0',
        }
    }
});

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
});

// API routes
app.register(organizationRoutes);
app.register(petRoutes);
