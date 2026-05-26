import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { authRoutes, UsuarioRoutes } from './routes';
import { errorMessage } from './errors/errorMessage';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/usuarios', UsuarioRoutes);
app.use('/auth', authRoutes);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof errorMessage) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

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