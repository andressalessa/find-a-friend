import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { randomUUID } from "node:crypto";

describe("OrganizationController (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to create an organization", async () => {
        const email = `org-${randomUUID()}@example.com`;
        const response = await request(app.server)
            .post("/organizations")
            .send({
                name: "ONG Pets",
                email,
                password: "123456",
                whatsapp: "11999999999",
                address: "Rua das Flores, 100 - Centro",
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
            name: "ONG Pets",
            email,
            whatsapp: "11999999999",
            address: "Rua das Flores, 100 - Centro",
        });
        expect(response.body.id).toBeDefined();
        expect(response.body.created_at).toBeDefined();
        expect(response.body).not.toHaveProperty("password");
        expect(response.body).not.toHaveProperty("password_hash");
    });

    it("should not be able to create an organization with duplicate email", async () => {
        const email = `org-${randomUUID()}@example.com`;
        await request(app.server)
            .post("/organizations")
            .send({
                name: "First ORG",
                email,
                password: "123456",
                whatsapp: "11999999999",
                address: "Address long enough here",
            });

        const response = await request(app.server)
            .post("/organizations")
            .send({
                name: "Second ORG",
                email,
                password: "654321",
                whatsapp: "11888888888",
                address: "Another address long enough",
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: "Organization with same email already exists",
        });
    });

    it("should be able to authenticate", async () => {
        const email = `org-${randomUUID()}@example.com`;
        const password = "123456";
        await request(app.server)
            .post("/organizations")
            .send({
                name: "ONG Auth",
                email,
                password,
                whatsapp: "11999999999",
                address: "Rua Teste, 50",
            });

        const response = await request(app.server)
            .post("/organizations/authenticate")
            .send({ email, password });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(typeof response.body.token).toBe("string");
    });

    it("should not be able to authenticate with wrong password", async () => {
        const email = `org-${randomUUID()}@example.com`;
        await request(app.server)
            .post("/organizations")
            .send({
                name: "ONG",
                email,
                password: "123456",
                whatsapp: "11999999999",
                address: "Address long enough",
            });

        const response = await request(app.server)
            .post("/organizations/authenticate")
            .send({ email, password: "wrong-password" });

        expect(response.statusCode).toBe(500);
    });

    it("should not be able to authenticate with non-existent email", async () => {
        const response = await request(app.server)
            .post("/organizations/authenticate")
            .send({
                email: "nonexistent@example.com",
                password: "123456",
            });

        expect(response.statusCode).toBe(500);
    });
});
