//aqui ficam as rotas da aplicacao

const { Router } = require('express');
const express = require('express');
const path = require('path');
const multer = require('multer');
const multerConfig = require('./config/multer');

//importacao dos controllers
const PinController = require('./controllers/PinController');
const UsuarioController = require('./controllers/UsuarioController');

const routes = express.Router();
const upload = multer(multerConfig); //seguranca pro multer

//CRUD COMPLETO DOS PINS
routes.post('/pins',multer(multerConfig).single('midia'), PinController.store); //criar
routes.get('/pins', PinController.index); //listar todos
routes.get('/pins/:id', PinController.show); //mostrar so um
routes.put('/pins/:id', upload.single('midia'), PinController.update); //atualizar
routes.delete('/pins/:id', PinController.destroy); //deletar

//CRUD COMPLETO PARA USUARIOS
routes.post('/usuarios', UsuarioController.store); //criar
routes.post('/login', UsuarioController.login);
routes.get('/usuarios', UsuarioController.index); //listar todos
routes.get('/usuarios/:id', UsuarioController.show); //mostrar so um
routes.put('/usuarios/:id', UsuarioController.update); //atualizar
routes.delete('/usuarios/:id', UsuarioController.destroy); //deletar

// para servir arquivos de mídia (uploads)
routes.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));


module.exports = routes;
