//carrega do env

require('dotenv').config({path: '../../.env'});

module.exports = {
    dialect: 'mysql',
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'mapa_origens',

    dialectOptions: {
    socketPath: '/tmp/mysql.sock'
  },
  
  define: {
    timestamps: true,
    underscored: true,
  },
};

