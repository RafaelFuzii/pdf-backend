import bcrypt from "bcryptjs";
import { prisma } from "../database/prisma";
import { errorMessage } from "../errors/errorMessage";
import jwt from 'jsonwebtoken';

export class AuthService {
  async login(email: string, password: string) {
    // 1. Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || user.role !== 'ADMIN') {
      throw new errorMessage('Acesso não autorizado.', 401);
    }

    // 2. Verificar se a senha confere com o hash salvo no banco
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new errorMessage('E-mail ou senha incorretos.', 401);
    }

    // 3. Gerar o JWT com o ID e a Role do usuário
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' } // O token expira em 1 dia
    );

    // Retornamos os dados (sem a senha) e o token
    return {
      user: {
        name: user.name,
        email: user.email,
      },
      token
    };
  }
}