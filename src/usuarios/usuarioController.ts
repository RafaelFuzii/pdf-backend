import { Request, Response } from "express";
import { UsuarioService } from "./usuarioService";

export class UsuarioController {
    constructor(private usuarioService: UsuarioService) {}

    async criarUsuario(req: Request, res: Response) {
        const { nome, email, password, telefone, tipoPessoa, cargo, funcao, role } = req.body
        const novoUsuario = await this.usuarioService.novoUsuario({ nome, email, password, telefone, tipoPessoa, cargo, funcao, role })
        res.status(201).json(novoUsuario)
    }

    async acharUsuario(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        console.log(id)
        const usuario = await this.usuarioService.acharUsuario(id)
        res.status(200).json(usuario)
    }

    async listarUsuarios(req: Request, res: Response) {
        const usuarios = await this.usuarioService.listarUsuarios()
        res.status(200).json(usuarios)
    }

    async atualizarUsuario(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        const { nome, email, password, telefone, tipoPessoa, cargo, funcao, role } = req.body
        console.log(id)
        const usuarioAtualizado = await this.usuarioService.atualizarUsuario(id, { nome, email, password, telefone, tipoPessoa, cargo, funcao, role })
        res.status(200).json(usuarioAtualizado)
    }

    async deletarUsuario(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        await this.usuarioService.deletarUsuario(id)
        res.status(204).send()
    }
}