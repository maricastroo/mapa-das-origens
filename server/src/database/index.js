// inicia o sequelize 

const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

// IMPORTAR AQUI TODAS AS TABELAS QUE SERAO CRIADAS
const Usuario = require('../models/Usuario');
const Acervo = require('../models/Acervo');
const Pin = require('../models/Pin');

const models = [Usuario, Acervo, Pin];

class Database {
    constructor() {
        this.init();
    }

    //conexao
    init() {
        this.connection = new Sequelize(dbConfig);
        //inicializa todas as tabelas
        models
            .map(model => model.init(this.connection))
            .map(model => model.associate && model.associate(this.connection.models));
    }
}

module.exports = new Database().connection;