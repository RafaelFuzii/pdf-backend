import { Request, Response } from "express";
import { DeducoesReceitaBrutaService } from "./deducoesReceitaBrutaService";

export class DeducoesReceitaBrutaController {
    constructor(
        private deducoesService: DeducoesReceitaBrutaService
    ) { }

    async criar(req: Request, res: Response) {
        const {
            tributosSobreVendasServicos,
            tributosSobreFaturamento
        } = req.body;

        const deducao =
            await this.deducoesService.criar({
                tributosSobreVendasServicos,
                tributosSobreFaturamento
            });

        res.status(201).json(deducao);
    }

    async buscar(
        req: Request<{ id: string }>,
        res: Response
    ) {
        const { id } = req.params;

        const deducao =
            await this.deducoesService.buscar(id);

        res.status(200).json(deducao);
    }

    async listar(req: Request, res: Response) {
        const deducoes =
            await this.deducoesService.listar();

        res.status(200).json(deducoes);
    }

    async atualizar(
        req: Request<{ id: string }>,
        res: Response
    ) {
        const { id } = req.params;

        const {
            tributosSobreVendasServicos,
            tributosSobreFaturamento
        } = req.body;

        const deducao =
            await this.deducoesService.atualizar(id, {
                tributosSobreVendasServicos,
                tributosSobreFaturamento
            });

        res.status(200).json(deducao);
    }

    async deletar(
        req: Request<{ id: string }>,
        res: Response
    ) {
        const { id } = req.params;

        await this.deducoesService.deletar(id);

        res.status(204).send();
    }
}