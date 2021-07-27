/*
  Warnings:

  - The `genre_id` column on the `movies` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "movies" DROP CONSTRAINT "movies_genre_id_fkey";

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "genre_id",
ADD COLUMN     "genre_id" INTEGER[];

-- AddForeignKey
ALTER TABLE "movies" ADD FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
