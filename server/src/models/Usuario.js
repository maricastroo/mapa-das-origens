// cria a tabela usuario no banco de dados

const { Model, DataTypes } = require('sequelize');

class Usuario extends Model {
  static init(sequelize) {
    super.init({
      // colunas da tabela
      nome: DataTypes.STRING,
      email: DataTypes.STRING,
      senha: DataTypes.STRING, 
    }, {
      sequelize,
      tableName: 'usuarios' // nome da tabela no banco
    })
  }
}

module.exports = Usuario;