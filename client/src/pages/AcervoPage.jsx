// src/pages/AcervoPage.jsx
import React from 'react';
import {
  Flex,
  Box, // 1. IMPORTAR O 'Box'
  Image,
  Text,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Logo from '../assets/origens.png'; 
import ParchmentBg from '../assets/Acervo.png'; 

function AcervoPage() {
  // Cores do protótipo
  const searchBarBg = "#FFEFDC"; // cor navbar
  const tableHeaderBg = "#5D7541"; // verde da tabela
  const tableRowLight = "#E9CEAE";    // cor linha tabela
  const buttonBg = "#213A14"; //cor fundo botao
  const titleBg = "#EAE0D1";        // cor fundo titulo
  const titleColor = "#091106";     // cor titulo (usado no botão e borda)

  

  return (
    <Flex 
      flex="1" 
      pt={4}
      pb={8}
      px={8}
      backgroundImage={ParchmentBg}
      backgroundSize="cover"
      backgroundPosition="center"
      direction="column"
    >
      {/* navbar + logo */}
      <Flex justify="space-between" align="center" mb={4}>
        <Box flex="1" pr={8}> 
          <InputGroup w={{ base: '100%', md: '80%' }} mx="auto"> 
            <InputLeftElement pointerEvents="none" h="100%">
              <SearchIcon color="000000" />
            </InputLeftElement>
            <Input 
              placeholder="Pesquisar" 
              bg={searchBarBg} 
              borderRadius="full"
              borderColor="#FFEFDC"
              _placeholder={{ color: '#091106', fontFamily: 'Belezza' }}
              fontFamily="Belezza"
              size="lg" 
              h="50px" 
            />
          </InputGroup>
        </Box>

        {/* ajuste logo */}
        <Flex justify="flex-end" mt={-4} mr={-3}>
          <Image src={Logo} alt="Mapa das Origens Logo" w="220px" />
        </Flex>
      </Flex>

      {/* titulo e botao */}
      <Flex direction="column" align="center" mb={8}>
        <Heading 
          as="h1" 
          size="2xl" 
          fontFamily="Belezza" 
          color={titleColor}
          bg={titleBg} // fundo do titulo
          px={4}
          py={1}
          mb={6} 
          display="inline-block" // para ajustar ao texto
          fontWeight="normal"
        >
          Acervo
        </Heading>

        {/* botao de adicionar no acervo */}
        <Button 
          bg={buttonBg}
          color="white"
          fontFamily="Belezza"
          fontWeight="normal"
          size="lg"
          borderRadius="none"
          border="2px solid"
          borderColor={titleColor} 
          _hover={{ bg: '#12240D', color: 'white' }}
        >
          Adicionar item ao acervo
        </Button>
      </Flex>


      {/* tabela */}
      <TableContainer 
        bg={tableRowLight} 
        borderRadius="none" 
        overflowY="auto" 
        maxH="60vh" 
        border="1px solid"
        borderColor="#FFEFDC"
      >
        <Table variant="simple">
          
          {/* cabeçalho */}
          <Thead bg={tableHeaderBg} position="sticky" top={0}>
            <Tr>
              <Th color="white" fontFamily="Belezza" fontWeight="normal">Nome</Th>
              <Th color="white" fontFamily="Belezza" fontWeight="normal">Povo</Th>
              <Th color="white" fontFamily="Belezza" fontWeight="normal">Tipo de arquivo</Th>
              <Th color="white" fontFamily="Belezza" fontWeight="normal">Fonte/Referência</Th>
              <Th color="white" fontFamily="Belezza" fontWeight="normal">Enviado por</Th>
              <Th color="white" fontFamily="Belezza" fontWeight="normal">Data</Th>
            </Tr>
          </Thead>
          
          {/* corpo da tabela */}
          <Tbody>
            <Tr>
              <Td 
                colSpan={6} 
                textAlign="center" 
                fontFamily="Belezza" 
                color={titleColor}
                py={10} 
                borderColor="#FFEFDC"
              >
                Nenhum item encontrado no acervo.
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Flex> 
  );
}

export default AcervoPage;