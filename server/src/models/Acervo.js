//cria tabela do acervo no banco de dados

const { Model, DataTypes } = require('sequelize');

class Acervo extends Model {
  static init(sequelize) {
    super.init({
      // colunas tabela
      nome: DataTypes.STRING,
      povo: DataTypes.STRING,
      tipo_arquivo: DataTypes.STRING,
      fonte: DataTypes.STRING,      
      // coolunas para o upload de mídia (do multer)
      midia: DataTypes.STRING, // O nome do arquivo (ex: "documento.pdf")
      file_type: DataTypes.STRING, // O mimetype (ex: "application/pdf")     
    }, {
      sequelize
    });
  }

  // Define a relação: "Um item do Acervo pertence a um Usuário"
  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'UsuarioId', as: 'usuario' });
  }
}

module.exports = Acervo;