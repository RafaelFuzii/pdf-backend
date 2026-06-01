-- CreateTable
CREATE TABLE "deducoes_receita_bruta" (
    "id" TEXT NOT NULL,
    "tributosSobreVendasServicos" DOUBLE PRECISION NOT NULL,
    "tributosSobreFaturamento" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "deducoes_receita_bruta_pkey" PRIMARY KEY ("id")
);
