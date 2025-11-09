//aqui ficam as rotas da aplicacao

const {Router} = require('express');
const multer = require('multer');
const multerConfig = require('./config/multer');

const PinController = require('./controllers/PinController');

const routes = new Router();
const upload = multer(multerConfig); //seguranca pro multer

//CRUD COMPLETO DOS PINS
routes.post('/pins',multer(multerConfig).single('midia'), PinController.store); //criar
routes.get('/pins', PinController.index); //listar todos
routes.get('/pins/:id', PinController.show); //mostrar so um
routes.put('/pins/:id', upload.single('midia'), PinController.update); //atualizar
routes.delete('/pins/:id', PinController.destroy); //deletar


module.exports = routes;