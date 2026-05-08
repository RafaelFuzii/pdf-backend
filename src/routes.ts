import { Router } from 'express';
import { FuncionarioRepository } from './funcionario/funcionarioReposiroty'; // Atenção ao nome do arquivo
import { FuncionarioService } from './funcionario/funcionarioService';
import { FuncionarioController } from './funcionario/funcionarioController';
import { AuthService } from './authentication/authService';
import { AuthController } from './authentication/authController';
import { Authenticated } from './middleware/authenticated';

// CONFIGURAÇÃO DAS ROTAS DE FUNCIONÁRIOS
const funcionarioRoutes = Router();
const funcionarioRepository = new FuncionarioRepository();
const funcionarioService = new FuncionarioService(funcionarioRepository);
const funcionarioController = new FuncionarioController(funcionarioService);

// CONFIGURAÇÃO DAS ROTAS DE AUTENTICAÇÃO
const authRoutes = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

// Usamos .bind para garantir que o 'this' da classe Controller não se perca
// Rotas de Funcionarios
funcionarioRoutes.get('/', Authenticated, funcionarioController.listarFuncionarios.bind(funcionarioController));
funcionarioRoutes.get('/:id', Authenticated, funcionarioController.acharFuncionario.bind(funcionarioController));
funcionarioRoutes.post('/criar', Authenticated, funcionarioController.criarFuncionario.bind(funcionarioController));
funcionarioRoutes.post('/adicionar-dia/:funcionarioId', Authenticated, funcionarioController.adicionarDiaTrabalhado.bind(funcionarioController));
funcionarioRoutes.put('/atualizar/:id', Authenticated, funcionarioController.atualizarFuncionario.bind(funcionarioController));
funcionarioRoutes.delete('/deletar/:id', Authenticated, funcionarioController.deletarFuncionario.bind(funcionarioController));

// Rotas de Autenticação
authRoutes.post('/login', authController.handleLogin.bind(authController));

export { funcionarioRoutes, authRoutes };