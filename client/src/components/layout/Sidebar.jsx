//pagina da barra lateral

import React, { useState } from 'react'; 
import { Flex, VStack, Link, IconButton, Divider, Spacer, Text } from '@chakra-ui/react';
import { HamburgerIcon, SettingsIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function Sidebar() {

 // estado da side bar 
  const [isCollapsed, setIsCollapsed] = useState(true);

  const location = useLocation();

  // cores
  const bgColor = "#FFEFDC";
  const textColor = "#091106";
  const activeBg = "#E9CEAE"; 
  const dividerColor = "#091106";

  const isActive = (path) => location.pathname === path;

  return (
    <Flex
      as="nav"
      direction="column"
      w={isCollapsed ? '100px' : '150px'} 
      transition="width 0.2s ease-in-out"
      minH="100vh"
      bg={bgColor}
      color={textColor} 
      p={4}
      align="center"
    >
      
      {/* MENU */}
      <IconButton
        onClick={() => setIsCollapsed(!isCollapsed)} 
        aria-label="Menu"
        icon={<HamburgerIcon />}
        fontSize="3xl"
        color="white" 
        bg="black"
        borderRadius="full"
        boxSize="60px" 
        _hover={{ bg: 'black' }} 
        mb={10}
      />

      {/* LINKS*/}
      <VStack 
        spacing={0} 
        align="stretch" 
        w="100%"
        display={isCollapsed ? 'none' : 'flex'} 
      >
        
        {/* Mapa */}
        <Link 
          as={RouterLink}
          to="/mapa" 
          textAlign="center"
          py={4} 
          bg={isActive('/mapa') ? activeBg : 'transparent'} 
          _hover={{ textDecor: 'none', bg: activeBg }}
        >
          <Text fontSize="2xl" fontFamily="Belezza"> 
            Mapa
          </Text>
        </Link>
        <Divider borderColor={dividerColor} /> 
        
        {/* Acervo */}
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

        {/* Perfil */}
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
      
{/* ÍCONE DE CONFIGURAÇÕES */}
      <IconButton
        as={RouterLink}
        to="/config"
        display={isCollapsed ? 'none' : 'block'}
        aria-label="Configurações"
        icon={<SettingsIcon />}
        fontSize="4xl" 
        variant="ghost" 
        color="black" 
        _hover={{ bg: 'blackAlpha.100' }}
        mt={4} 
      />
      {/* empurra o FAQ para o final da página */}
      <Spacer />

      {/* 5. ÍCONE DE FAQ */}
      <IconButton
        as={RouterLink} 
        to="/faq" 
        aria-label="Ajuda"
        display={isCollapsed ? 'none' : 'block'} 
        icon={<QuestionOutlineIcon />} 
        fontSize="4xl" 
        variant="ghost" 
        color="black"
        _hover={{ bg: 'blackAlpha.100' }}
        mb={4} 
      />

    </Flex>
  );
}

export default Sidebar;