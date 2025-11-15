// aqui a pagina do acervo com CRUD completo
import React, { useState, useEffect, useRef } from 'react';
import {
  Flex,
  Box,
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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Divider,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Logo from '../assets/origens.png'; 
import ParchmentBg from '../assets/Acervo.png'; 
import { useAuth } from '../context/AuthContext'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AcervoPage() {
  const { user, token } = useAuth(); // Pega o usuário e o token
  const navigate = useNavigate();

  const [acervoItems, setAcervoItems] = useState([]); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [nome, setNome] = useState('');
  const [povo, setPovo] = useState('');
  const [fonte, setFonte] = useState('');
  const [midiaFile, setMidiaFile] = useState(null);
  const addFileRef = useRef(null);
  const [editNome, setEditNome] = useState('');
  const [editPovo, setEditPovo] = useState('');
  const [editFonte, setEditFonte] = useState('');
  const [editMidiaFile, setEditMidiaFile] = useState(null);
  const editFileRef = useRef(null);
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const searchBarBg = "#FFEFDC"; 
  const tableHeaderBg = "#5D7541"; 
  const tableRowLight = "#E9CEAE";
  const titleColor = "#091106";
  const buttonBg = "#3A5324";
  const buttonHoverBg = "#213A14";
  const inputBorder = "#C0B8AD"; 

  // buscar 
  const fetchAcervoItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/acervo');
      const itemsFromDb = response.data;
      const itemsForState = itemsFromDb.map(item => {
        return {
          id: item.id,
          nome: item.nome,
          povo: item.povo,
          fonte: item.fonte,
          midiaNome: item.midia,
          fileUrl: item.midia ? `http://localhost:3000/files/${item.midia}` : null,
          fileType: item.tipo_arquivo,
          UsuarioId: item.UsuarioId,
          usuario: item.usuario,
          createdAt: item.createdAt,
        };
      });
      setAcervoItems(itemsForState);
    } catch (err) {
      console.error("Erro ao buscar itens do acervo:", err);
    }
  };

  useEffect(() => {
    fetchAcervoItems(); 
  }, []); 

  // adicionar
  const handleAddItem = async () => {
    if (!nome || !povo || !fonte || !midiaFile) {
      alert("Por favor, preencha todos os campos e selecione uma mídia.");
      return;
    }
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('povo', povo);
    formData.append('fonte', fonte);
    formData.append('midia', midiaFile);
    try {
      await axios.post('http://localhost:3000/acervo', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        }
      });
      fetchAcervoItems(); 
      onAddClose(); 
      setNome(''); setPovo(''); setFonte(''); setMidiaFile(null);
    } catch (err) {
      console.error("Erro ao salvar item:", err);
      if (err.response && err.response.status === 401) {
        alert("Sua sessão expirou. Faça login novamente.");
        navigate('/login');
      } else {
        alert("Erro ao salvar item.");
      }
    }
  };

  // atualizar
  const handleUpdateItem = async () => {
    const idToUpdate = selectedItem.id;
    const formData = new FormData();
    formData.append('nome', editNome);
    formData.append('povo', editPovo);
    formData.append('fonte', editFonte);
    if (editMidiaFile) {
      formData.append('midia', editMidiaFile);
    }
    try {
      const response = await axios.put(`http://localhost:3000/acervo/${idToUpdate}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      const updatedItemFromDB = response.data;
      setAcervoItems(acervoItems.map(p => {
        if (p.id === idToUpdate) {
          return {
            ...p,
            nome: updatedItemFromDB.nome,
            povo: updatedItemFromDB.povo,
            fonte: updatedItemFromDB.fonte,
            midiaNome: updatedItemFromDB.midia,
            fileUrl: updatedItemFromDB.midia ? `http://localhost:3000/files/${updatedItemFromDB.midia}` : null,
            fileType: updatedItemFromDB.tipo_arquivo,
            UsuarioId: updatedItemFromDB.UsuarioId
          };
        }
        return p;
      }));
      onEditClose(); 
    } catch (err) {
      console.error("Erro ao atualizar item:", err);
      alert("Erro ao atualizar item.");
    }
  };

  // deletar
  const handleDeleteItem = async () => {
    const idToDelete = selectedItem.id;
    if (!window.confirm("Tem certeza que deseja deletar este item?")) return;

    try {
      await axios.delete(`http://localhost:3000/acervo/${idToDelete}`, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        } 
      });
      
      fetchAcervoItems(); // atualiza a tabela
      onDetailsClose(); // fecha o modal de detalhes
    } catch (err) {
      console.error("Erro ao deletar item:", err);
      alert("Erro ao deletar item.");
    }
  };

  // funções de ajuda dos modals
  const handleOpenDetails = (item) => {
    setSelectedItem(item);
    onDetailsOpen();
  };

  const handleOpenEdit = () => {
    setEditNome(selectedItem.nome);
    setEditPovo(selectedItem.povo);
    setEditFonte(selectedItem.fonte);
    setEditMidiaFile(null); // limpa o seletor de arquivo
    onDetailsClose();
    onEditOpen();
  };


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
      fontFamily="Belezza" 
      color={titleColor}   
    >
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
              borderColor={inputBorder} 
              _placeholder={{ color: '#091106' }} 
              size="lg" 
              h="50px" 
              fontFamily="Belezza" 
            />
          </InputGroup>
        </Box>
        <Flex justify="flex-end" mt={-8} mr={-3}>
          <Image src={Logo} alt="Mapa das Origens Logo" w="220px" />
        </Flex>
      </Flex>
      <Flex direction="column" align="center" mb={6}>
        <Heading 
          as="h1" 
          size="2xl" 
          textAlign="center"
          fontWeight="normal" 
          fontFamily="Belezza"
        >
          Acervo
        </Heading>
      </Flex>
      <Flex justify="flex-end" mb={4}>
        {user && ( 
          <Button 
            bg={buttonBg}
            color="white"
            fontWeight="normal"
            size="lg"
            borderRadius="full" 
            border="none" 
            _hover={{ bg: buttonHoverBg }}
            py={6}
            fontFamily="Belezza"
            onClick={onAddOpen} 
          >
            Adicionar item ao acervo
          </Button>
        )}
      </Flex>


      {/* tabela */}
      <TableContainer 
        bg={tableRowLight} 
        borderRadius="md" 
        overflowY="auto" 
        maxH="60vh" 
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
            {acervoItems.length === 0 ? (
              <Tr>
                <Td 
                  colSpan={6} 
                  textAlign="center" 
                  color={titleColor}
                  py={10} 
                  borderColor="#FFEFDC"
                >
                  Nenhum item encontrado no acervo.
                </Td>
              </Tr>
            ) : (
              // preenche a tabela com os dados
              acervoItems.map((item, index) => (
                <Tr key={item.id}>
                  
                  {/* para abrir modal saiva mais */}
                  <Td borderColor="#FFEFDC">
                    <Button
                      variant="link"
                      textDecoration="underline" 
                      cursor="pointer"
                      onClick={() => handleOpenDetails(item)} 
                      fontFamily="Belezza" 
                      fontWeight="normal" 
                      color={titleColor} 
                      _hover={{ color: buttonBg }} 
                      textAlign="left" 
                      whiteSpace="normal" 
                    >
                      {item.nome}
                    </Button>
                  </Td>

                  <Td borderColor="#FFEFDC">{item.povo}</Td>
                  
                  {/* abre em nova aba */}
                  <Td borderColor="#FFEFDC">
                    {item.fileUrl ? (
                      <Link 
                        href={item.fileUrl}
                        isExternal
                        textDecoration="underline" 
                        cursor="pointer"
                      >
                        {item.fileType}
                      </Link>
                    ) : (
                      <Text>{item.fileType}</Text>
                    )}
                  </Td>

                  <Td borderColor="#FFEFDC">{item.fonte}</Td>
                  
                  <Td borderColor="#FFEFDC">{item.usuario?.username || 'N/A'}</Td> 
                  
                  <Td borderColor="#FFEFDC">{new Date(item.createdAt).toLocaleDateString()}</Td> 
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
      
      {/* MODAL ADICIONAR ITEM */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="#FFEFDC" color="#000000" fontFamily="Belezza">
          <ModalHeader>Adicionar Item ao Acervo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel fontWeight="normal">Nome</FormLabel>
              <Input 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                bg="#FFEFDC" borderColor="#000000" borderWidth="1px" borderRadius="5px" 
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="normal">Povo(s)</FormLabel>
              <Input 
                value={povo}
                onChange={(e) => setPovo(e.target.value)}
                placeholder="Ex: Kaingang, Xetá"
                bg="#FFEFDC" borderColor="#000000" borderWidth="1px" borderRadius="5px" 
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="normal">Fonte/Referência</FormLabel>
              <Textarea 
                value={fonte}
                onChange={(e) => setFonte(e.target.value)}
                bg="#FFEFDC" borderColor="#000000" borderWidth="1px" borderRadius="5px" 
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="normal">Mídia (PDF, JPEG, MP4, etc.)</FormLabel>
              <Input 
                type="file"
                ref={addFileRef}
                onChange={(e) => setMidiaFile(e.target.files[0])}
                accept="image/png, image/jpeg, application/pdf, video/mp4, video/quicktime, audio/mpeg, audio/wav"
                style={{ display: 'none' }}
              />
              <Flex align="center">
                <Button 
                  onClick={() => addFileRef.current.click()}
                  bg="#E9CEAE" color="#000000" borderRadius="full" border="none" 
                  fontWeight="normal" _hover={{ bg: '#DBC0A0' }} 
                >
                  Escolher Arquivo
                </Button>
                <Text ml={3} noOfLines={1} color={midiaFile ? "#000000" : "gray.600"} fontSize="sm">
                  {midiaFile ? midiaFile.name : "Nenhum arquivo selecionado"}
                </Text>
              </Flex>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button 
              bg={buttonBg} color="white" borderRadius="full" border="none"
              mr={3} onClick={handleAddItem} _hover={{ bg: buttonHoverBg }} fontWeight="normal"
            >
              Salvar
            </Button>
            <Button 
              variant="outline" onClick={onAddClose} borderColor={buttonBg} color={buttonBg}
              borderRadius="full" _hover={{ bg: buttonHoverBg, color: 'white' }} fontWeight="normal"
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* MODAL DETALHES (SAIBA MAIS) */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} isCentered>
        <ModalOverlay />
        {selectedItem && (
          <ModalContent bg="#FFEFDC" color="#000000" fontFamily="Belezza">
            <ModalHeader>{selectedItem.nome}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Divider mb={4} borderColor="#091106" /> 
              <Text><strong>Povo:</strong> {selectedItem.povo}</Text>
              <Text><strong>Fonte:</strong> {selectedItem.fonte}</Text>
              <Text><strong>Enviado por:</strong> {selectedItem.usuario?.username || 'N/A'}</Text>
              
              {selectedItem.fileUrl && (
                <Divider my={4} borderColor="#091106" /> 
              )}

              {/* visualizador de midia */}
              {selectedItem.fileUrl && ( 
                <Box mt={4} p={0} bg="#FFEFDC"> 
                  <Text mb={2} fontWeight="normal">Mídia Anexada:</Text>                
                  {selectedItem.fileType && selectedItem.fileType.startsWith('image/') && (
                    <Image src={selectedItem.fileUrl} alt={selectedItem.nome} maxH="300px" borderRadius="md" />
                  )}
                  {selectedItem.fileType === 'application/pdf' && (
                    <iframe 
                      src={selectedItem.fileUrl} 
                      width="100%" 
                      height="400px" 
                      title="preview-pdf"
                    />
                  )}
                  {selectedItem.fileType && selectedItem.fileType.startsWith('video/') && (
                    <video controls width="100%">
                      <source src={selectedItem.fileUrl} type={selectedItem.fileType} />
                      Seu navegador não suporta este vídeo.
                    </video>
                  )}
                </Box>
              )}
            </ModalBody>

            <ModalFooter display="flex" justifyContent="space-between">
              <Box>
                {/* edicao/delete protegidos */}
                {user && selectedItem && user.id === selectedItem.UsuarioId && (
                  <>
                    <Button 
                      colorScheme="red" mr={3} onClick={handleDeleteItem}
                      borderRadius="full" border="none" fontWeight="normal"
                      _hover={{ bg: '#a31f1f' }} 
                    >
                      Deletar
                    </Button>
                    <Button 
                      variant="outline" borderColor={buttonBg} borderRadius="full" color={buttonBg}
                      _hover={{ bg: buttonHoverBg, color: 'white' }} onClick={handleOpenEdit}
                      fontWeight="normal"
                    >
                      Editar
                    </Button>
                  </>
                )}
              </Box>
              <Button 
                variant="outline" onClick={onDetailsClose} color={buttonBg}
                _hover={{ bg: buttonHoverBg, color: 'white' }} 
                borderRadius="full" borderColor={buttonBg} fontWeight="normal"
              >
                Fechar
              </Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
      
      {/* MODAL EDITAR ITEM */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="#FFEFDC" color="#000000" fontFamily="Belezza">
          <ModalHeader>Editar Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel fontWeight="normal">Nome</FormLabel>
              <Input 
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
                bg="#FFEFDC" borderColor="#000000" borderWidth="1px" borderRadius="5px" 
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="normal">Povo(s)</FormLabel>
              <Input 
                value={editPovo}
                onChange={(e) => setEditPovo(e.target.value)}
                bg="#FFEFDC" borderColor="#000000" borderWidth="1px" borderRadius="5px" 
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight="normal">Fonte/Referência</FormLabel>
              <Textarea 
                value={editFonte}
                onChange={(e) => setEditFonte(e.target.value)}
                bg="#FFEFDC" borderColor="#000000" borderWidth="1px" borderRadius="5px" 
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="normal">Mídia (Opcional: Substitua o arquivo)</FormLabel>
              <Input 
                type="file"
                ref={editFileRef}
                onChange={(e) => setEditMidiaFile(e.target.files[0])}
                accept="image/png, image/jpeg, application/pdf, video/mp4, video/quicktime, audio/mpeg, audio/wav"
                style={{ display: 'none' }}
              />
              <Flex align="center">
                <Button 
                  onClick={() => editFileRef.current.click()}
                  bg="#E9CEAE" color="#000000" borderRadius="full" border="none" 
                  fontWeight="normal" _hover={{ bg: '#DBC0A0' }} 
                >
                  Escolher Arquivo
                </Button> 
                <Text ml={3} noOfLines={1} color={editMidiaFile ? "#000000" : "gray.600"} fontSize="sm">
                  {editMidiaFile ? editMidiaFile.name : "Nenhum arquivo (manterá o antigo)"}
                </Text>
              </Flex>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button 
              bg={buttonBg} color="white" borderRadius="full" border="none"
              mr={3} onClick={handleUpdateItem} _hover={{ bg: buttonHoverBg }} fontWeight="normal"
            >
              Salvar Mudanças
            </Button>
            <Button 
              variant="outline" onClick={onEditClose} borderColor={buttonBg} color={buttonBg}
              borderRadius="full" _hover={{ bg: buttonHoverBg, color: 'white' }} fontWeight="normal"
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Flex> 
  );
}

export default AcervoPage;