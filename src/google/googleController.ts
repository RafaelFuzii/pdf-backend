import { Request, Response } from "express";
import { GoogleService } from "./googleService";

export class GoogleController {
    constructor(private googleService: GoogleService) { }

    async processarPDF(req: Request, res: Response) {
        const resultado = await this.googleService.processarPDF(req.file as Express.Multer.File, req.params.empresaId as string);
        res.status(200).json({ message: "PDF processado com sucesso", resultado });
    }

    async buscarDREPorEmpresa(req: Request, res: Response) {
        const resultado = await this.googleService.buscarDREPorEmpresa(req.params.empresaId as string);
        res.status(200).json({ message: "DREs encontrados com sucesso", resultado })
    }

}