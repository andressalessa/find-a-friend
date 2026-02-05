import { PetController } from "@/http/controllers/pet.controller";
import { PrismaPetRepository } from "@/repositories/prisma/pet.repository";
import { PetService } from "@/services/pet.service";

export function makePetController() {
    const petRepository = new PrismaPetRepository();
    const petService = new PetService(petRepository);
    const petController = new PetController(petService);

    return petController;
}
