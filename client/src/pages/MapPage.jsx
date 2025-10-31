//pagina do mapa

import React, { useState, useEffect } from 'react'; 
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { MapContainer, GeoJSON, Marker, Popup } from 'react-leaflet'; 
import 'leaflet/dist/leaflet.css'; // css lealeft (mapa)
import Logo from '../assets/mapadasorigens.png'; 
import ParchmentBg from '../assets/Acervo.png'; 
import axios from 'axios'; // para design do mapa

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
    [-27.0, -55.0], // Ponto sudoeste
    [-22.0, -48.0], // Ponto nordeste 
  ];

  // para guardar os estados do geojson
  const [geoData, setGeoData] = useState(null);

  // busca o geojson quando o componente carrega
  useEffect(() => {
    const geoJsonUrl = 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-41-mun.json';
    
    axios.get(geoJsonUrl)
      .then((response) => {
        // quando carrega guarda no estado
        setGeoData(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar o GeoJSON:", error);
      });
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
      // Trocamos 'bindPopup' por 'bindTooltip'
      layer.bindTooltip(
        feature.properties.name, 
        {
          sticky: true, 
          className: 'map-label' 
        }
      );
    }
  }

  return (
    <Flex 
      flex="1"       
      //imagem do fundo
      backgroundImage={ParchmentBg}
      backgroundSize="cover"
      backgroundPosition="center"
      direction="column"
      position="relative" // posição relativa para o logo
    >
      {/* logo */}
      <Flex 
        // posição absoluta para flutuar sobre o mapa
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
        minH="100vh" // ocupa tela toda
        color="gray.600"
        overflow="hidden"
        bg="transparent" 
      >
        <MapContainer 
          center={paranaPosition} // centraliza no Paraná
          zoom={7} //zoom para mostrar o estado
          
          style={{ 
            height: '100%', 
            width: '100%', 
            minHeight: '100vh', // ocupa toda a altura
            backgroundColor: 'transparent' 
          }}
          zoomControl={false}
          
          maxBounds={paranaBounds} //limites do mapa
          minZoom={7}// impede o zoom fora
          maxBoundsViscosity={1.0}
        >
          
          {/* renderiza o GeoJSON quando ele for carregado */}
          {geoData && (
            <GeoJSON 
              data={geoData} 
              style={geoJsonStyle}
              onEachFeature={onEachFeature} // Passa a função de "hover"
            />
          )}
          
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