import { Prisma } from "../../generated/prisma/client";
import { errorMessage } from "../errors/errorMessage";
import { UsuarioRepository } from "./usuarioRepository";

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

        return await this.usuarioRepository.delete(id)
    }
}