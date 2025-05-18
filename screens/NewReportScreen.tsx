import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { API_BASE_URL } from '../services/config';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from "@react-navigation/native";

/**
 * Pantalla para crear una nueva denuncia.
 * 
 * Este componente permite al usuario capturar una imagen, obtener su ubicación,
 * ingresar un título y descripción de la denuncia, y seleccionar la administración responsable.
 * La administración aparece directamente en el desplegable si se consigue geolocalizar
 * al usuario. Este es un ejercicio académico, de modo que las administraciones se definen
 * mediante un punto geográfico y un radio de competencia de 50km.
 * La denuncia se envía al servidor cuando el usuario presiona el botón de "Enviar denuncia".
 * 
 * @returns {React.Element} La pantalla de creación de denuncia.
 */
export default function NewReportScreen() {
  // Estados para almacenar imagen, ubicación, administraciones, y el resto de campos
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [administrations, setAdministrations] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Es necesario solicitar permiso al usuario para obtener la geolocalización
  useEffect(() => {
    (async () => {      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Se necesita acceso a la ubicación.');
        return;
      }

      /** IMPORTANTE: Para proteger la intimidad del evaluador de esta PR, esto permite
       * que se obtenga una geolocalización aproximada pero distinta a la real.
       * El usuario puede decidir si quiere que la localización sea precisa(real) 
       * o simulada(un punto aleatorio dentro del radio de competencia de la administración) */
      const realLoc = await Location.getCurrentPositionAsync({});
      let finalCoords = realLoc.coords;
      
      // Verifica si el usuario ha activado el modo privacidad
      const privacyEnabled = (await SecureStore.getItemAsync("privacyMode")) === "true";
      
      if (privacyEnabled) {
        finalCoords = randomLocationInRadius(realLoc.coords, 50); // Genera una ubicación aleatoria dentro de un radio de 50 km
      }
      
      setLocation(finalCoords); // Guarda la ubicación final

      // Cargamos las administraciones disponibles
      try {
        const token = await SecureStore.getItemAsync('authToken');
      
        const response = await axios.get(`${API_BASE_URL}/administrations`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
      
        setAdministrations(response.data); 

        // En función de la ubicación del usuario, intentamos
        // localizar la administración más cercana (radio 50km)
        const match = response.data.find(admin => {
          const dist = getDistanceKm(
            finalCoords.latitude,
            finalCoords.longitude,
            admin.latitude,
            admin.longitude
          );
          
          return dist <= 50; 
        });
      
        if (match) {
          setSelectedAdminId(match.id.toString()); 
        } else {
          setSelectedAdminId('');
        }
      
      } catch (error) {
        console.error('Error al obtener administraciones:', error);
        Alert.alert('Error', 'No se pudieron cargar las administraciones.');
      } finally {
        setLoading(false); 
      }
    })();
  }, []);

  /**
   * Abre la cámara para capturar una imagen.
   * 
   * Esta función abre la cámara y, si el usuario captura una imagen, la guarda en el estado.
   */
  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.6, 
      });
     
    if (!result.canceled) {
      setImage(result.assets[0].uri); 
    }
  };

  /**
   * Calcula la distancia en kilómetros entre dos puntos geográficos.
   * NOTA: Debo reconocer que esto no es mío. 
   * https://stackoverflow.com/questions/72867971/distance-calculation-gives-strange-output-javascript
   * @param {number} lat1 - Latitud del primer punto.
   * @param {number} lon1 - Longitud del primer punto.
   * @param {number} lat2 - Latitud del segundo punto.
   * @param {number} lon2 - Longitud del segundo punto.
   * @returns {number} La distancia en kilómetros entre los dos puntos.
   */
  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1); 
    const dLon = deg2rad(lon2 - lon1); 
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  };

  /**
   * Convierte grados a radianes.
   * 
   * @param {number} deg - El valor en grados a convertir.
   * @returns {number} El valor en radianes.
   */
  const deg2rad = deg => deg * (Math.PI / 180);

  /**
   * Genera una ubicación aleatoria dentro de un radio determinado a partir de un punto central.
   * NOTA: Esto tampoco es mío:
   * https://jordinl.com/posts/2019-02-15-how-to-generate-random-geocoordinates-within-given-radius?utm_source=chatgpt.com
   * https://stackoverflow.com/questions/31192451/generate-random-geo-coordinates-within-specific-radius-from-seed-point?utm_source=chatgpt.com
   * @param {object} center - El centro con las coordenadas {latitude, longitude}.
   * @param {number} radiusInKm - El radio en kilómetros.
   * @returns {object} Las nuevas coordenadas aleatorias.
   */
  function randomLocationInRadius(center: { latitude: number; longitude: number }, radiusInKm: number) {
    const radiusInMeters = radiusInKm * 1000;
    const y0 = center.latitude;
    const x0 = center.longitude;
    const rd = radiusInMeters / 111300; 
  
    const u = Math.random();
    const v = Math.random();
    const w = rd * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);
  
    const newLat = y0 + y;
    const newLon = x0 + x / Math.cos((y0 * Math.PI) / 180);
  
    return { latitude: newLat, longitude: newLon };
  }
  
  /**
   * Control de envío del formulario para nueva denuncia.
   * 
   * Validación de campos.
   */
  const handleSubmit = async () => {    
    if (!title || !description || !selectedAdminId || !image || !location) {
      Alert.alert('Completa todos los campos');
      return;
    }
  
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const formData = new FormData();
        
      formData.append('title', title);
      formData.append('description', description);
      formData.append('administration_id', selectedAdminId);
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
    
      formData.append('image', {
        uri: image,
        name: 'denuncia.jpg',
        type: 'image/jpeg',
      });
    
      const response = await axios.post(`${API_BASE_URL}/reports`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Eureka!! Se ha enviado!!
      Alert.alert(
        '✅ Enviado',
        'La denuncia se ha enviado correctamente.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'MainTabs' }],
                })
              );
            },
          },
        ]
      );
            
      
      setImage(null);
      setTitle('');
      setDescription('');
      setSelectedAdminId('');
    } catch (error) {
      console.error('Error al enviar denuncia:', error);
      Alert.alert('❌ Error', 'No se pudo enviar la denuncia.');
    }
  };

  if (loading || !location) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#1E3A34" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Vista previa de la imagen seleccionada o un marcador de foto */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>📷 Capturar foto</Text>
          </View>
        )}
        {/* Botón para abrir la cámara */}
        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
          <Ionicons name="camera" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Campos para el título y la descripción de la denuncia */}
      <TextInput
        placeholder="Título"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Descripción"
        style={[styles.input, { height: 80 }]}
        value={description}
        multiline
        onChangeText={setDescription}
      />

      {/* Mapa */}
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={location} />
      </MapView>

      {/* Selector de administración */}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedAdminId}
          onValueChange={(itemValue) => setSelectedAdminId(itemValue)}
        >
          <Picker.Item label="Seleccione Administración responsable" value="" />
          {administrations.map(admin => (
            <Picker.Item key={admin.id} label={admin.name} value={admin.id.toString()} />
          ))}
        </Picker>
      </View>

      {/* Botón para enviar la denuncia */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (!title || !description || !selectedAdminId || !image) && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={!title || !description || !selectedAdminId || !image}
      >
        <Text style={styles.submitText}>Enviar denuncia</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEAE3',
    paddingHorizontal: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 40,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  imagePicker: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  imageText: {
    fontSize: 16,
    color: '#1E3A34',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  map: {
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  pickerWrapper: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  submitButton: {
    backgroundColor: '#1E3A34',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#1E3A34',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
});
