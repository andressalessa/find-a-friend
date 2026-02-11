import '@/env'
import fastify from "fastify";
import path from "node:path";
import { ZodError } from "zod";
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { organizationRoutes } from "./http/routes/organization.routes";
import { petImageRoutes } from './http/routes/pet-image.routes';
import { petRoutes } from './http/routes/pet.routes';
import fastifyJwt from '@fastify/jwt';
import { env } from './env';

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

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: 'refreshToken',
      signed: false,
    },
    sign: {
      expiresIn: '10m',
    },
  })

app.register(fastifyMultipart, {
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
});

app.register(fastifyStatic, {
    root: path.join(process.cwd(), "uploads"),
    prefix: "/uploads/",
});

// Swagger documentation

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'FindAFriend API',
            description: 'API for the FindAFriend project',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT obtido na rota POST /organizations/authenticate',
                },
            },
        },
    },
});

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
});

// API routes
app.register(organizationRoutes);
app.register(petRoutes);
app.register(petImageRoutes);
