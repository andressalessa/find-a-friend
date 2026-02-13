import { PetImageController } from "@/http/controllers/pet-image.controller";
import { PrismaPetImageRepository } from "@/repositories/prisma/pet-image.repository";
import { PetImageService } from "@/services/pet-image.service";

export function makePetImageController() {
    const petImageRepository = new PrismaPetImageRepository();
    const petImageService = new PetImageService(petImageRepository);
    const petImageController = new PetImageController(petImageService);

    return petImageController;
}
