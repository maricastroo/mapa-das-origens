// src/pages/MapPage.jsx
import React from 'react';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
//Imports do Mapa 
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // css lealeft (mapa)
import Logo from '../assets/mapadasorigens.png'; 
import ParchmentBg from '../assets/Acervo.png'; 

// corrige um bug comum onde os ícones do "pin" não aparecem.
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;



function MapPage() {
  
  // coordenadas centrais do Paraná
  const paranaPosition = [-24.8919, -51.5515];

  // coordenadas dos limites do Paraná
  const paranaBounds = [
    [-27.0, -55.0], // Ponto Sudoeste (SW)
    [-22.0, -48.0], // Ponto Nordeste (NE)
  ];


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

      {/* MAPA */}
      <Box
        flex="1"
        borderRadius="md" 
        minH="60vh" 
        color="gray.600"
        overflow="hidden"
      >
        <MapContainer 
          center={paranaPosition} // centraliza no Paraná
          zoom={7} //zoom para mostrar o estado
          style={{ height: '100%', width: '100%', minHeight: '60vh' }}
          
          maxBounds={paranaBounds} //limites do mapa
          minZoom={7}// impede o zoom fora

          // isso é como se fosse uma parede, sempre que vai para fora da area, ele volta
          maxBoundsViscosity={1.0}
        >
          {/* Camada de "pele" do mapa */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* um exemplo de pin */}
          <Marker position={[-25.4284, -49.2733]}> 
            <Popup>
              <b>Curitiba</b> <br /> Este é um "Pin" de exemplo.
            </Popup>
          </Marker>
        </MapContainer>
      </Box>
    </Flex>
  );
}

export default MapPage;