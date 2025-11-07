// arquivo para configurar o servidor 
//⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄
const express = require('express');
const cors = require('cors'); // permite que o back se comunique com o front
const path = require('path');
require('dotenv').config(); // carrega variáveis de ambiente do arquivo .env

//para "ligar" o banco de dados
require('./database');

//⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄

const routes = require('./routes'); // importa as rotas da aplicacao

//⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄

const app = express(); // utilizara app para configurar tudo a partir de agora

// Middlewares 
app.use(cors()); // (precisa ser chamado como uma função)
app.use(express.json()); // permite que o express entenda JSON no corpo das requisições

//⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄


// Rotas
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads'))); // rota para acessar arquivos de mídia
app.use(routes); // usa as rotas da aplicacao

//⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂⠁⠁⠂⠄

// Rota teste
app.get('/', (req, res) => {
    res.send('Esta porra esta rodando!');
});

const PORT = process.env.PORT || 3000; // porta que o servidor irá rodar

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`); 
});