//pagina para o perfil do usuario

import React from 'react';
import {
  Flex,
  Box,
  Heading,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import ParchmentBg from '../assets/Acervo.png'; 

function PerfilPage() {
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