import { Router } from 'express';
import { AuthService } from './authentication/authService';
import { AuthController } from './authentication/authController';
import { Authenticated } from './middleware/authenticated';
import { UsuarioService } from './usuarios/usuarioService';
import { UsuarioController } from './usuarios/usuarioController';
import { UsuarioRepository } from './usuarios/usuarioRepository';

const UsuarioRoutes = Router();
const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

const authRoutes = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

UsuarioRoutes.get('/', Authenticated, usuarioController.listarUsuarios.bind(usuarioController));
UsuarioRoutes.get('/:id', Authenticated, usuarioController.acharUsuario.bind(usuarioController));
UsuarioRoutes.post('/criar', usuarioController.criarUsuario.bind(usuarioController));
UsuarioRoutes.post('/adicionar-cnpj/:id', Authenticated, usuarioController.adicionarCnpj.bind(usuarioController));
UsuarioRoutes.put('/atualizar/:id', Authenticated, usuarioController.atualizarUsuario.bind(usuarioController));
UsuarioRoutes.delete('/deletar/:id', Authenticated, usuarioController.deletarUsuario.bind(usuarioController));

authRoutes.post('/login', authController.handleLogin.bind(authController));

export { UsuarioRoutes, authRoutes };