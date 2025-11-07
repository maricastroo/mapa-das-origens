//aqui ficam as rotas da aplicacao

const {Router} = require('express');
const multer = require('multer');
const multerConfig = require('./config/multer');

const PinController = require('./controllers/PinController');

const routes = new Router();

routes.post('/pins',multer(multerConfig).single('midia'), PinController.store);

module.exports = routes;