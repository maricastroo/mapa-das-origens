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
  static associate(models) {
    this.hasMany(models.Acervo, { foreignKey: 'enviado_por', as: 'itens_acervo' });
    this.hasMany(models.Pin, { foreignKey: 'autor_id', as: 'pins' });
  }
}

module.exports = Usuario;