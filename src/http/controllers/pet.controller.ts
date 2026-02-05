import { CreatePetDTO, createPetSchema } from "@/dtos/pet.dto";
import { PetService } from "@/services/pet.service";
import { FastifyReply, FastifyRequest } from "fastify";

export class PetController {
    constructor(private petService: PetService) { }

    create = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = createPetSchema.parse(request.body)
        const petWithSameOwnerPhone = await this.petService.findByOwnerPhone(data.owners_phone);

        if (petWithSameOwnerPhone) {
            return reply.status(400).send({ message: "Pet with same owner phone already exists" });
        }

        const pet = await this.petService.create(data);
        return reply.status(201).send(pet);
    }
}
