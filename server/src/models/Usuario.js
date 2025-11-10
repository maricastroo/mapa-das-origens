// server/src/models/Usuario.js
const { Model, DataTypes } = require('sequelize');

class Usuario extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false, //obrigatorio
        unique: true,//unico  
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false, //obrigatorio
        unique: true,//unico
      },
      // Armazena a senha criptografada
      password_hash: DataTypes.STRING, 
    }, {
      sequelize,
      tableName: 'usuarios',
    });
  }

  static associate(models) {
    // um mesmoi usuario pode ter muitos pins
    this.hasMany(models.Pin, { foreignKey: 'autor_id', as: 'pins' });
  }

  // Remove campos sensíveis
  toJSON() {
    const values = { ...this.get() };
    delete values.password_hash;
    delete values.senha;
    return values;
  }
}

module.exports = Usuario;