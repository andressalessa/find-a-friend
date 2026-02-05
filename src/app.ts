import '@/env'
import fastify from "fastify";
import { ZodError } from "zod";
import { organizationRoutes } from "./http/routes/organization.routes";
import { petRoutes } from './http/routes/pet.routes';

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

app.register(organizationRoutes);
app.register(petRoutes);
