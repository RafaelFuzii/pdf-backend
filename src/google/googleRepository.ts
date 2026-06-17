import { Prisma } from "../../generated/prisma/client";
import { JsonArray } from "../../generated/prisma/internal/prismaNamespace";
import { prisma } from "../database/prisma";


export class GoogleRepository {
    async salvarDRE(empresaId: string, dadosDRE: JsonArray) {
        return await prisma.dRE.create({
            data: {
                empresaId,
                dados: dadosDRE
            }
        });
    }

    async buscarDREPorEmpresa(empresaId: string) {
        return await prisma.dRE.findMany({
            where: {
                empresaId
            }
        });
    }
}