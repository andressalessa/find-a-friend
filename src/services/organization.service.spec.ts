import { describe, it, expect, vi, beforeEach } from "vitest";
import { hashSync } from "bcryptjs";
import { OrganizationService } from "./organization.service";
import type { IOrganizationRepository } from "@/repositories/interfaces/organization.repository.interface";
import type { CreateOrganizationDTO, OrganizationEntity } from "@/dtos/organization.dto";

const validPasswordHash = hashSync("123456", 6);

describe("OrganizationService", () => {
    let organizationRepository: IOrganizationRepository;
    let organizationService: OrganizationService;

    const mockOrganizationEntity: OrganizationEntity = {
        id: "org-1",
        name: "ONG Pets",
        email: "ong@mail.com",
        password_hash: validPasswordHash,
        whatsapp: "11999999999",
        address: "Rua das Flores, 100",
        created_at: new Date(),
        updated_at: new Date(),
    };

    beforeEach(() => {
        organizationRepository = {
            create: vi.fn(),
            findByEmail: vi.fn(),
            update: vi.fn(),
            findById: vi.fn(),
        };
        organizationService = new OrganizationService(organizationRepository);
    });

    it("create rejects when organization with same email already exists", async () => {
        const data: CreateOrganizationDTO = {
            name: "ONG",
            email: "ong@mail.com",
            password: "123456",
            whatsapp: "11999999999",
            address: "Street Long Enough",
        };
        vi.mocked(organizationRepository.findByEmail).mockResolvedValue(mockOrganizationEntity);

        await expect(organizationService.create(data)).rejects.toThrow("Organization already exists");
        expect(organizationRepository.create).not.toHaveBeenCalled();
    });

    it("create hashes password and calls repository when email is unique", async () => {
        const data: CreateOrganizationDTO = {
            name: "ONG Nova",
            email: "nova@mail.com",
            password: "123456",
            whatsapp: "11999999999",
            address: "Street Long Enough",
        };
        vi.mocked(organizationRepository.findByEmail).mockResolvedValue(null);
        vi.mocked(organizationRepository.create).mockResolvedValue({
            ...mockOrganizationEntity,
            email: data.email,
            name: data.name,
        });

        const result = await organizationService.create(data);

        expect(organizationRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                name: data.name,
                email: data.email,
                whatsapp: data.whatsapp,
                address: data.address,
            })
        );
        expect(result).not.toHaveProperty("password_hash");
    });

    it("authenticate throws when organization does not exist", async () => {
        vi.mocked(organizationRepository.findByEmail).mockResolvedValue(null);

        await expect(
            organizationService.authenticate("inexistente@mail.com", "123456")
        ).rejects.toThrow("Organization not found");
    });

    it("authenticate throws when password is invalid", async () => {
        vi.mocked(organizationRepository.findByEmail).mockResolvedValue(mockOrganizationEntity);

        await expect(
            organizationService.authenticate("ong@mail.com", "senha-errada")
        ).rejects.toThrow("Invalid password");
    });

    it("authenticate returns organization when email and password are valid", async () => {
        vi.mocked(organizationRepository.findByEmail).mockResolvedValue(mockOrganizationEntity);

        const result = await organizationService.authenticate("ong@mail.com", "123456");

        expect(result).toBeDefined();
        expect(result.id).toBe(mockOrganizationEntity.id);
        expect(result.email).toBe(mockOrganizationEntity.email);
    });
});
