//pagina do mapa
import React, { useState, useEffect, useRef, useCallback } from 'react'; 
import { 
  Box, 
  Flex, 
  Image, 
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  Link,
  Divider,
  IconButton,
  List,
  ListItem,
  ListIcon 
} from '@chakra-ui/react';
import {CheckIcon, LockIcon } from '@chakra-ui/icons'; 
import { MapContainer, GeoJSON, Marker, Popup, useMapEvents, Tooltip } from 'react-leaflet'; 
import 'leaflet/dist/leaflet.css'; // css lealeft (mapa)
import Logo from '../assets/mapadasorigens.png'; 
import ParchmentBg from '../assets/Acervo.png'; 
import axios from 'axios'; // para design do mapa

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'

// corrige um bug comum onde os ícones do "pin" não aparecem.
import L from 'leaflet';

// pin customizado (o seu círculo)
const customPinIcon = L.divIcon({
  className: 'custom-pin-icon', 
  iconSize: [20, 20], // o tamanho do ícone
  iconAnchor: [10, 10] // o ponto de âncora (centro)
});

// LISTA DE CIDADES E COORDENADAS
const cidadesFixas = [
  { nome: 'CURITIBA', lat: -25.4297, lng: -49.2711 },
  { nome: 'MARINGÁ', lat: -23.4253, lng: -51.9386 },
  { nome: 'PONTA GROSSA', lat: -25.0945, lng: -50.1633 },
  { nome: 'LONDRINA', lat: -23.3045, lng: -51.1696 },
  { nome: 'CASCAVEL', lat: -24.9555, lng: -53.4552 },
  { nome: 'FOZ DO IGUAÇU', lat: -25.5469, lng: -54.5882 },
  { nome: 'GUARAPUAVA', lat: -25.3934, lng: -51.4563 },
  { nome: 'GUARATUBA', lat: -25.8826, lng: -48.5746 },
  { nome: 'FRANCISCO BELTRÃO', lat: -26.081, lng: -53.0534 },
];
// (Usado como "âncora" para os nomes das cidades, para que não sejam clicáveis)
const invisibleIcon = L.divIcon({
  className: 'invisible-icon',
  iconSize: [0, 0], 
  iconAnchor: [0, 0]
});

function MapPage() {
  const {user, token} = useAuth();
  const navigate = useNavigate();
  
  // Refs para os inputs de arquivo (para o botão bonito)
  const addFileRef = useRef(null);
  const editFileRef = useRef(null);
  
  // coordenadas centrais do Paraná
  const paranaPosition = [-24.65, -51.5515]; // Posição ajustada

  // coordenadas dos limites do Paraná
  const paranaBounds = [
    [-27.0, -55.0], // Ponto sudoeste
    [-22.0, -48.0], // Ponto nordeste 
  ];

  // para guardar os estados do geojson
  const [geoData, setGeoData] = useState(null);

  // estados para os modais
  const { 
    isOpen: isAddOpen, 
    onOpen: onAddOpen, 
    onClose: onAddClose 
  } = useDisclosure();
  const { 
    isOpen: isDetailsOpen, 
    onOpen: onDetailsOpen, 
    onClose: onDetailsClose 
  } = useDisclosure();

  //estado modal para edicao
  const{
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose
  } = useDisclosure();
  
  // useDisclosure PARA O MODAL DE AJUDA
  const { 
    isOpen: isHelpOpen, 
    onOpen: onHelpOpen, 
    onClose: onHelpClose 
  } = useDisclosure();

  const [editNome, setEditNome] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editMidiaFile, setEditMidiaFile] = useState(null); // (arquivo para editar)
  
  // guarda qual pin foi selecionado para mostrar os detalhes
  const [selectedPin, setSelectedPin] = useState(null);

  // estados dos pins e formulário
  const [pins, setPins] = useState([]); 
  const [newPinLocation, setNewPinLocation] = useState(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [midiaFile, setMidiaFile] = useState(null); // o arquivo em si


  // busca o geojson quando o componente carrega
  useEffect(() => {
    const geoJsonUrl = 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-41-mun.json';
    
    axios.get(geoJsonUrl)
      .then((response) => {
        setGeoData(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar o GeoJSON:", error);
      });
  }, []);
  
  // busca os pins salvos no banco quando a página carrega
  useEffect(() => {
    async function fetchPins() {
      try {
        const response = await axios.get('http://localhost:3000/pins');
        const pinsFromDb = response.data;
        const pinsForState = pinsFromDb.map(pin => {
          return {
            id: pin.id,
            latitude: pin.latitude,
            longitude: pin.longitude,
            nome: pin.nome,
            descricao: pin.descricao,
            midiaNome: pin.midia,
            fileUrl: pin.midia ? `http://localhost:3000/files/${pin.midia}` : null,
            fileType: pin.file_type,
            userId: pin.UsuarioId
          };
        });
        setPins(pinsForState);
      } catch (err) {
        console.error("Erro ao buscar os pins:", err);
      }
    }
    fetchPins(); 
  }, []);

  // estilizacao 
  function geoJsonStyle(feature) {
    return {
      fillColor: '#FFEFDC', 
      weight: 1,
      opacity: 1,
      color: '#3A2E39',
      fillOpacity: 1
    };
  }
  // nome aparecer quando passar mouse E "ouvinte" de clique
  function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.name) {
      
      // Verifica se o nome da cidade (feature) está na nossa lista de cidadesFixas
      const isCidadeFixa = cidadesFixas.some(cidade => 
        cidade.nome.toLowerCase() === feature.properties.name.toLowerCase()
      );
      if (!isCidadeFixa) {
        layer.bindTooltip(
          feature.properties.name, 
          {
            sticky: true, 
            className: 'map-label' 
          }
        );
      }
    }
    
    // O "ouvinte" de clique (só na área do Paraná)
    layer.on('click', (e) => {
      L.DomEvent.stopPropagation(e); 
      if (!user) {
      alert("Você precisa estar logado para adicionar pins ao mapa.");
      navigate('/login');
      }else{
        //se logado abre o modal
        setNewPinLocation(e.latlng);
        onAddOpen();
      }
    });
  }  
  // Para centralizar o mapa
  const mapRef = useCallback((map) => {
    if (map) {
      setTimeout(() => {
        map.invalidateSize(); // Força o recalculo do tamanho
        map.setView(paranaPosition, 8); // Força o centro e zoom
      }, 100); 
    }
  }, [paranaPosition]); 
  
  // função para Salvar o Pin
  const handleSavePin = async () => {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('latitude', newPinLocation.lat);
    formData.append('longitude', newPinLocation.lng);
    formData.append('midia', midiaFile);

    try {
      // enviar token de autenticacao
      const response = await axios.post('http://localhost:3000/pins', formData, {
        headers: { 'Content-Type': 'multipart/form-data' 
        , 'Authorization': `Bearer ${token}`
        }
      });

      const newPinFromDB = response.data;

      const newPinForState = {
        id: newPinFromDB.id, 
        latitude: newPinFromDB.latitude,
        longitude: newPinFromDB.longitude,
        nome: newPinFromDB.nome,
        descricao: newPinFromDB.descricao,
        midiaNome: newPinFromDB.midia, 
        fileUrl: newPinFromDB.midia ? `http://localhost:3000/files/${newPinFromDB.midia}` : null,
        fileType: newPinFromDB.file_type,
        userId: newPinFromDB.UsuarioId
      };
    
      setPins([...pins, newPinForState]);
      
      onAddClose(); 
      setNome('');
      setDescricao('');
      setMidiaFile(null);
      setNewPinLocation(null);

    } catch (err) {
      console.error("Erro ao salvar o pin:", err);
      // back envia 401 se nao estiver autorizado
      if (err.response && err.response.status === 401) {
        alert("Sua sessão expirou. Por favor, faça login novamente.");
        navigate('/login');
      }else{
      alert("Não foi possível salvar o pin. Tente novamente.");
      }
    }
  };

  // Funções de Edição
  const handleOpenEditModal = () => {
    if (!selectedPin) return;
    setEditNome(selectedPin.nome);
    setEditDescricao(selectedPin.descricao);
    setEditMidiaFile(null); // Limpa o seletor de arquivo
    onDetailsClose();
    onEditOpen();
  };

  const handleUpdatePin = async () => {
    const idToUpdate = selectedPin.id;
    
    //FormData para enviar o arquivo
    const formData = new FormData();
    formData.append('nome', editNome);
    formData.append('descricao', editDescricao);
    
    // Só adiciona a mídia se o usuário selecionou um NOVO arquivo
    if (editMidiaFile) {
      formData.append('midia', editMidiaFile);
    }

    try {
      // enviar como 'multipart/form-data'
      const response = await axios.put(`http://localhost:3000/pins/${idToUpdate}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const updatedPinFromDB = response.data;
      
      // atualizar o 'setPins' com os dados do arquivo atualizado
      setPins(pins.map(p => {
        if (p.id === idToUpdate) {
          // Retorna o pin antigo misturado com o pin atualizado do DB
          return {
            ...p, // (Mantém lat/lng antigos)
            nome: updatedPinFromDB.nome,
            descricao: updatedPinFromDB.descricao,
            midiaNome: updatedPinFromDB.midia,
            fileUrl: updatedPinFromDB.midia ? `http://localhost:3000/files/${updatedPinFromDB.midia}` : null,
            fileType: updatedPinFromDB.file_type,
            userId: updatedPinFromDB.UsuarioId
          };
        }
        return p;
      }));
      onEditClose();
    } catch (err) {
      console.error("Erro ao atualizar o pin:", err);
      alert("Não foi possível atualizar o pin. Tente novamente.");
    }
  };
  // (DELETE) FUNCAO PARA DELETAR
  const handleDeletePin = async () => {
    const idToDelete = selectedPin.id;     
    const confirmDelete = window.confirm(
    "Tem certeza que deseja deletar este pin? A ação não poderá ser desfeita!"
    );
    if (!confirmDelete) {
      return; 
    }
    
    try {
      await axios.delete(`http://localhost:3000/pins/${idToDelete}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPins(pins.filter(pin => pin.id !== idToDelete));
      onDetailsClose(); 
    } catch (err) {
      console.error("Erro ao deletar o pin:", err);
      alert("Não foi possível deletar o pin. Tente novamente.");
    }
  };

  //função para abrir o modal de detalhes
  const handleOpenDetails = (pin) => {
    setSelectedPin(pin); 
    onDetailsOpen(); 
  };

  return (
    <Flex 
      flex="1"       
      backgroundImage={ParchmentBg}
      backgroundSize="cover"
      backgroundPosition="center"
      direction="column"
      position="relative"
    >
      {/* BOTÃO DE AJUDA */}
      <IconButton
        aria-label="Como usar o mapa"
        icon={<Text fontSize="2xl" fontWeight="bold" fontFamily="Belezza" lineHeight="1">?</Text>}
        position="absolute"
        top="16px"
        left="16px" 
        zIndex={1000} 
        bg="#FFEFDC" 
        color="#000000" 
        fontFamily="Belezza"
        borderRadius="full"
        border="1px solid #000000" 
        boxSize="50px"
        fontSize="2xl"
        _hover={{ bg: '#E9CEAE' }} 
        onClick={onHelpOpen}
      />

      {/* logo */}
      <Flex 
        position="absolute"
        top="16px"
        right="12px"
        zIndex={1000}
      >
        <Image src={Logo} alt="Mapa das Origens Logo" w="220px" />
      </Flex>

      {/* MAPA */}
      <Box
        flex="1"
        h="100vh" 
        w="100%"
        color="gray.600"
        overflow="hidden"
        bg="transparent" 
      >
        <MapContainer 
          center={paranaPosition} 
          zoom={8}
          style={{ 
            height: '100%', 
            width: '100%', 
            backgroundColor: 'transparent' 
          }}
          zoomControl={false}
          maxBounds={paranaBounds}
          minZoom={7}
          maxBoundsViscosity={1.0}
          whenCreated={mapRef} 
        >
          
          {/* fORMATO DO PARANÁ */}
          {geoData && (
            <GeoJSON 
              data={geoData} 
              style={geoJsonStyle}
              onEachFeature={onEachFeature} 
            />
          )}
          
          {/* PINS (que o usuário salvou) */}
          {pins.map(pin => (
            <Marker 
              key={pin.id} 
              position={[pin.latitude, pin.longitude]}
              icon={customPinIcon} 
            >
              <Popup className="pin-popup-simple">
                <Heading size="md" fontFamily="Belezza">{pin.nome}</Heading>
                <Divider my={2} borderColor="#213A14" />
                
                <Text noOfLines={3} mb={2}> 
                  {pin.descricao}
                </Text>
                
                <Link 
                  onClick={() => handleOpenDetails(pin)} 
                  color="#3A5324" 
                  fontSize="md" 
                  fontWeight="bold"
                  cursor="pointer"
                  textDecoration="underline"
                >
                  Saiba mais
                </Link>
              </Popup>
            </Marker>
          ))}
          
          {/*RENDERIZA OS NOMES FIXOS DAS CIDADES*/}
          {cidadesFixas.map(cidade => (
            <Marker
              key={cidade.nome}
              position={[cidade.lat, cidade.lng]}
              icon={invisibleIcon} 
            >
              <Tooltip
                permanent 
                direction="center" 
                offset={[0, 0]}
                className="city-label-marker" 
              >
                {cidade.nome}
              </Tooltip>
            </Marker>
          ))}          
        </MapContainer>
      </Box>

      {/* MODAL ADICIONAR  */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} isCentered>
        <ModalOverlay />
        {/* Título em negrito (default), resto normal */}
        <ModalContent bg="#FFEFDC" color="#000000" fontFamily="Belezza">
          <ModalHeader>Adicionar Novo Pin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Campo Nome */}
            <FormControl mb={4}>
              <FormLabel fontWeight="normal">Nome</FormLabel>
              <Input 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Kaigang, Xetá..."
                bg="#FFEFDC" 
                borderColor="#000000" 
                borderWidth="1px" 
                borderRadius="5px" 
              />
            </FormControl>

            {/* Campo Descrição */}
            <FormControl mb={4}>
              <FormLabel fontWeight="normal">Descrição</FormLabel>
              <Textarea 
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva a história ou o povo deste local..."
                bg="#FFEFDC" 
                borderColor="#000000" 
                borderWidth="1px" 
                borderRadius="5px" 
              />
            </FormControl>

            {/* Campo Mídia */}
            <FormControl>
              <FormLabel fontWeight="normal">Mídia (PDF, JPEG, etc.)</FormLabel>
              <Input 
                type="file"
                ref={addFileRef}
                onChange={(e) => setMidiaFile(e.target.files[0])}
                accept="image/png, image/jpeg, application/pdf"
                style={{ display: 'none' }}
              />
              <Flex align="center">
                <Button 
                  onClick={() => addFileRef.current.click()}
                  bg="#E9CEAE" 
                  color="#000000"
                  borderRadius="full" 
                  border="none" 
                  fontWeight="normal"
                  _hover={{ bg: '#DBC0A0' }} 
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
              bg="#3A5324" 
              color="white"
              borderRadius="full" 
              border="none"
              mr={3} 
              onClick={handleSavePin}
              _hover={{ bg: '#213A14' }} 
              fontWeight="normal"
            >
              Salvar
            </Button>
            <Button 
              variant="outline" 
              onClick={onAddClose}
              borderColor="#3A5324" 
              color="#3A5324"
              borderRadius="full" 
              _hover={{ bg: '#213A14', color: 'white' }}
              fontWeight="normal"
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* MODAL SAIBA MAIS */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} isCentered>
        <ModalOverlay />
        {selectedPin && (
          // Título em negrito (default), resto normal
          <ModalContent bg="#FFEFDC" color="#000000" fontFamily="Belezza">
            <ModalHeader>{selectedPin.nome}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Divider mb={4} borderColor="#091106" /> 
              
              <Text>{selectedPin.descricao}</Text>             
              
              {/* Divisor */}
              {selectedPin.fileUrl && (
                <Divider my={4} borderColor="#091106" /> 
              )}

              {selectedPin.fileUrl && ( 
                <Box mt={4} p={0} bg="#FFEFDC"> 
                  <Text mb={2} fontWeight="normal">Mídia Anexada:</Text> {/* Sem negrito */}                
                  {selectedPin.fileType && selectedPin.fileType.startsWith('image/') && (
                    <Image src={selectedPin.fileUrl} alt={selectedPin.nome} maxH="300px" borderRadius="md" />
                  )}
                  {selectedPin.fileType === 'application/pdf' && (
                    <iframe 
                      src={selectedPin.fileUrl} 
                      width="100%" 
                      height="400px" 
                      title="preview-pdf"
                    />
                  )}
                  {selectedPin.fileType && !selectedPin.fileType.startsWith('image/') && selectedPin.fileType !== 'application/pdf' && (
                    <Text>{selectedPin.midiaNome}</Text>
                  )}
                </Box>
              )}
            </ModalBody>

            <ModalFooter display="flex" justifyContent="space-between">
              <Box>
                {user && user.id === selectedPin.userId && (
                  <>
                    <Button
                      colorScheme="red"
                      mr={3}
                      onClick={handleDeletePin}
                      borderRadius="full"
                      border="none"
                      fontWeight="normal"
                      _hover={{ bg: '#a31f1f' }}
                    >
                      Deletar
                    </Button>

                    {/* botao editar */}
                    <Button
                      variant="outline"
                      borderColor="#3A5324"
                      borderRadius="full"
                      color="#3A5324"
                      _hover={{ bg: '#213A14', color: 'white' }}
                      onClick={handleOpenEditModal}
                      fontWeight="normal"
                    >
                      Editar
                    </Button>
                  </>
                )}
              </Box>

              <Button
                variant="outline"
                onClick={onDetailsClose}
                color="#3A5324"
                _hover={{ bg: '#213A14', color: 'white' }}
                borderRadius="full"
                borderColor="#3A5324"
                fontWeight="normal"
              >
                Fechar
              </Button>

            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
      
      {/* MODAL EDITAR*/}
      <Modal isOpen={isEditOpen} onClose={onEditClose} isCentered>
        <ModalOverlay />
        {/* Título em negrito (default), resto normal */}
        <ModalContent bg="#FFEFDC" color="#000000" fontFamily="Belezza">
          <ModalHeader>Editar Pin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
            {/* Campo Nome (para editar) */}
            <FormControl mb={4}>
              <FormLabel fontWeight="normal">Nome</FormLabel>
              <Input 
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
                bg="#FFEFDC" 
                borderColor="#000000" 
                borderWidth="1px" 
                borderRadius="5px" 
              />
            </FormControl>

            {/* Campo Descrição (para editar) */}
            <FormControl mb={4}>
              <FormLabel fontWeight="normal">Descrição</FormLabel>
              <Textarea 
                value={editDescricao}
                onChange={(e) => setEditDescricao(e.target.value)}
                bg="#FFEFDC" 
                borderColor="#000000" 
                borderWidth="1px" 
                borderRadius="5px" 
              />
            </FormControl>
            
            {/* campo para midia*/}
            <FormControl>
              <FormLabel fontWeight="normal">Mídia (Opcional: Substitua o arquivo atual)</FormLabel>
              <Input 
                type="file"
                ref={editFileRef}
                onChange={(e) => setEditMidiaFile(e.target.files[0])}
                accept="image/png, image/jpeg, application/pdf"
                style={{ display: 'none' }}
              />
              <Flex align="center">
                <Button 
                  onClick={() => editFileRef.current.click()}
                  bg="#E9CEAE" 
                  color="#000000"
                  borderRadius="full" 
                  border="none" 
                  fontWeight="normal"
                  _hover={{ bg: '#DBC0A0' }} 
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
              bg="#3A5324" 
              color="white"
              borderRadius="full" 
              border="none"
              mr={3} 
              onClick={handleUpdatePin}
              _hover={{ bg: '#213A14' }} 
              fontWeight="normal"
            >
              Salvar Mudanças
            </Button>
            <Button 
              variant="outline" 
              onClick={onEditClose}
              borderColor="#3A5324" 
              color="#3A5324"
              borderRadius="full" 
              _hover={{ bg: '#213A14', color: 'white' }}
              fontWeight="normal"
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* MODAL DE AJUDA*/}
      <Modal isOpen={isHelpOpen} onClose={onHelpClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="#FFEFDC" color="#000000" fontFamily="Belezza">
          <ModalHeader fontWeight="bold">Como Usar o Mapa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4} fontWeight="normal">Para interagir com o mapa, siga os passos:</Text>
            <List spacing={3} fontWeight="normal">
              <ListItem>
                <ListIcon as={CheckIcon} color="#3A5324" />
                <Text as="b" display="inline">Adicionar um Pin:</Text> Clique em qualquer cidade (dentro do contorno do Paraná) para abrir o formulário.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckIcon} color="#3A5324" />
                <Text as="b" display="inline">Ver Detalhes:</Text> Clique em um pin (círculo verde) que já está no mapa.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckIcon} color="#3A5324" />
                <Text as="b" display="inline">Editar/Deletar:</Text> Na opção de "Saiba mais", use os botões "Editar" ou "Deletar".
              </ListItem>
              <ListItem>
                <ListIcon as={CheckIcon} color="#3A5324" />
                <Text as="b" display="inline">Navegar:</Text> Clique e arraste para mover o mapa. Use o scroll do mouse para dar zoom.
              </ListItem>
              <ListItem>
                <ListIcon as={LockIcon} color="#3A5324" />
                <Text as="b" display="inline">Permissões:</Text> Você precisa estar logado para adicionar, editar ou deletar pins. Você só pode editar ou deletar os pins que você mesmo criou.
              </ListItem>
            </List>
          </ModalBody>
          <ModalFooter>
            <Button 
              variant="outline" 
              onClick={onHelpClose}
              borderColor="#3A5324" 
              color="#3A5324"
              borderRadius="full" 
              _hover={{ bg: '#213A14', color: 'white' }}
              fontWeight="normal"
            >
              Entendi!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Flex>
  );
}
export default MapPage;