//aqui ficam as rotas da aplicacao

const { Router } = require('express');
const express = require('express');
const path = require('path');
const multer = require('multer');
const multerConfig = require('./config/multer');

const authMiddleware = require('./middleware/auth'); // O "Segurança"
const AcervoController = require('./controllers/AcervoController');

//importacao dos controllers
const PinController = require('./controllers/PinController');
const UsuarioController = require('./controllers/UsuarioController');

const routes = express.Router();
const upload = multer(multerConfig); //seguranca pro multer

//CRUD COMPLETO DOS PINS
routes.post('/pins', authMiddleware, multer(multerConfig).single('midia'), PinController.store); 
routes.get('/pins', PinController.index); // Listar é público
routes.get('/pins/:id', PinController.show); // Ver um é público
routes.put('/pins/:id', authMiddleware, upload.single('midia'), PinController.update);
routes.delete('/pins/:id', authMiddleware, PinController.destroy);

//CRUD COMPLETO PARA USUARIOS
routes.post('/usuarios', UsuarioController.store); // "Cadastro" (é público)
routes.post('/login', UsuarioController.login); // "Login" (é público)

routes.get('/usuarios', authMiddleware, UsuarioController.index); 
routes.get('/usuarios/:id', authMiddleware, UsuarioController.show); 
routes.put('/usuarios/:id', authMiddleware, UsuarioController.update); 
routes.delete('/usuarios/:id', authMiddleware, UsuarioController.destroy); 

// crud acervo
routes.get('/acervo', AcervoController.index); // Listar é público
routes.get('/acervo/:id', AcervoController.show); // Ver um é público
routes.post('/acervo', authMiddleware, upload.single('midia'), AcervoController.store);
routes.put('/acervo/:id', authMiddleware, upload.single('midia'), AcervoController.update);
routes.delete('/acervo/:id', authMiddleware, AcervoController.destroy);



// para servir arquivos de mídia (uploads)
routes.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));


module.exports = routes;