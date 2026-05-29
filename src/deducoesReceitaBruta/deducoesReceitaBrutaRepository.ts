import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../database/prisma";

export class DeducoesReceitaBrutaRepository {
    async create(data: Prisma.DeducoesReceitaBrutaCreateInput) {
        return await prisma.deducoesReceitaBruta.create({ data });
    }

    async findById(id: string) {
        return await prisma.deducoesReceitaBruta.findUnique({
            where: { id }
        });
    }

    async findAll() {
        return await prisma.deducoesReceitaBruta.findMany();
    }

    async update(
        id: string,
        data: Prisma.DeducoesReceitaBrutaUpdateInput
    ) {
        return await prisma.deducoesReceitaBruta.update({
            where: { id },
            data
        });
    }

    async delete(id: string) {
        return await prisma.deducoesReceitaBruta.delete({
            where: { id }
        });
    }
}