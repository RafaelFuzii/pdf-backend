import { Prisma } from "../../generated/prisma/client";
import { errorMessage } from "../errors/errorMessage";
import { FuncionarioRepository } from "./funcionarioReposiroty";

export class FuncionarioService {
    constructor(private funcionarioRepository: FuncionarioRepository) {}

    async novoFuncionario(prismaFuncionario: Prisma.FuncionarioUncheckedCreateInput) {
        return await this.funcionarioRepository.create(prismaFuncionario)
    }

    async acharFuncionario(id: string) {
        return await this.funcionarioRepository.findById(id)
    }

    async listarFuncionarios() {
        return await this.funcionarioRepository.findAll()
    }

    async atualizarFuncionario(id: string, data: Prisma.FuncionarioUpdateInput){
        console.log(id)
        const funcionario = await this.funcionarioRepository.findById(id)
        if (!funcionario) {
            throw new errorMessage("Funcionário não encontrado", 404)
        }

        return await this.funcionarioRepository.update(id, data)
    }

    async deletarFuncionario(id: string) {
        const funcionario = await this.funcionarioRepository.findById(id)
        if (!funcionario) {
            throw new errorMessage("Funcionário não encontrado", 404)
        }

        return await this.funcionarioRepository.delete(id)
    }

    async adicionarDiaTrabalhado(funcionarioId: string, dateString: string) {
        const funcionario = await this.funcionarioRepository.findById(funcionarioId);
        if (!funcionario) {
            throw new errorMessage("Funcionário não encontrado", 404);
        }

        // Pega a string "2026/04/16" e transforma em um Objeto Date
        const dataConvertida = new Date(dateString);

        // Validação de segurança: verifica se a data enviada é realmente válida
        if (isNaN(dataConvertida.getTime())) {
            throw new errorMessage("Formato de data inválido. Use YYYY/MM/DD.", 400);
        }

        // Opcional: Se você quiser garantir que a hora seja zerada (00:00:00) 
        // para não ter problemas de fuso horário
        dataConvertida.setUTCHours(0, 0, 0, 0);

        return await this.funcionarioRepository.addDiaTrabalhado(funcionarioId, dataConvertida);
    }
}