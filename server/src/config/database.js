//carrega do env

require('dotenv').config();

module.exports = {
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'mapa_origens',
    define: {
        timestamps: true,
        underscored: true,
    },
};

