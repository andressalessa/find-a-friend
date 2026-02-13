import { describe, it, expect } from "vitest";
import { createPetSchema, filterPetsSchema, updatePetSchema } from "./pet.dto";

describe("Pet DTOs", () => {
    describe("createPetSchema", () => {
        it("accepts valid data with organizationId", () => {
            const data = {
                name: "Rex",
                age: 2,
                size: "MEDIUM" as const,
                city: "São Paulo",
                organizationId: "org-123",
            };
            expect(createPetSchema.parse(data)).toEqual(data);
        });

        it("rejects when organizationId is missing", () => {
            const data = {
                name: "Rex",
                age: 2,
                size: "MEDIUM",
                city: "São Paulo",
            };
            expect(() => createPetSchema.parse(data)).toThrow();
        });

        it("rejects invalid size", () => {
            const data = {
                name: "Rex",
                age: 2,
                size: "XL",
                city: "São Paulo",
                organizationId: "org-123",
            };
            expect(() => createPetSchema.parse(data)).toThrow();
        });
    });

    describe("filterPetsSchema", () => {
        it("requires city", () => {
            expect(() => filterPetsSchema.parse({})).toThrow();
            expect(() => filterPetsSchema.parse({ name: "Rex" })).toThrow();
        });

        it("accepts only city as required minimum", () => {
            const result = filterPetsSchema.parse({ city: "Rio de Janeiro" });
            expect(result.city).toBe("Rio de Janeiro");
        });

        it("accepts optional filters along with city", () => {
            const result = filterPetsSchema.parse({
                city: "Belo Horizonte",
                age: 2,
                size: "SMALL",
            });
            expect(result).toEqual({
                city: "Belo Horizonte",
                age: 2,
                size: "SMALL",
            });
        });
    });

    describe("updatePetSchema", () => {
        it("accepts all fields as optional", () => {
            expect(updatePetSchema.parse({})).toEqual({});
            expect(updatePetSchema.parse({ name: "Novo Nome" })).toEqual({ name: "Novo Nome" });
        });
    });
});
