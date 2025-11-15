//aqui configura as rotas do front!!!

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';

import Sidebar from './components/layout/Sidebar.jsx';
import MapPage from './pages/MapPage.jsx';
import AcervoPage from './pages/AcervoPage.jsx'; 
import PerfilPage from './pages/PerfilPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CadastroPage from './pages/CadastroPage.jsx';

function App() {
  return (
    <Router>
      <Flex minH="100vh"> 
        {/* barra do lado */}
        <Sidebar />
        
        {/* conteudo principal */}
        <Flex as="main" flex="1">
          <Routes> 
            <Route path="/" element={<MapPage />} /> 
            <Route path="/mapa" element={<MapPage />} />
            <Route path="/acervo" element={<AcervoPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />
          </Routes>
        </Flex>
      </Flex>
    </Router>
  );
}

export default App;