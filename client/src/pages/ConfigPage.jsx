// src/pages/ConfigPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Flex,
  Box,
  Image,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';

import Logo from '../assets/origens.png'; 
import ParchmentBg from '../assets/Acervo.png'; 
import { useAuth } from '../context/AuthContext'; 
import axios from 'axios';

function ConfigPage() {
  const { user, token } = useAuth(); 
  const toast = useToast();

  // cores
  const bgColor = "#FFEFDC"; 
  const titleColor = "#091106";
  const buttonBg = "#3A5324";
  const buttonHoverBg = "#213A14";
  const inputBorder = "#091106"; 

  // estados
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    if (user) {
      setNome(user.nome || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdate = async () => {
    if (novaSenha && novaSenha !== confirmarSenha) {
      toast({ title: "Erro", description: "Senhas não coincidem.", status: "error", duration: 3000, isClosable: true });
      return;
    }
    if (novaSenha && !senhaAntiga) {
      toast({ title: "Atenção", description: "Informe a senha atual para trocar.", status: "warning", duration: 3000, isClosable: true });
      return;
    }

    try {
      const payload = { nome, username, email };
      if (novaSenha) {
        payload.senha = novaSenha;
        payload.senhaAntiga = senhaAntiga;
      }

      await axios.put(`http://localhost:3000/usuarios/${user.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({ title: "Sucesso!", description: "Dados atualizados.", status: "success", duration: 3000, isClosable: true });
      setSenhaAntiga(''); setNovaSenha(''); setConfirmarSenha('');

    } catch (error) {
      console.error("Erro:", error);
      toast({ title: "Erro", description: "Erro ao atualizar.", status: "error", duration: 3000, isClosable: true });
    }
  };

  return (
    <Flex 
      flex="1" 
      px={8}
      backgroundImage={ParchmentBg}
      backgroundSize="cover"
      backgroundPosition="center"
      direction="column"
      align="center"
      justify="center"
      
      fontFamily="Belezza" 
      color={titleColor}
      minH="100vh" 
      w="100%" 
      position="relative"
    >
      {/* logo */}
      <Flex 
        position="absolute"
        top="16px"
        right="12px"
        zIndex={10}
      >
        <Image src={Logo} alt="Mapa das Origens Logo" w="220px" />
      </Flex>
      <VStack spacing={8} w="100%" maxW="1000px">
        
        <Heading 
          as="h1" 
          size="2xl" 
          textAlign="center"
          fontWeight="normal" 
          fontFamily="Belezza"
        >
          Configurações da Conta
        </Heading>

        {/* caixa */}
        <Box
          bg={bgColor}
          w="100%" 
          p={10}
          borderRadius="md"
          boxShadow="xl"
        >
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12}>
            
            {/* COLUNA ESQUERDA */}
            <VStack spacing={5} align="stretch">
              <Heading size="lg" fontFamily="Belezza" fontWeight="normal">
                Dados Pessoais
              </Heading>
              
              <FormControl>
                <FormLabel fontFamily="Belezza" mb={1}>Nome</FormLabel>
                <Input 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  bg="#FFEFDC" 
                  borderColor={inputBorder} 
                  fontFamily="Belezza" 
                  _hover={{ borderColor: '#3A5324' }}
                  _focus={{ borderColor: '#3A5324', boxShadow: 'none' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontFamily="Belezza" mb={1}>Usuário (@)</FormLabel>
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  bg="#FFEFDC" 
                  borderColor={inputBorder} 
                  fontFamily="Belezza" 
                  _hover={{ borderColor: '#3A5324' }}
                  _focus={{ borderColor: '#3A5324', boxShadow: 'none' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontFamily="Belezza" mb={1}>E-mail</FormLabel>
                <Input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  type="email" 
                  bg="#FFEFDC" 
                  borderColor={inputBorder} 
                  fontFamily="Belezza" 
                  _hover={{ borderColor: '#3A5324' }}
                  _focus={{ borderColor: '#3A5324', boxShadow: 'none' }}
                />
              </FormControl>
            </VStack>

            {/* COLUNA DIREITA */}
            <VStack spacing={5} align="stretch">
              <Heading size="lg" fontFamily="Belezza" fontWeight="normal">
                Alterar Senha
              </Heading>

              <FormControl>
                <FormLabel fontFamily="Belezza" mb={1}>Senha Atual</FormLabel>
                <Input 
                  value={senhaAntiga} 
                  onChange={(e) => setSenhaAntiga(e.target.value)} 
                  type="password" 
                  bg="#FFEFDC" 
                  borderColor={inputBorder} 
                  fontFamily="Belezza" 
                  placeholder="Apenas se for trocar" 
                  _placeholder={{ fontSize: 'sm', color: 'gray.600' }}
                  _hover={{ borderColor: '#3A5324' }}
                  _focus={{ borderColor: '#3A5324', boxShadow: 'none' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontFamily="Belezza" mb={1}>Nova Senha</FormLabel>
                <Input 
                  value={novaSenha} 
                  onChange={(e) => setNovaSenha(e.target.value)} 
                  type="password" 
                  bg="#FFEFDC" 
                  borderColor={inputBorder} 
                  fontFamily="Belezza" 
                  _hover={{ borderColor: '#3A5324' }}
                  _focus={{ borderColor: '#3A5324', boxShadow: 'none' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontFamily="Belezza" mb={1}>Confirmar Nova Senha</FormLabel>
                <Input 
                  value={confirmarSenha} 
                  onChange={(e) => setConfirmarSenha(e.target.value)} 
                  type="password" 
                  bg="#FFEFDC" 
                  borderColor={inputBorder} 
                  fontFamily="Belezza" 
                  _hover={{ borderColor: '#3A5324' }}
                  _focus={{ borderColor: '#3A5324', boxShadow: 'none' }}
                />
              </FormControl>
            </VStack>

          </SimpleGrid>

          {/* botao*/}
          <Flex justify="center" mt={12}>
            <Button
              onClick={handleUpdate}
              bg={buttonBg}
              color="white"
              borderRadius="full"
              border="none"
              fontWeight="normal"
              fontFamily="Belezza"
              fontSize="lg"
              _hover={{ bg: buttonHoverBg }}
              h="50px" 
              px={12}  
              lineHeight="1" 
            >
              Salvar Alterações
            </Button>
          </Flex>

        </Box>
      </VStack>
    </Flex> 
  );
}

export default ConfigPage;