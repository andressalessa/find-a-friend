import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateOrganization(app: FastifyInstance) {
    const email = `org-${randomUUID()}@example.com`;
    const organization = await prisma.organization.create({
        data: {
            name: "Organization",
            email,
            password_hash: await hash("123456", 6),
            whatsapp: "1234567890",
            address: "1234567890",
        },
    });

    const { id } = organization;

    const auth = await request(app.server).post('/organizations/authenticate').send({
        email,
        password: "123456",
    });

    const { token } = auth.body;

    return { token, organizationId: id };
}
