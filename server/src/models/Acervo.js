//cria tabela do acervo no banco de dados

const { Model, DataTypes } = require('sequelize');

class Acervo extends Model {
    static init(sequelize) {
        super.init({
        nome: DataTypes.STRING,
        povo: DataTypes.STRING,
        tipo_de_arquivo: DataTypes.STRING,
        fonte_referencia: DataTypes.TEXT, // text para textos maiores
        data: DataTypes.DATEONLY, // apenas datas
        }, {
            sequelize,
            tableName: 'acervos' // nome da tabela no banco
        })
    }
    
    //relacao entre tabelas = item do acervo pertece a um usuario
    static associate(models) {
        // relacao entre acervo e usuario (muitos para um)
        this.belongsTo(models.Usuario, { foreignKey: 'enviado_por', as: 'autor' });
    }
}

module.exports = Acervo;