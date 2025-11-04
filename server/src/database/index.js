// inicia o sequelize 

const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

// IMPORTAR AQUI TODAS AS TABELAS QUE SERAO CRIADAS
const Usuario = require('../models/Usuario');

// CONEXAO
const connection = new Sequelize(dbConfig);

// INCIA AS TABELAS NO BANCO
Usuario.init(connection);

module.exports = connection;