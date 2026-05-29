import { Prisma } from "../../generated/prisma/client";
import { errorMessage } from "../errors/errorMessage";
import { DeducoesReceitaBrutaRepository } from "./deducoesReceitaBrutaRepository";

export class DeducoesReceitaBrutaService {
    constructor(
        private deducoesRepository: DeducoesReceitaBrutaRepository
    ) { }

    async criar(
        data: Prisma.DeducoesReceitaBrutaCreateInput
    ) {
        return await this.deducoesRepository.create(data);
    }

    async buscar(id: string) {
        return await this.deducoesRepository.findById(id);
    }

    async listar() {
        return await this.deducoesRepository.findAll();
    }

    async atualizar(
        id: string,
        data: Prisma.DeducoesReceitaBrutaUpdateInput
    ) {
        const deducao =
            await this.deducoesRepository.findById(id);

        if (!deducao) {
            throw new errorMessage(
                "Dedução não encontrada",
                404
            );
        }

        return await this.deducoesRepository.update(
            id,
            data
        );
    }

    async deletar(id: string) {
        const deducao =
            await this.deducoesRepository.findById(id);

        if (!deducao) {
            throw new errorMessage(
                "Dedução não encontrada",
                404
            );
        }

        return await this.deducoesRepository.delete(id);
    }
}