import { describe, it, expect, vi, beforeEach } from "vitest";
import { PetService } from "./pet.service";
import type { IPetRepository } from "@/repositories/interfaces/pet.repository.interface";
import type { CreatePetDTO, FilterPetsDTO, PetResponseDTO, UpdatePetDTO } from "@/dtos/pet.dto";

describe("PetService", () => {
    let petRepository: IPetRepository;
    let petService: PetService;

    beforeEach(() => {
        petRepository = {
            create: vi.fn(),
            findAll: vi.fn(),
            findById: vi.fn(),
            findByCity: vi.fn(),
            findByFilter: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        };
        petService = new PetService(petRepository);
    });

    it("create delegates to repository and returns created pet", async () => {
        const data: CreatePetDTO = {
            name: "Rex",
            age: 2,
            size: "MEDIUM",
            city: "São Paulo",
            organizationId: "org-1",
        };
        const created: PetResponseDTO = {
            id: "pet-1",
            ...data,
            adopted_at: null,
            created_at: new Date(),
            updated_at: new Date(),
        };
        vi.mocked(petRepository.create).mockResolvedValue(created);

        const result = await petService.create(data);

        expect(petRepository.create).toHaveBeenCalledWith(data);
        expect(result).toEqual(created);
    });

    it("findByFilter passes filter to repository (city required by business rule)", async () => {
        const filter: FilterPetsDTO = { city: "Rio de Janeiro" };
        const pets: PetResponseDTO[] = [];
        vi.mocked(petRepository.findByFilter).mockResolvedValue(pets);

        const result = await petService.findByFilter(filter);

        expect(petRepository.findByFilter).toHaveBeenCalledWith(filter);
        expect(result).toEqual(pets);
    });

    it("findById returns null when pet does not exist", async () => {
        vi.mocked(petRepository.findById).mockResolvedValue(null);

        const result = await petService.findById("id-inexistente");

        expect(result).toBeNull();
    });

    it("update delegates to repository and returns updated pet", async () => {
        const updateData: UpdatePetDTO = { name: "Rex Atualizado" };
        const updated: PetResponseDTO = {
            id: "pet-1",
            name: "Rex Atualizado",
            age: 2,
            size: "MEDIUM",
            city: "São Paulo",
            organizationId: "org-1",
            adopted_at: null,
            created_at: new Date(),
            updated_at: new Date(),
        };
        vi.mocked(petRepository.update).mockResolvedValue(updated);

        const result = await petService.update("pet-1", updateData);

        expect(petRepository.update).toHaveBeenCalledWith("pet-1", updateData);
        expect(result).toEqual(updated);
    });

    it("delete delegates to repository", async () => {
        vi.mocked(petRepository.delete).mockResolvedValue(undefined);

        await petService.delete("pet-1");

        expect(petRepository.delete).toHaveBeenCalledWith("pet-1");
    });
});
