import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { authRoutes, funcionarioRoutes } from './routes';
import { errorMessage } from './errors/errorMessage';

const app = express();

// Middlewares de Segurança e Parse
app.use(helmet());
app.use(cors());
app.use(express.json());

// Registro de Rotas
app.use('/funcionarios', funcionarioRoutes);
app.use('/auth', authRoutes);

// MIDDLEWARE GLOBAL DE ERROS (Sempre por último)
app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  // Erros de negócio que nós geramos
  if (err instanceof errorMessage) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Erros não mapeados (bugs, banco fora do ar, etc)
  console.error(err); 
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Monolito Modular rodando na porta ${PORT}`);
});