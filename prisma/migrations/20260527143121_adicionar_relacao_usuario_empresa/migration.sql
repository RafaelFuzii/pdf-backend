/*
  Warnings:

  - You are about to drop the column `plano` on the `empresas` table. All the data in the column will be lost.
  - Added the required column `usuarioId` to the `empresas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plano` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "empresas" DROP COLUMN "plano",
ADD COLUMN     "usuarioId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "plano" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
