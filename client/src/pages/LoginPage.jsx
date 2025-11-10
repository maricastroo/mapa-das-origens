// pagina para o login

import React from 'react';
import { Flex, Heading, Text } from '@chakra-ui/react';
import ParchmentBg from '../assets/Acervo.png'; 

function LoginPage() {
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
      minH="100vh"
      backgroundImage={ParchmentBg}
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Heading fontFamily="Belezza">
        Página de Login
      </Heading>
      <Text>(Calma mlk ja vai ser feita)</Text>
    </Flex>
  );
}

export default LoginPage;