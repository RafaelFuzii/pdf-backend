import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../database/prisma";

export class FuncionarioRepository {
    async create(data: Prisma.FuncionarioUncheckedCreateInput) {
        return await prisma.funcionario.create({ data });
    }

    async findById(id: string) {
        return await prisma.funcionario.findUnique({ where: { id } });
    }

    async findAll() {
        return await prisma.funcionario.findMany();
    }

    async update(id: string, data: Prisma.FuncionarioUpdateInput) {
        return await prisma.funcionario.update({ where: { id }, data });
    }

    async delete(id: string) {
        return await prisma.funcionario.delete({ where: { id } });
    }

    async addDiaTrabalhado(funcionarioId: string, date: Date) {
        return await prisma.diasTrabalhados.create({
            data: {
                funcionarioId,
                date
            }
        });
    }
}