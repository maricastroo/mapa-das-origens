//pagina para o perfil do usuario

import React from 'react';
import {
  Flex,
  Box,
  Heading,
  Button,
  Text,
  VStack,
  Image,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import ParchmentBg from '../assets/Acervo.png'; 
import Logo from '../assets/origens.png';
import { useAuth } from '../context/AuthContext';

function PerfilPage() {
  const {user, logout} = useAuth();

  const buttonBg = "#3A5324";
  const buttonHoverBg = "#213A14";

  if (user) {
    //O QUE MOSTRAR SE ESTIVER LOGADO
    return (
      <Flex
        flex="1"
        direction="column"
        align="center"
        justify="center"
        color="#000000"
        fontFamily="Belezza"
        p={8}
        textAlign="center"
        minH="100vh"
        backgroundImage={ParchmentBg}
        backgroundSize="cover"
        backgroundPosition="center"
        position="relative" // Posição relativa para o logo
      >
        {/* Logo */}
        <Flex 
          position="absolute"
          top="16px"
          right="12px"
          zIndex={10}
        >
          <Image src={Logo} alt="Mapa das Origens Logo" w="220px" />
        </Flex>

        {/* Caixa de conteúdo central */}
        <Box
          bg="#FFEFDC" // Fundo creme, como no login
          w={{ base: '90%', md: '450px' }} 
          p={10}
          borderRadius="md"
          boxShadow="xl"
        >
          <VStack spacing={6}>
            <Heading fontFamily="Belezza" fontWeight="normal" size="2xl">
              Meu Perfil
            </Heading>
            
            <Text fontSize="xl" pt={4}>
              Olá, <strong>{user.nome || user.username}!</strong>
            </Text>
            <Text fontSize="lg">Email: {user.email}</Text>

            {/* (Aqui você pode adicionar "Editar Perfil", "Meus Pins", etc.) */}
            
            {/* botao Sair */}
            <Button
              onClick={logout} // CHAMA A FUNÇÃO LOGOUT
              bg={buttonBg}
              color="white"
              borderRadius="full"
              border="none"
              fontWeight="normal"
              _hover={{ bg: buttonHoverBg }}
              px={16} 
              py={6} 
            >
              Sair
            </Button>
          </VStack>
        </Box>
      </Flex>
    );
  }
  
  // O QUE MOSTRAR SE NÃO ESTIVER LOGADO
  return (
    <Flex
      flex="1"
      direction="column"
      align="center"
      justify="center"
      bg="#FFEFDC"
      color="#000000"
      fontFamily="Belezza"
      p={8}
      textAlign="center"
      minH="100vh"
      backgroundImage={ParchmentBg}
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Heading fontFamily="Belezza" mb={8}>
        Perfil
      </Heading>

      {/* Caixa de conteúdo central */}
      <Box
        bg="rgba(255, 255, 255, 0.1)" 
        p={10}
        borderRadius="md"
      >
        <VStack spacing={6}>
          <Text fontSize="xl">
            Oops! Você precisa estar logado para acessar seu perfil.
          </Text>

          {/* botao entrar */}
          <Button
            as={RouterLink}
            to="/login"
            bg="#3A5324"
            color="white"
            borderRadius="full"
            border="none"
            fontWeight="normal"
            _hover={{ bg: '#213A14' }}
            px={16} 
            py={6} 
          >
            Entrar
          </Button>

          <Text fontSize="lg" pt={4}>
            Ainda não tem uma conta?
          </Text>

          {/* botao criar conta */}
          <Button
            as={RouterLink}
            to="/cadastro"
            bg="#3A5324"
            color="white"
            borderRadius="full"
            border="none"
            fontWeight="normal"
            _hover={{ bg: '#213A14' }}
            px={10}
            py={6}
          >
            Criar conta
          </Button>

        </VStack>
      </Box>
    </Flex>
  );
}

export default PerfilPage;