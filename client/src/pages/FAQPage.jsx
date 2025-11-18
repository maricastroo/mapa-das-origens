// pagina do faq
import React from 'react';
import {
  Flex,
  Box,
  Image,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button, 
} from '@chakra-ui/react';

import Logo from '../assets/origens.png'; 
import ParchmentBg from '../assets/Acervo.png'; 

function FAQPage() {
  // CORES
  const titleColor = "#091106";
  const accordionBorder = "#091106"; 
  const accordionHover = "#E9CEAE";  
  const buttonBg = "#3A5324";
  const buttonHoverBg = "#213A14";

  // LISTAS PERGUNTAS
  const faqs = [
    {
      question: "Como faço para adicionar um pin no mapa?",
      answer: "Você precisa estar logado. Navegue até a página 'Mapa', clique em qualquer lugar dentro do território do Paraná e preencha o formulário com nome, descrição e mídia."
    },
    {
      question: "Quem pode ver as informações que eu posto?",
      answer: "Todos os visitantes do site (logados ou não) podem ver os pins no mapa e os itens do acervo. No entanto, apenas você pode editar ou excluir o que criou."
    },
    {
      question: "Posso enviar vídeos para o acervo?",
      answer: "Sim! O sistema aceita imagens (PNG, JPEG), documentos PDF, vídeos (MP4) e áudios."
    },
    {
      question: "Como edito um item que enviei errado?",
      answer: "Vá até o item (no Mapa ou na tabela do Acervo), clique no nome para ver os detalhes. Se você for o autor, verá um botão 'Editar' no rodapé da janela."
    },
    {
      question: "O que é o Mapa das Origens?",
      answer: "É um projeto dedicado a resgatar, mapear e preservar a história e cultura dos povos originários do Paraná através de um acervo digital colaborativo."
    }
  ];

  return (
    <Flex 
      flex="1" 
      pt={20}
      pb={8}
      px={8}
      backgroundImage={ParchmentBg}
      backgroundSize="cover"
      backgroundPosition="center"
      direction="column"
      fontFamily="Belezza" 
      color={titleColor}
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

      {/* TITULO*/}
      <Flex direction="column" align="center" mb={8}>
        <Heading 
          as="h1" 
          size="2xl" 
          textAlign="center"
          fontWeight="normal" 
          fontFamily="Belezza"
        >
          Dúvidas Frequentes
        </Heading>
      </Flex>

      {/*PERGUNTAS*/}
      <Box w={{ base: '100%', md: '80%' }} mx="auto">
        <Accordion allowToggle>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} borderTop="none" borderBottom={`1px solid ${accordionBorder}`} mb={4}>
              <h2>
                <AccordionButton 
                  _hover={{ bg: accordionHover }} 
                  py={4}
                  px={4}
                  borderRadius="md"
                >
                  <Box flex="1" textAlign="center" fontSize="xl" fontWeight="bold">
                    {faq.question}
                  </Box>
                  <AccordionIcon color={titleColor} />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} fontSize="lg" bg="rgba(255,255,255,0.3)" borderRadius="md" textAlign="center">
                {faq.answer}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>

      {/* Seção Fale Conosco */}
      <Flex direction="column" align="center" mt={8} mb={4}>
        <Text fontSize="lg" fontFamily="Belezza" mb={2}>
          Ainda precisa de ajuda?
        </Text>
        <Button
          as="a"
          href="mailto:suporte@mapadasorigens.com.br" 
          bg={buttonBg} 
          color="white" 
          borderRadius="full"
          border="none"
          fontWeight="normal"
          fontFamily="Belezza"
          _hover={{ bg: buttonHoverBg }}
          px={10}
          py={6}
        >
          Fale Conosco
        </Button>
      </Flex>

    </Flex> 
  );
}

export default FAQPage;