// pagina para o login
import React, { useState } from 'react';
import {
  Flex,
  Box,
  Image,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

import Logo from '../assets/origens.png'; 
import ParchmentBg from '../assets/Acervo.png'; 

function LoginPage() {
  const bgColor = "#FFEFDC"; 
  const titleColor = "#091106";
  const buttonBg = "#3A5324";
  const buttonHoverBg = "#213A14";
  const inputBorder = "#091106"; 

  // para os campos do form 
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  // funcao para lidar com o login
  const handleLogin = async () => {
    // validação simples
    if (!email || !senha) {
      alert('Por favor, preencha o email e a senha.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email: email,
        senha: senha,
      });
      login(response.data.user, response.data.token);
      navigate('/mapa'); // redireciona para a pagina do acervo apos o login

    } catch (error) {
      // se o backend der erro 
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert('Erro ao conectar com o servidor.');
      }
    }
  };

  return (
    <Flex 
      flex="1" 
      direction="column"
      align="center" 
      justify="center" 
      color={titleColor} 
      fontFamily="Belezza" 
      backgroundImage={ParchmentBg}
      backgroundSize="cover"
      backgroundPosition="center"
      p={8}
      minH="100vh"
      position="relative"
    >
      {/* LOGO */}
      <Flex 
        position="absolute"
        top="16px"
        right="12px"
        zIndex={10}
      >
        <Image src={Logo} alt="Mapa das Origens Logo" w="220px" />
      </Flex>

      {/* CAIXA DO FUNDO*/}
      <Box
        bg={bgColor}
        w={{ base: '90%', md: '450px' }} 
        p={8}
        borderRadius="md"
        boxShadow="xl" 
      >
        <VStack spacing={4} align="stretch">
          {/* TITULO */}
          <Heading 
            as="h1" 
            size="2xl" 
            fontFamily="Belezza" 
            color={titleColor}
            textAlign="center"
            fontWeight="normal" 
            mb={4}
          >
            Login
          </Heading>
          
          {/* FORM*/}
          <FormControl>
            <FormLabel fontFamily="Belezza" color={titleColor}>Email</FormLabel>
            <Input 
              type="email" 
              bg="#FFEFDC" 
              borderColor={inputBorder} 
              fontFamily="Belezza" 

              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </FormControl>
          
          <FormControl>
            <FormLabel fontFamily="Belezza" color={titleColor}>Senha</FormLabel>
            <Input 
              type="password" 
              bg="#FFEFDC" 
              borderColor={inputBorder} 
              fontFamily="Belezza" 

              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </FormControl>
          
          <Button
            type="submit"
            bg={buttonBg}
            color="white"
            borderRadius="full"
            border="none"
            fontWeight="normal"
            fontFamily="Belezza" 
            _hover={{ bg: buttonHoverBg }}
            mt={4}
            py={6} 
            onClick={handleLogin}
          >
            Entrar
          </Button>

          <Text fontFamily="Belezza" textAlign="center" pt={4}> 
            Ainda não tem uma conta?{' '}
            <Link 
              as={RouterLink} 
              to="/cadastro" 
              fontWeight="bold"
              color={titleColor}
              textDecoration="underline"
            >
              Crie uma aqui.
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex> 
  );
}

export default LoginPage;