import { Router } from 'express';
import { AuthService } from './authentication/authService';
import { AuthController } from './authentication/authController';
import { Authenticated } from './middleware/authenticated';
import { UsuarioService } from './usuarios/usuarioService';
import { UsuarioController } from './usuarios/usuarioController';
import { UsuarioRepository } from './usuarios/usuarioRepository';
import { GoogleController } from './google/googleController';
import { GoogleRepository } from './google/googleRepository';
import { GoogleService } from './google/googleService';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
});

const UsuarioRoutes = Router();
const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

const googleRoutes = Router();
const googleRepository = new GoogleRepository();
const googleService = new GoogleService(googleRepository);
const googleController = new GoogleController(googleService);

const authRoutes = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

UsuarioRoutes.get('/', Authenticated, usuarioController.listarUsuarios.bind(usuarioController));
UsuarioRoutes.get('/:id', Authenticated, usuarioController.acharUsuario.bind(usuarioController));
UsuarioRoutes.post('/criar', usuarioController.criarUsuario.bind(usuarioController));
UsuarioRoutes.post('/adicionar-cnpj/:id', Authenticated, usuarioController.adicionarCnpj.bind(usuarioController));
UsuarioRoutes.put('/atualizar/:id', Authenticated, usuarioController.atualizarUsuario.bind(usuarioController));
UsuarioRoutes.delete('/deletar/:id', Authenticated, usuarioController.deletarUsuario.bind(usuarioController));

googleRoutes.post('/processar-pdf', upload.single('pdf'), googleController.processarPDF.bind(googleController));

authRoutes.post('/login', authController.handleLogin.bind(authController));

export { UsuarioRoutes, authRoutes, googleRoutes };