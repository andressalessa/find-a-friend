import { makePetController } from "@/factories/make-pet.controller";
import { FastifyInstance } from "fastify";

export async function petRoutes(app: FastifyInstance) {
    const petController = makePetController();

    app.post('/pets', petController.create);
}
