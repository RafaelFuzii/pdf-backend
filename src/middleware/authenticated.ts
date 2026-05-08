import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorMessage } from '../errors/errorMessage';

interface TokenPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export function Authenticated(req: Request, res: Response, next: NextFunction) {
  // O token vem pelo cabeçalho Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new errorMessage('Você não tem autorização para acessar essa funcionalidade', 401);
  }

  // Desestrutura dividindo o "Bearer" do "Token"
  const [, token] = authHeader.split(' ');

  try {
    // Tenta decodificar usando a mesma senha do .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const { id, role } = decoded as TokenPayload;

    // Injeta os dados do usuário na requisição para as rotas poderem usar
    req.user = { id, role };

    return next(); // Libera a rota para continuar
  } catch (err) {
    throw new errorMessage('Token JWT inválido ou expirado.', 401);
  }
}