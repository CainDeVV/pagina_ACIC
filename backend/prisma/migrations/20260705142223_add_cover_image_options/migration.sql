-- AlterTable
ALTER TABLE "Evento" ADD COLUMN     "coverImageCaption" TEXT,
ADD COLUMN     "showCoverImage" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Noticia" ADD COLUMN     "coverImageCaption" TEXT,
ADD COLUMN     "showCoverImage" BOOLEAN NOT NULL DEFAULT true;
