import { Request, Response } from "express";
import { AuthService } from "./authService";

export class AuthController {
  constructor(private authService: AuthService) {}

  async handleLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    
    const result = await this.authService.login(email, password);
    
    return res.status(200).json(result);
  }
}