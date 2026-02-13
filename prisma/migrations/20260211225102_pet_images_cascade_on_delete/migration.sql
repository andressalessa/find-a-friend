-- DropForeignKey
ALTER TABLE "pet_images" DROP CONSTRAINT "pet_images_pet_id_fkey";

-- AddForeignKey
ALTER TABLE "pet_images" ADD CONSTRAINT "pet_images_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
