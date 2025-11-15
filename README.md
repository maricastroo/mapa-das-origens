# 🗺️ Mapa das Origens

Projeto de mapa interativo e acervo digital para a cultura dos povos originários do Paraná.

---

## Tecnologias Utilizadas

* **Frontend:** React, Chakra UI, React-Leaflet, Axios (para chamadas de API)
* **Backend:** Node.js, Express, Sequelize (MySQL), BCrypt.js (para criptografia), JWT (para tokens)

---

## Pastas

### FrontEnd

* **--> client/src/App.js** Configuração das rotas do frontend (com layout único e Sidebar)
* **--> client/src/index.css** Estilização de classes globais (ex: `.map-label-hover`, `.city-label-permanent`)
* **--> client/src/index.js** Ponto de entrada do React, envolve o App no `ChakraProvider` e `AuthProvider`.
* **--> client/src/context/AuthContext.jsx** "Cérebro" global do app. Gerencia o login, logout, token e dados do usuário.
* **--> client/src/components** Toda a parte relacionada a sidebar (ela é fixa e colapsável)
* **--> client/src/pages** Páginas do app (MapPage, AcervoPage, PerfilPage, LoginPage, CadastroPage)
* **--> client/src/assets** Mídias estáticas (logo, fundo de pergaminho)

###  BackEnd

* **--> server/src/config/database.js** Configuração do banco de dados (senha, user etc..)
* **--> server/src/models** As "tabelas" do banco (Usuario.js, Pin.js, Acervo.js)
* **--> server/src/config/index.js** Le as configurações (Não usado ativamente, mas parte da estrutura)
* **--> server/src/config/multer.js** Configuração para o upload de mídias (PDF, JPEG...)
* **--> server/src/controllers** Lógica de negócio (UsuarioController, PinController)
* **--> server/src/routes.js** Define os 'endereços' da API (ex: /pins, /login, /cadastro)
* **--> server/uploads** Onde as mídias (PDFs, JPEGs) são salvas.

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