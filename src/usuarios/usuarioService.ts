import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../database/prisma";
import { errorMessage } from "../errors/errorMessage";
import { UsuarioRepository } from "./usuarioRepository";
import { CriarEmpresaPayload } from "./usuarioTypes";

export class UsuarioService {
    constructor(private usuarioRepository: UsuarioRepository) {}

    async novoUsuario(prismaUsuario: Prisma.UsuarioCreateInput) {
        return await this.usuarioRepository.create(prismaUsuario)
    }

    async acharUsuario(id: string) {
        return await this.usuarioRepository.findById(id)
    }

    async listarUsuarios() {
        return await this.usuarioRepository.findAll()
    }

    async atualizarUsuario(id: string, data: Prisma.UsuarioUpdateInput){
        console.log(id)
        const usuario = await this.usuarioRepository.findById(id)
        if (!usuario) {
            throw new errorMessage("Usuário não encontrado", 404)
        }

        return await this.usuarioRepository.update(id, data)
    }

    async deletarUsuario(id: string) {
        const usuario = await this.usuarioRepository.findById(id)
        if (!usuario) {
            throw new errorMessage("Usuário não encontrado", 404)
        }

        const usuarioEmpresas = await this.usuarioRepository.findAllEmpresas(usuario.email)
        
        if (usuarioEmpresas[0].empresas.length > 0) {
            const deleteEmpresas = prisma.empresa.deleteMany({
                where: {
                    usuarioId: id
                }
            })

            const deleteUsuario = prisma.usuario.delete({
                where: {
                    id: id
                }
            })

            return await prisma.$transaction([deleteEmpresas, deleteUsuario])   
        }

        return await this.usuarioRepository.delete(id)
    }

    async adcionarCnpj(id: string, data: CriarEmpresaPayload) {
        const usuario = await this.usuarioRepository.findById(id)
        if (!usuario) {
            throw new errorMessage("Usuário não encontrado", 404)
        }

        await this.usuarioRepository.vincularCnpjUsuario(id, data)
    }

    async listarCNPJsUsuario(id: string) {
        const usuario = await this.usuarioRepository.findById(id)
        if (!usuario) {
            throw new errorMessage("Usuário não encontrado", 404)
        }
        return await this.usuarioRepository.findAllEmpresas(usuario.email)

    }
}