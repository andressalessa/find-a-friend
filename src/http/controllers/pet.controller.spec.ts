import { app } from "@/app";
import { createAndAuthenticateOrganization } from "@/utils/create-and-authenticate-organization";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

describe("PetController (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    });

    afterAll(async () => {
        await app.close()
    });

    it("should be able to create a pet", async () => {
        const { token, organizationId } = await createAndAuthenticateOrganization(app);

        const response = await request(app.server)
            .post('/pets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Pituco',
                age: 4,
                size: 'SMALL',
                city: 'Rio de Janeiro',
                organizationId: organizationId,
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(expect.objectContaining({
            name: 'Pituco',
            age: 4,
            size: 'SMALL',
            city: 'Rio de Janeiro',
            organizationId: organizationId,
        }));
    });

    it("should not be able to create a pet without authentication", async () => {
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

        const response = await request(app.server)
            .post('/pets')
            .send({
                name: 'Pituco',
                age: 4,
                size: 'SMALL',
                city: 'Rio de Janeiro',
                organizationId: id,
            });

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual(expect.objectContaining({
            message: 'Unauthorized',
        }));
    });

    it("should not be able to create a pet with an invalid organizationId", async () => {
        const { token } = await createAndAuthenticateOrganization(app);

        const response = await request(app.server)
            .post('/pets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Pituco',
                age: 4,
                size: 'SMALL',
                city: 'Rio de Janeiro',
                organizationId: 'invalid-organization-id',
            });

        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({
            message: "You can only create pets for your own organization",
        });
    });

    it("should not be able to create a pet for another organization", async () => {
        const { token: tokenOrgA, organizationId: orgAId } = await createAndAuthenticateOrganization(app);
        const { organizationId: orgBId } = await createAndAuthenticateOrganization(app);

        const response = await request(app.server)
            .post('/pets')
            .set('Authorization', `Bearer ${tokenOrgA}`)
            .send({
                name: 'Pituco',
                age: 4,
                size: 'SMALL',
                city: 'Rio de Janeiro',
                organizationId: orgBId,
            });

        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({
            message: "You can only create pets for your own organization",
        });
    });

    it("should be able to list all pets", async () => {
        const { token, organizationId } = await createAndAuthenticateOrganization(app);

        await request(app.server)
            .post('/pets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Pituco',
                age: 4,
                size: 'SMALL',
                city: 'Rio de Janeiro',
                organizationId,
            });

        const response = await request(app.server).get('/pets');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'Pituco',
                    age: 4,
                    size: 'SMALL',
                    city: 'Rio de Janeiro',
                    organizationId,
                }),
            ])
        );
    });

    it("should be able to get a pet by id", async () => {
        const { token, organizationId } = await createAndAuthenticateOrganization(app);
        const createRes = await request(app.server)
            .post('/pets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Rex',
                age: 2,
                size: 'MEDIUM',
                city: 'São Paulo',
                organizationId,
            });
        const petId = createRes.body.id;

        const response = await request(app.server).get(`/pets/${petId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            id: petId,
            name: 'Rex',
            age: 2,
            size: 'MEDIUM',
            city: 'São Paulo',
            organizationId,
        });
    });

    it("should return 404 when getting a pet by non-existent id", async () => {
        const response = await request(app.server).get(`/pets/${randomUUID()}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: "Pet not found" });
    });

    it("should be able to filter pets by city", async () => {
        const { token, organizationId } = await createAndAuthenticateOrganization(app);
        await request(app.server)
            .post('/pets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Thor',
                age: 3,
                size: 'LARGE',
                city: 'Curitiba',
                organizationId,
            });

        const response = await request(app.server).get('/pets/filter').query({ city: 'Curitiba' });

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'Thor',
                    city: 'Curitiba',
                }),
            ])
        );
    });

    it("should be able to list available pets by city", async () => {
        const { token, organizationId } = await createAndAuthenticateOrganization(app);
        await request(app.server)
            .post('/pets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Luna',
                age: 1,
                size: 'SMALL',
                city: 'Porto Alegre',
                organizationId,
            });

        const response = await request(app.server).get('/pets/available').query({ city: 'Porto Alegre' });

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'Luna',
                    city: 'Porto Alegre',
                    adopted_at: null,
                }),
            ])
        );
    });

    it("should be able to update a pet", async () => {
        const { token, organizationId } = await createAndAuthenticateOrganization(app);
        const createRes = await request(app.server)
            .post('/pets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Bob',
                age: 5,
                size: 'MEDIUM',
                city: 'Salvador',
                organizationId,
            });
        const petId = createRes.body.id;

        const response = await request(app.server)
            .patch(`/pets/${petId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Bob Updated', age: 6 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            id: petId,
            name: 'Bob Updated',
            age: 6,
            size: 'MEDIUM',
            city: 'Salvador',
        });
    });

    it("should not be able to update a pet from another organization", async () => {
        const { token: tokenA, organizationId: orgAId } = await createAndAuthenticateOrganization(app);
        const { token: tokenB, organizationId: orgBId } = await createAndAuthenticateOrganization(app);
        const createRes = await request(app.server)
            .post('/pets')
            .set('Authorization', `Bearer ${tokenB}`)
            .send({
                name: 'Other Pet',
                age: 1,
                size: 'SMALL',
                city: 'City',
                organizationId: orgBId,
            });
        const petId = createRes.body.id;

        const response = await request(app.server)
            .patch(`/pets/${petId}`)
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ name: 'Hacked' });

        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({
            message: "You can only update pets from your own organization",
        });
    });

    it("should be able to adopt a pet", async () => {
        const { token, organizationId } = await createAndAuthenticateOrganization(app);
        const createRes = await request(app.server)
            .post('/pets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'ToAdopt',
                age: 2,
                size: 'SMALL',
                city: 'City',
                organizationId,
            });
        const petId = createRes.body.id;

        const response = await request(app.server)
            .patch(`/pets/${petId}/adopt`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            id: petId,
            name: 'ToAdopt',
        });
        expect(response.body.adopted_at).toBeDefined();
    });

    it("should not be able to delete a pet from another organization", async () => {
        const { token: tokenA } = await createAndAuthenticateOrganization(app);
        const { token: tokenB, organizationId: orgBId } = await createAndAuthenticateOrganization(app);
        const createRes = await request(app.server)
            .post('/pets')
            .set('Authorization', `Bearer ${tokenB}`)
            .send({
                name: 'ToDelete',
                age: 1,
                size: 'SMALL',
                city: 'City',
                organizationId: orgBId,
            });
        const petId = createRes.body.id;

        const response = await request(app.server)
            .delete(`/pets/${petId}`)
            .set('Authorization', `Bearer ${tokenA}`);

        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({
            message: "You can only delete pets from your own organization",
        });
    });

    it("should be able to delete a pet", async () => {
        const { token, organizationId } = await createAndAuthenticateOrganization(app);
        const createRes = await request(app.server)
            .post('/pets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'ToDelete',
                age: 1,
                size: 'SMALL',
                city: 'City',
                organizationId,
            });
        const petId = createRes.body.id;

        const response = await request(app.server)
            .delete(`/pets/${petId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(204);

        const getRes = await request(app.server).get(`/pets/${petId}`);
        expect(getRes.statusCode).toBe(404);
    });
});
