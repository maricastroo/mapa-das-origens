//pagina do mapa
import React, { useState, useEffect } from 'react';
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
  Divider 
} from '@chakra-ui/react';
import { MapContainer, GeoJSON, Marker, Popup, useMapEvents, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // css lealeft (mapa)
import Logo from '../assets/mapadasorigens.png'; 
import ParchmentBg from '../assets/Acervo.png'; 
import axios from 'axios'; // para design do mapa

// corrige um bug comum onde os ícones do "pin" não aparecem.
import L from 'leaflet';

// pin customizado
const customPinIcon = L.divIcon({
  className: 'custom-pin-icon', 
  iconSize: [20, 20], // o tamanho do ícone
  iconAnchor: [10, 10] // o ponto de âncora (centro)
});

function MapPage() {
  
  // coordenadas centrais do Paraná
  const paranaPosition = [-24.8919, -51.5515];

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
            fileType: pin.file_type 
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

  // nome aparecer quando passar mouse
  function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.name) {
      layer.bindTooltip(
        feature.properties.name, 
        {
          sticky: true, 
          className: 'map-label' 
        }
      );
    }
  }

  // "ouvinte" de cliques no mapa
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setNewPinLocation(e.latlng);
        onAddOpen(); // abre o modal de adicionar
      },
    });
    return null; 
  }
  
  // função para Salvar o Pin
  const handleSavePin = async () => {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('latitude', newPinLocation.lat);
    formData.append('longitude', newPinLocation.lng);
    formData.append('midia', midiaFile);

    try {
      const response = await axios.post('http://localhost:3000/pins', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
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
        fileType: newPinFromDB.file_type 
      };
    
      setPins([...pins, newPinForState]);
      
      onAddClose(); 
      setNome('');
      setDescricao('');
      setMidiaFile(null);
      setNewPinLocation(null);

    } catch (err) {
      console.error("Erro ao salvar o pin:", err);
      alert("Não foi possível salvar o pin. Tente novamente.");
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
          'Content-Type': 'multipart/form-data'
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
            fileType: updatedPinFromDB.file_type
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
      await axios.delete(`http://localhost:3000/pins/${idToDelete}`);
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
        minH="100vh" 
        color="gray.600"
        overflow="hidden"
        bg="transparent" 
      >
        <MapContainer 
          center={paranaPosition} 
          zoom={7}
          style={{ 
            height: '100%', 
            width: '100%', 
            minHeight: '100vh', 
            backgroundColor: 'transparent' 
          }}
          zoomControl={false}
          maxBounds={paranaBounds}
          minZoom={7}
          maxBoundsViscosity={1.0}
        >
          
          {/* fORMATO DO PARANÁ */}
          {geoData && (
            <GeoJSON 
              data={geoData} 
              style={geoJsonStyle}
              onEachFeature={onEachFeature} 
            />
          )}

          {/* "OUVINTE" DE CLIQUES */}
          <MapClickHandler />
          
          {/* PINS (que o usuário salvou) */}
          {pins.map(pin => (
            <Marker 
              key={pin.id} 
              position={[pin.latitude, pin.longitude]}
              icon={customPinIcon} // usa o ícone customizado
            >
              <Popup className="pin-popup-simple">
                <Heading size="md" fontFamily="serif">{pin.nome}</Heading>
                <Divider my={2} borderColor="#3A2E39" />
                
                <Text noOfLines={3} mb={2}> 
                  {pin.descricao}
                </Text>
                
                <Link 
                  onClick={() => handleOpenDetails(pin)} // chama o modal
                  color="#12240D" 
                  fontWeight="bold"
                  cursor="pointer"
                  textDecoration="underline"
                >
                  Saiba mais
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>

      {/* modal para adicionar pin*/}
      <Modal isOpen={isAddOpen} onClose={onAddClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="#FFEFDC" color="#3A2E39" fontFamily="serif">
          <ModalHeader>Adicionar Novo Pin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Campo Nome */}
            <FormControl mb={4}>
              <FormLabel>Nome</FormLabel>
              <Input 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Kaigang, Xetá..."
                bg="white"
                borderColor="#C0B8AD"
              />
            </FormControl>

            {/* Campo Descrição */}
            <FormControl mb={4}>
              <FormLabel>Descrição</FormLabel>
              <Textarea 
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva a história ou o povo deste local..."
                bg="white"
                borderColor="#C0B8AD"
              />
            </FormControl>

            {/* Campo Mídia */}
            <FormControl>
              <FormLabel>Mídia (PDF, JPEG, etc.)</FormLabel>
              <Input 
                type="file"
                onChange={(e) => setMidiaFile(e.target.files[0])}
                bg="white"
                borderColor="#C0B8AD"
                p={1.5}
                accept="image/png, image/jpeg, application/pdf"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button 
              bg="#5D7541" 
              color="white"
              borderRadius="none"
              border="2px solid #091106"
              mr={3} 
              onClick={handleSavePin}
              _hover={{ bg: '#12240D' }}
            >
              Salvar
            </Button>
            <Button variant="ghost" onClick={onAddClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* modal saiba mais */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} isCentered>
        <ModalOverlay />
        {selectedPin && (
          <ModalContent bg="#FFEFDC" color="#000000" fontFamily="serif">
            <ModalHeader>{selectedPin.nome}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Divider mb={4} borderColor="#12240D" />
              <Text>{selectedPin.descricao}</Text>             
              {selectedPin.fileUrl && ( 
                <Box mt={4} p={3} bg="whiteAlpha.700" borderRadius="md">
                  <Text fontWeight="bold" mb={2}>Mídia Anexada:</Text>                  
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
                <Button 
                  colorScheme="red" 
                  mr={3} 
                  onClick={handleDeletePin}
                  borderRadius="none"
                  border="2px solid #12240D"
                  _hover={{ bg: '#a31f1f' }}
                >
                  Deletar
                </Button>
                
                {/* botao editar */}
                <Button 
                  variant="outline" 
                  borderColor="#12240D"
                  borderRadius="none"
                  _hover={{ bg: '#5D7541'}}
                  onClick={handleOpenEditModal}
                >
                  Editar
                </Button>
              </Box>

              <Button variant="ghost" onClick={onDetailsClose}>
                Fechar
              </Button>

            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
      
      {/* modal para editar pin */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="#FFEFDC" color="#3A2E39" fontFamily="serif">
          <ModalHeader>Editar Pin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
            {/* Campo Nome (para editar) */}
            <FormControl mb={4}>
              <FormLabel>Nome</FormLabel>
              <Input 
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
                bg="white"
                borderColor="#C0B8AD"
              />
            </FormControl>

            {/* Campo Descrição (para editar) */}
            <FormControl mb={4}>
              <FormLabel>Descrição</FormLabel>
              <Textarea 
                value={editDescricao}
                onChange={(e) => setEditDescricao(e.target.value)}
                bg="white"
                borderColor="#C0B8AD"
              />
            </FormControl>
            
            {/* campo para midia*/}
            <FormControl>
              <FormLabel>Mídia (Opcional: Substitua o arquivo atual)</FormLabel>
              <Input 
                type="file"
                onChange={(e) => setEditMidiaFile(e.target.files[0])}
                bg="white"
                borderColor="#C0B8AD"
                p={1.5}
                accept="image/png, image/jpeg, application/pdf"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button 
              bg="#5D7541" // Verde
              color="white"
              borderRadius="none"
              border="2px solid #091106"
              mr={3} 
              onClick={handleUpdatePin}
              _hover={{ bg: '#12240D' }}
            >
              Salvar Mudanças
            </Button>
            <Button variant="ghost" onClick={onEditClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
export default MapPage;