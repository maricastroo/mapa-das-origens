// inicia o sequelize 

const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

// 1. Importar todos os seus models
const Usuario = require('../models/Usuario');
const Acervo = require('../models/Acervo'); 
const Pin = require('../models/Pin');

const models = [Usuario, Acervo, Pin];

class Database {
  constructor() {
    this.connection = new Sequelize(dbConfig); //Cria a conexão
    this.init(); //Roda o init (define)
    this.associate(); // Roda o associate (conecta)
    this.syncDatabase(); // Roda o sync (CRIA AS TABELAS)
  }

  //conexao (Inicializa todos os models)
  init() {
    models.forEach(model => model.init(this.connection));
  }

  //associação (Cria as relações ENTRE as tabelas)
  associate() {
    models.forEach(model => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }
  
  // Esta função CRIA as tabelas no banco de dados
  async syncDatabase() {
    try {
      // Sincroniza o banco (cria tabelas se não existirem)
      await this.connection.sync({alter: true});
      console.log('Tabelas sincronizadas com sucesso!');
    } catch (err) {
      console.error('Erro ao sincronizar tabelas:', err);
    }
  }
}

// Exporta a conexão
module.exports = new Database().connection;