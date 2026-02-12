import { app } from "@/app";
import { createAndAuthenticateOrganization } from "@/utils/create-and-authenticate-organization";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("PetImageController (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to upload an image to a pet", async () => {
        const { token, organizationId } = await createAndAuthenticateOrganization(app);
        const createPetRes = await request(app.server)
            .post("/pets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Pet with photo",
                age: 2,
                size: "SMALL",
                city: "City",
                organizationId,
            });
        const petId = createPetRes.body.id;

        const imageBuffer = Buffer.from("fake-image-content");

        const response = await request(app.server)
            .post(`/${petId}/images`)
            .attach("file", imageBuffer, "photo.png");

        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
            message: "Images uploaded successfully",
            count: 1,
        });
        expect(response.body.images).toHaveLength(1);
        expect(response.body.images[0]).toMatchObject({
            pet_id: petId,
        });
        expect(response.body.images[0].id).toBeDefined();
        expect(response.body.images[0].url).toBeDefined();
    });

    it("should return 400 when no file is sent", async () => {
        const { token, organizationId } = await createAndAuthenticateOrganization(app);
        const createPetRes = await request(app.server)
            .post("/pets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Pet",
                age: 1,
                size: "SMALL",
                city: "City",
                organizationId,
            });
        const petId = createPetRes.body.id;

        const response = await request(app.server)
            .post(`/${petId}/images`)
            .field("other", "value");

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: "No file sent. Send a file in the 'file' field.",
        });
    });
});
