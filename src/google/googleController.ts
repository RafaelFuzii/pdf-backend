import { Request, Response } from "express";
import { GoogleService } from "./googleService";

export class GoogleController {
    constructor(private googleService: GoogleService) {}

    async processarPDF(req: Request, res: Response) {
        console.log(req.file)
        await this.googleService.processarPDF(req.file as Express.Multer.File);
        res.status(200).json({ message: "PDF processado com sucesso" });
    }

}