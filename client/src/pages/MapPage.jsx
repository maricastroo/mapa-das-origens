// src/pages/MapPage.jsx
import React from 'react';
import { Box, Flex, Image, Text } from '@chakra-ui/react';


import Logo from '../assets/origens.png'; 
import ParchmentBg from '../assets/Acervo.png'; 

function MapPage() {
  return (
    <Flex 
      flex="1" 
      pt={4} // paddin-top
      pb={8} // padding-bottom
      px={8} // padding-left e right
      
      //imagem do fundo
      backgroundImage={ParchmentBg}
      backgroundSize="cover"
      backgroundPosition="center"
     
      
      direction="column"
    >
      {/* logo */}
      <Flex 
        justify="flex-end" 
        mb={4}
        mt={-4} //pra cima
        mr={-3} //pro lado
      >
        <Image src={Logo} alt="Mapa das Origens Logo" w="220px" />
      </Flex>

      {/* mapa */}
      <Box
        flex="1"
        bg="#FFEFDC" // aqui é pq por enquano nao temos o mapa
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="60vh"
        color="gray.600"
        // adicionar o mapa aqui :)
      >
        <Text fontSize="2xl" fontWeight="Belezza" bg="whiteAlpha.700" p={4} borderRadius="md">
          (mapa akirrrr)
        </Text>
      </Box>      
    </Flex>
  );
}

export default MapPage;