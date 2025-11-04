# 🗺️ Mapa das Origens

Projeto de mapa interativo e acervo digital para a cultura dos povos originários do Paraná.

---

## Tecnologias

* **Frontend:** React, Chakra UI, React-Leaflet
* **Backend:** Node.js, Express, Sequelize (MySQL)

---

## Pastas

### FrontEnd

* **--> client/src/App.js** Configuração das rotas do frontend
* **--> client/src/index.css** A parte de estilização dos nomes do mapa estão lá
* **--> client/src/components** Toda a parte relacionada a sidebar (ela é fixa)
* **--> client/src/pages** Toda a parte relacionada as páginas (abas diferentes)
* **--> client/src/assets** Toda a parte relacionada a mídia

###  BackEnd

* **--> server/src/config/database.js** Fica a configuração do banco de dados (senha, user etc..)
* **--> server/src/models** Fica as tabelas do banco 
* **--> server/src/config/index.js** Le as configurações 

---


## Como Rodar

Este projeto exige dois terminais rodando ao mesmo tempo.

### 1. Backend (Servidor)

1.  `cd server`
2.  `npm install` (apenas na primeira vez)
3.  `npm start`
    * (Rode em `http://localhost:3000`)

### 2. Frontend (Cliente)

1.  Abra um **novo terminal**.
2.  `cd client`
3.  `npm install` (apenas na primeira vez)
4.  `npm start`
    * (Abra `http://localhost:3001` no navegador)
