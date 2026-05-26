import bcrypt from "bcryptjs";
import { prisma } from "../database/prisma";
import { errorMessage } from "../errors/errorMessage";
import jwt from 'jsonwebtoken';

export class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.usuario.findUnique({ where: { email } });
    
    if (!user) {
      throw new errorMessage('Acesso não autorizado.', 401);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new errorMessage('E-mail ou senha incorretos.', 401);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    return {
      user: {
        email: user.email,
        role: user.role
      },
      token
    };
  }
}