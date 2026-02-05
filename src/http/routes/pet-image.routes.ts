import { makePetImageController } from "@/factories/make-pet-image.controller";
import { FastifyInstance } from "fastify";

export async function petImageRoutes(app: FastifyInstance) {
    const petImageController = makePetImageController();

    app.post('/:petId/images', {
        schema: {
            tags: ['Pets'],
            summary: 'Upload de imagens do pet',
            params: {
                type: 'object',
                required: ['petId'],
                properties: {
                    petId: { type: 'string', format: 'uuid' }
                }
            },
            consumes: ['multipart/form-data'],
            body: {
                type: 'object',
                properties: {
                    file: { type: 'string', format: 'binary', description: 'Imagem do pet (jpg, png)' }
                }
            }
        },
        validatorCompiler: () => () => true
    }, petImageController.create);
}
