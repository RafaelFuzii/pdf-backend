import bcrypt from "bcryptjs";
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../database/prisma";
import { CriarEmpresaPayload } from "./usuarioTypes";

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

    async findAllEmpresas(email: string) {
        return await prisma.usuario.findMany({ where: { email }, include: { empresas: true } });
    }

    async update(id: string, data: Prisma.UsuarioUpdateInput) {
        return await prisma.usuario.update({ where: { id }, data });
    }

    async vincularCnpjUsuario(id: string, empresa: CriarEmpresaPayload) {
        return await prisma.usuario.update({
            where: { id },
            data: { empresas: { 
                connectOrCreate: { 
                    where: { cnpj: empresa.cnpj }, 
                    create: { ...empresa } 
                } 
            } 
        }
        });
    }

    async delete(id: string) {
        return await prisma.usuario.delete({ where: { id } });
    }
}