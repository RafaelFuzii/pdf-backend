-- CreateTable
CREATE TABLE "DREs" (
    "id" TEXT NOT NULL,
    "dados" JSONB,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "DREs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DREs" ADD CONSTRAINT "DREs_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
