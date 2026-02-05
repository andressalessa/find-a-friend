import { PetImageService } from "@/services/pet-image.service";
import { getImageUrl } from "@/utils/image-url";
import { FastifyReply, FastifyRequest } from "fastify";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

export class PetImageController {
    constructor(private petImageService: PetImageService) { }

    create = async (request: FastifyRequest, reply: FastifyReply) => {
        const { petId } = request.params as { petId: string };
        const parts = request.parts();
        const created: { id: string; url: string; pet_id: string; created_at: Date; updated_at: Date }[] = [];

        try {
            for await (const part of parts) {
                if (part.type !== "file" || !part.file) continue;

                let fileName = part.filename ?? "image";
                fileName = `${crypto.randomUUID()}-${fileName}`;
                const uploadPath = path.join(UPLOADS_DIR, fileName);

                fs.mkdirSync(UPLOADS_DIR, { recursive: true });
                await pipeline(part.file, fs.createWriteStream(uploadPath));

                const image = await this.petImageService.create({
                    url: fileName,
                    pet_id: petId,
                });
                created.push(image);
            }
        } catch (err) {
            return reply.status(500).send({
                message: "Failed to save image",
                error: err instanceof Error ? err.message : "Unknown error",
            });
        }

        if (created.length === 0) {
            return reply.status(400).send({ message: "No file sent. Send a file in the 'file' field." });
        }

        const baseUrl = `${request.protocol}://${request.headers.host}`;
        const imagesWithUrl = created.map((img) => ({
            ...img,
            url: getImageUrl(baseUrl, img.url),
        }));

        return reply.status(201).send({
            message: "Images uploaded successfully",
            count: imagesWithUrl.length,
            images: imagesWithUrl,
        });
    }
}
