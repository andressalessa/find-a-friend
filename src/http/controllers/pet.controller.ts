import { CreatePetDTO, createPetSchema, filterPetsSchema } from "@/dtos/pet.dto";
import { PetService } from "@/services/pet.service";
import { FastifyReply, FastifyRequest } from "fastify";

export class PetController {
    constructor(private petService: PetService) { }

    create = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = createPetSchema.parse(request.body)
        const pet = await this.petService.create(data);

        return reply.status(201).send(pet);
    }

    findById = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };
        const pet = await this.petService.findById(id);

        if (!pet) {
            return reply.status(404).send({ message: "Pet not found" });
        }

        return reply.status(200).send(pet);
    }

    findByFilter = async (request: FastifyRequest, reply: FastifyReply) => {
        const filter = filterPetsSchema.parse(request.query);
        const pets = await this.petService.findByFilter(filter);

        return reply.status(200).send(pets)
    }
}
