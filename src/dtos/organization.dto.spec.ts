import { describe, it, expect } from "vitest";
import {
    createOrganizationSchema,
    authenticateOrganizationSchema,
} from "./organization.dto";

describe("Organization DTOs", () => {
    describe("createOrganizationSchema", () => {
        it("requires whatsapp and address", () => {
            expect(() =>
                createOrganizationSchema.parse({
                    name: "ORG",
                    email: "org@mail.com",
                    password: "123456",
                })
            ).toThrow();
        });

        it("accepts valid data with whatsapp and address", () => {
            const data = {
                name: "ONG Pets",
                email: "ong@mail.com",
                password: "senha123",
                whatsapp: "11999999999",
                address: "Rua das Flores, 100 - Centro",
            };
            expect(createOrganizationSchema.parse(data)).toEqual(data);
        });

        it("rejects whatsapp with fewer than 10 digits", () => {
            const data = {
                name: "ORG",
                email: "org@mail.com",
                password: "123456",
                whatsapp: "11999",
                address: "Street Long Enough",
            };
            expect(() => createOrganizationSchema.parse(data)).toThrow();
        });

        it("rejects address with fewer than 10 characters", () => {
            const data = {
                name: "ORG",
                email: "org@mail.com",
                password: "123456",
                whatsapp: "11999999999",
                address: "Short",
            };
            expect(() => createOrganizationSchema.parse(data)).toThrow();
        });
    });

    describe("authenticateOrganizationSchema", () => {
        it("rejects when email or password is missing", () => {
            expect(() => authenticateOrganizationSchema.parse({})).toThrow();
            expect(() =>
                authenticateOrganizationSchema.parse({ email: "org@mail.com" })
            ).toThrow();
            expect(() =>
                authenticateOrganizationSchema.parse({ password: "123456" })
            ).toThrow();
        });

        it("accepts valid email and password", () => {
            const result = authenticateOrganizationSchema.parse({
                email: "org@mail.com",
                password: "123456",
            });
            expect(result).toEqual({ email: "org@mail.com", password: "123456" });
        });
    });
});
