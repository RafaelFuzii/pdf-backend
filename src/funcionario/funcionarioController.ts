import { Request, Response } from "express";
import { FuncionarioService } from "./funcionarioService";

export class FuncionarioController {
    constructor(private funcionarioService: FuncionarioService) {}

    async criarFuncionario(req: Request, res: Response) {
        const { name, email, cpf } = req.body
        const novoFuncionario = await this.funcionarioService.novoFuncionario({ name, email, cpf})
        res.status(201).json(novoFuncionario)
    }

    async acharFuncionario(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        console.log(id)
        const funcionario = await this.funcionarioService.acharFuncionario(id)
        res.status(200).json(funcionario)
    }

    async listarFuncionarios(req: Request, res: Response) {
        const funcionarios = await this.funcionarioService.listarFuncionarios()
        res.status(200).json(funcionarios)
    }

    async atualizarFuncionario(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        const { name, email, cpf } = req.body
        console.log(id)
        const funcionarioAtualizado = await this.funcionarioService.atualizarFuncionario(id, { name, email, cpf })
        res.status(200).json(funcionarioAtualizado)
    }

    async deletarFuncionario(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        await this.funcionarioService.deletarFuncionario(id)
        res.status(204).send()
    }

    async adicionarDiaTrabalhado(req: Request<{ funcionarioId: string }>, res: Response) {
        const { funcionarioId } = req.params;
        const { date } = req.body;
        const diaTrabalhado = await this.funcionarioService.adicionarDiaTrabalhado(funcionarioId, date);
        res.status(201).json(diaTrabalhado);
    }
}