-- CreateTable
CREATE TABLE "dias_trabalhados" (
    "id" TEXT NOT NULL,
    "funcionarioId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dias_trabalhados_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dias_trabalhados" ADD CONSTRAINT "dias_trabalhados_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
