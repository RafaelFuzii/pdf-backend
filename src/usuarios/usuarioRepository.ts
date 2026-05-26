import bcrypt from "bcryptjs";
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../database/prisma";

export class UsuarioRepository {
    async create(data: Prisma.UsuarioCreateInput) {
        data.password = await bcrypt.hash(data.password, 10);
        return await prisma.usuario.create({ data });
    }

    async findById(id: string) {
        return await prisma.usuario.findUnique({ where: { id } });
    }

    async findAll() {
        return await prisma.usuario.findMany();
    }

    async update(id: string, data: Prisma.UsuarioUpdateInput) {
        return await prisma.usuario.update({ where: { id }, data });
    }

    async delete(id: string) {
        return await prisma.usuario.delete({ where: { id } });
    }
}