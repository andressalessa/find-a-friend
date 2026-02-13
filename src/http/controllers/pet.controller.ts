import { createPetSchema, filterPetsSchema, updatePetSchema } from "@/dtos/pet.dto";
import { PetService } from "@/services/pet.service";
import { getImageUrl } from "@/utils/image-url";
import { FastifyReply, FastifyRequest } from "fastify";

function getBaseUrl(request: FastifyRequest): string {
    return `${request.protocol}://${request.headers.host}`;
}

function withImageUrls<T extends { images?: { url: string }[] }>(baseUrl: string, data: T): T & { images: { url: string }[] } {
    const list = data.images ?? [];
    return {
        ...data,
        images: list.map((img) => ({ ...img, url: getImageUrl(baseUrl, img.url) })),
    };
}

export class PetController {
    constructor(private petService: PetService) { }

    create = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = createPetSchema.parse(request.body)
        const pet = await this.petService.create(data);

        return reply.status(201).send(pet);
    }

    findAll = async (request: FastifyRequest, reply: FastifyReply) => {
        const pets = await this.petService.findAll();
        const baseUrl = getBaseUrl(request);
        const petsWithImages = pets.map((p) => withImageUrls(baseUrl, p));

        return reply.status(200).send(petsWithImages);
    }

    findById = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };
        const pet = await this.petService.findById(id);

        if (!pet) {
            return reply.status(404).send({ message: "Pet not found" });
        }

        return reply.status(200).send(withImageUrls(getBaseUrl(request), pet));
    }

    findByFilter = async (request: FastifyRequest, reply: FastifyReply) => {
        const filter = filterPetsSchema.parse(request.query);
        const pets = await this.petService.findByFilter(filter);
        const baseUrl = getBaseUrl(request);
        const petsWithImages = pets.map((p) => withImageUrls(baseUrl, p));

        return reply.status(200).send(petsWithImages);
    }

    findAvailable = async (request: FastifyRequest, reply: FastifyReply) => {
        const { city } = filterPetsSchema.parse(request.query);
        const pets = await this.petService.findByFilter({ city, adopted_at: null });
        const baseUrl = getBaseUrl(request);
        const petsWithImages = pets.map((p) => withImageUrls(baseUrl, p));

        return reply.status(200).send(petsWithImages);
    }

    adopt = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };
        const data = { adopted_at: new Date() };
        const pet = await this.petService.update(id, data);
        const baseUrl = getBaseUrl(request);

        return reply.status(200).send(withImageUrls(baseUrl, pet));
    }

    delete = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };


        const pet = await this.petService.findById(id);
        if (!pet) {
            return reply.status(404).send({ message: "Pet not found" });
        }

        await this.petService.delete(id);

        return reply.status(204).send({ message: "Pet deleted successfully" });
    }
}
