//pagina da barra lateral

import React, { useState } from 'react'; 
import { Flex, VStack, Link, IconButton, Divider, Spacer, Text } from '@chakra-ui/react';
import { HamburgerIcon, SettingsIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function Sidebar() {

 // estado da side bar 
  const [isCollapsed, setIsCollapsed] = useState(true);

  const location = useLocation();

  // cores
  const bgColor = "#FFEFDC";// fundo
  const textColor = "#091106";// texto e icons
  const activeBg = "#E9CEAE"; //cor de quando esta selecionado
  const dividerColor = "#091106";// divisao

  // aqui verifica se o link ativo
  const isActive = (path) => location.pathname === path;

  return (
    <Flex
      as="nav"
      direction="column"
      
      w={isCollapsed ? '82px' : '150px'} // 
      transition="width 0.2s ease-in-out"

      minH="100vh"
      bg={bgColor}
      color={textColor} 
      p={4}
      align="center"
    >
      
      {/* menu */}
      <IconButton
        onClick={() => setIsCollapsed(!isCollapsed)} 
        aria-label="Menu"
        icon={<HamburgerIcon />}
        fontSize="2xl"
        color="white" // linhas
        bg={textColor} // fundo
        borderRadius="full"// botao em circulo
        boxSize="50px" // tamanho fixo
        _hover={{ bg: 'black' }} 
        mb={10}
      />

      {/* links */}
      <VStack 
        spacing={0} 
        align="stretch" 
        w="100%"
        display={isCollapsed ? 'none' : 'flex'} 
      >
        
        {/* mapa*/}
        <Link 
          as={RouterLink}
          to="/mapa" 
          textAlign="center"
          py={4} // espaco vertical
          bg={isActive('/mapa') ? activeBg : 'transparent'} // fundo
          _hover={{ textDecor: 'none', bg: activeBg }}
        >
          <Text fontSize="2xl" fontFamily="Belezza"> {/* fonte */}
            Mapa
          </Text>
        </Link>
        <Divider borderColor={dividerColor} /> 
        
        {/* aceervo */}
        <Link 
          as={RouterLink}
          to="/acervo"
          textAlign="center"
          py={4}
          bg={isActive('/acervo') ? activeBg : 'transparent'} 
          _hover={{ textDecor: 'none', bg: activeBg }}
        >
          <Text fontSize="2xl" fontFamily="Belezza">
            Acervo
          </Text>
        </Link>
        <Divider borderColor={dividerColor} /> 

        {/* perfil */}
        <Link 
          as={RouterLink}
          to="/perfil"
          textAlign="center"
          py={4}
          bg={isActive('/perfil') ? activeBg : 'transparent'}
          _hover={{ textDecor: 'none', bg: activeBg }}
        >
          <Text fontSize="2xl" fontFamily="Belezza">
            Perfil
          </Text>
        </Link>
        <Divider borderColor={dividerColor} /> 

      </VStack>

      {/* logo de configs */}
      <IconButton
        display={isCollapsed ? 'none' : 'block'}
        aria-label="Configurações"
        icon={<SettingsIcon />}
        fontSize="3xl" //tamanho do icon
        variant="ghost" // sem fundo
        color={textColor}
        _hover={{ bg: 'blackAlpha.100' }}
      />
    </Flex>
  );
}

export default Sidebar;