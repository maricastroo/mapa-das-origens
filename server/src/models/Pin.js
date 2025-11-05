const {Model, DataTypes} = require('sequelize');

class Pin extends Model {
    static init(sequelize) {
        super.init({
            descricao: DataTypes.TEXT,
            midia: DataTypes.STRING,

            //precisa da localizacao
            latitude: DataTypes.DECIMAL(10, 8),
            longitude: DataTypes.DECIMAL(11, 8),
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