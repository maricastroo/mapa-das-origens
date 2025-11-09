// server/src/models/Pin.js
const {Model, DataTypes} = require('sequelize');

class Pin extends Model {
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING,
            midia: DataTypes.STRING,
            descricao: DataTypes.TEXT,
            latitude: DataTypes.DECIMAL(10, 8),
            longitude: DataTypes.DECIMAL(11, 8),
            autor_id: {
              type: DataTypes.INTEGER,
              allowNull: true, 
            },

        file_type: DataTypes.STRING,
            
        }, {
            sequelize,
            tableName: 'pins',
        });
    }

    static associate(models) {
        // Um Pin pertence a um Usuario
        this.belongsTo(models.Usuario, { foreignKey: 'autor_id', as: 'autor' });
    }
}

module.exports = Pin;