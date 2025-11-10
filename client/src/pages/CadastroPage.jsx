//pagina para cadastro de usuario

import React, { useState } from 'react';
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  VStack,
  Radio,
  RadioGroup,
  Stack,
  Alert,
  AlertIcon,
  Image,
  InputGroup, 
  InputRightElement, 
  Icon 
} from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ParchmentBg from '../assets/Acervo.png'; 
import Logo from '../assets/origens.png'; 

function CadastroPage() {
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [termos, setTermos] = useState(null); // 'sim' ou 'nao'
  
  // Para erros da API
  const [apiError, setApiError] = useState('');
  // Para erros de validação por campo
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // impede o recarregamento da página
    setApiError(''); // limpa erros antigos
    setFieldErrors({}); // limpa erros de campo

    // validacoes
    let newErrors = {};
    if (!nome) newErrors.nome = 'Campo obrigatório';
    if (!username) newErrors.username = 'Campo obrigatório';
    if (!email) newErrors.email = 'Campo obrigatório';
    if (!senha) newErrors.senha = 'Campo obrigatório';
    if (!confirmarSenha) newErrors.confirmarSenha = 'Campo obrigatório';

    if (senha && confirmarSenha && senha !== confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não conferem';
    }
    if (termos !== 'sim') {
      newErrors.termos = 'Você precisa concordar com os Termos de Condição e Uso.';
    }

    // Se houver qualquer erro, atualiza o estado e para
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }
    // prepara dados do front
    const data = {
      nome,
      username,
      email,
      senha,
    };

    // chama api
    try {
      await axios.post('http://localhost:3000/usuarios', data);
      
      // Sucesso
      alert('Conta criada com sucesso!');
      navigate('/login'); 

    } catch (err) {
      // pega o erro específico do backend (ex: "Email já cadastrado" ou "Usuário já em uso")
      if (err.response && err.response.data && err.response.data.error) {
        setApiError(err.response.data.error);
      } else {
        setApiError('Erro ao criar a conta. Tente novamente.');
      }
    }
  };

  return (
    <Flex
      flex="1"
      direction="column"
      align="center"
      justify="center" 
      color="#000000"
      fontFamily="Belezza"
      backgroundImage={ParchmentBg}
      backgroundSize="cover"
      backgroundPosition="center"
      p={8}
      minH="100vh"
      position="relative" 
    >
      {/* logo canto direito */}
      <Flex 
        position="absolute"
        top="16px"
        right="12px"
        zIndex={10}
      >
        <Image src={Logo} alt="Mapa das Origens Logo" w="220px" />
      </Flex>

      {/* card */}
      <Box 
        as="form" 
        w={{ base: '95%', md: '700px' }} 
        onSubmit={handleSubmit}
        bg="#FFEFDC" 
        p={{ base: 6, md: 10 }}
        borderRadius="lg"
      >
        <Heading fontFamily="Belezza" mb={8} textAlign="center">
          Criar conta
        </Heading>

        <VStack spacing={4} align="stretch" textAlign="left">
          
          {/* nome */}
          <FormControl isRequired isInvalid={!!fieldErrors.nome}>
            <FormLabel fontWeight="normal">Nome*</FormLabel>
            <InputGroup>
              <Input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                bg="#FFEFDC" // <-- Fundo igual ao modal
                borderColor={fieldErrors.nome ? "red.500" : "#000000"} 
                borderWidth="1px"
                borderRadius="5px"
                _hover={{ borderColor: '#000000' }}
              />
              {fieldErrors.nome && (
                <InputRightElement>
                  <Icon as={WarningIcon} color="red.500" />
                </InputRightElement>
              )}
            </InputGroup>
            {fieldErrors.nome && (
              <Text fontSize="xs" color="red.500" textAlign="right" mt={1}>
                *{fieldErrors.nome}
              </Text>
            )}
          </FormControl>

          {/* usuario adicionado */}
          <FormControl isRequired isInvalid={!!fieldErrors.username}>
            <FormLabel fontWeight="normal">Usuário*</FormLabel>
            <InputGroup>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: @seuUsernameLegal"
                bg="#FFEFDC" // <-- Fundo igual ao modal
                borderColor={fieldErrors.username ? "red.500" : "#000000"}
                borderWidth="1px"
                borderRadius="5px"
                _hover={{ borderColor: '#000000' }}
              />
              {fieldErrors.username && (
                <InputRightElement>
                  <Icon as={WarningIcon} color="red.500" />
                </InputRightElement>
              )}
            </InputGroup>
            {fieldErrors.username && (
              <Text fontSize="xs" color="red.500" textAlign="right" mt={1}>
                *{fieldErrors.username}
              </Text>
            )}
          </FormControl>

          {/* email */}
          <FormControl isRequired isInvalid={!!fieldErrors.email}>
            <FormLabel fontWeight="normal">E-mail*</FormLabel>
            <InputGroup>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="#FFEFDC" // <-- Fundo igual ao modal
                borderColor={fieldErrors.email ? "red.500" : "#000000"}
                borderWidth="1px"
                borderRadius="5px"
                _hover={{ borderColor: '#000000' }}
              />
              {fieldErrors.email && (
                <InputRightElement>
                  <Icon as={WarningIcon} color="red.500" />
                </InputRightElement>
              )}
            </InputGroup>
            {fieldErrors.email && (
              <Text fontSize="xs" color="red.500" textAlign="right" mt={1}>
                *{fieldErrors.email}
              </Text>
            )}
          </FormControl>

          {/* senha */}
          <FormControl isRequired isInvalid={!!fieldErrors.senha}>
            <FormLabel fontWeight="normal">Senha*</FormLabel>
            <InputGroup>
              <Input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                bg="#FFEFDC" // <-- Fundo igual ao modal
                borderColor={fieldErrors.senha ? "red.500" : "#000000"}
                borderWidth="1px"
                borderRadius="5px"
                _hover={{ borderColor: '#000000' }}
              />
              {fieldErrors.senha && (
                <InputRightElement>
                  <Icon as={WarningIcon} color="red.500" />
                </InputRightElement>
              )}
            </InputGroup>
            {fieldErrors.senha && (
              <Text fontSize="xs" color="red.500" textAlign="right" mt={1}>
                *{fieldErrors.senha}
              </Text>
            )}
          </FormControl>

          {/* confirmar senha*/}
          <FormControl isRequired isInvalid={!!fieldErrors.confirmarSenha}>
            <FormLabel fontWeight="normal">Confirmar senha*</FormLabel>
            <InputGroup>
              <Input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                bg="#FFEFDC" // <-- Fundo igual ao modal
                borderColor={fieldErrors.confirmarSenha ? "red.500" : "#000000"}
                borderWidth="1px"
                borderRadius="5px"
                _hover={{ borderColor: '#000000' }}
              />
              {fieldErrors.confirmarSenha && (
                <InputRightElement>
                  <Icon as={WarningIcon} color="red.500" />
                </InputRightElement>
              )}
            </InputGroup>
            {fieldErrors.confirmarSenha && (
              <Text fontSize="xs" color="red.500" textAlign="right" mt={1}>
                *{fieldErrors.confirmarSenha}
              </Text>
            )}
          </FormControl>

          {/* termos*/}
          <FormControl isInvalid={!!fieldErrors.termos}>
            <FormLabel fontWeight="normal">Concorda com os Termos de Condição e Uso?</FormLabel>
            <RadioGroup onChange={setTermos} value={termos}>
              <Stack direction="column">
                <Radio value="sim" bg="#FFEFDC" p={3} borderRadius="5px" borderColor="#000000" borderWidth="1px" >
                  Sim
                </Radio>
                <Radio value="nao" bg="#FFEFDC" p={3} borderRadius="5px"  borderColor="#000000" borderWidth="1px">
                  Não
                </Radio>
              </Stack>
            </RadioGroup>
            {fieldErrors.termos && (
              <Text fontSize="xs" color="red.500" textAlign="right" mt={1}>
                *{fieldErrors.termos}
              </Text>
            )}
          </FormControl>

          {/* erro da API (erros gerais) */}
          {apiError && (
            <Alert status="error" borderRadius="5px" bg="red.100">
              <AlertIcon />
              {apiError}
            </Alert>
          )}

          {/* enviar (botao) */}
          <Button
            type="submit"
            bg="#3A5324"
            color="white"
            borderRadius="full"
            border="none"
            fontWeight="normal"
            _hover={{ bg: '#213A14' }}
            mt={4}
            py={6} 
          >
            Enviar
          </Button>

          <Text fontSize="xs" textAlign="center" color="gray.600">
            Seu nome será compartilhado. Nunca envie senhas.
          </Text>

        </VStack>
      </Box>
    </Flex>
  );
}

export default CadastroPage;